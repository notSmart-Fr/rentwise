import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.modules.messages.repository import MessageRepository
from app.modules.messages.schemas import MessageResponse

from app.modules.messages.model import Message
from app.modules.auth.model import User
from app.modules.properties.model import Property
from app.modules.requests.model import RentalRequest
from app.modules.tickets.model import Ticket

from app.core.websocket import manager

class MessageService:
    def __init__(self):
        self.repo = MessageRepository()

    def get_or_create_conversation(self, db: Session, participant1_id: uuid.UUID, participant2_id: uuid.UUID, context_type: str, context_id: uuid.UUID):
        # We check if a conversation exists where BOTH participants are involved for this context
        conv = self.repo.get_conversation_by_context(db, context_type, context_id, participant1_id)
        
        # Double check that the existing conversation involves BOTH specific participants
        if conv:
            participants = [conv.participant1_id, conv.participant2_id]
            if participant2_id not in participants:
                # If context is PROPERTY and tenant is different, create a NEW conversation
                conv = None

        if not conv:
            conv = self.repo.create_conversation(db, participant1_id, participant2_id, context_type, context_id)
        return conv
    
    async def send_message(self, db: Session, context_type: str, context_id: uuid.UUID, sender_id: uuid.UUID, receiver_id: uuid.UUID, content: str):
        conv = self.get_or_create_conversation(db, sender_id, receiver_id, context_type, context_id)
        
        if sender_id not in [conv.participant1_id, conv.participant2_id]:
            raise HTTPException(status_code=403, detail="Not a participant in this conversation")
            
        msg = self.repo.add_message(db, conv.id, sender_id, content)
        
        # Broadcast via WebSocket
        await manager.send_personal_message({
            "type": "NEW_MESSAGE",
            "data": {
                "id": str(msg.id),
                "conversation_id": str(msg.conversation_id),
                "sender_id": str(msg.sender_id),
                "content": msg.content,
                "created_at": msg.created_at.isoformat(),
                "context_type": context_type,
                "context_id": str(context_id)
            }
        }, receiver_id)

        # Also push an INBOX_UPDATE to both participants so their lists refresh
        inbox_update = {"type": "INBOX_UPDATE", "data": {"conversation_id": str(conv.id)}}
        await manager.send_personal_message(inbox_update, receiver_id)
        await manager.send_personal_message(inbox_update, sender_id)

        return msg

    def get_messages(self, db: Session, context_type: str, context_id: uuid.UUID, requesting_user_id: uuid.UUID, receiver_id: uuid.UUID | None = None):
        # Find the specific thread for this participant pair
        conv = self.repo.get_conversation_by_context(db, context_type, context_id, requesting_user_id)
        
        if not conv:
            return []
        
        if requesting_user_id not in [conv.participant1_id, conv.participant2_id]:
            raise HTTPException(status_code=403, detail="Not a participant in this conversation")
            
        msgs = self.repo.get_messages_for_conversation(db, conv.id)
        return msgs

    def get_user_inbox(self, db: Session, user_id: uuid.UUID):
        convs = self.repo.get_user_conversations(db, user_id)
        inbox = []
        for conv in convs:
            # Other participant
            other_id = conv.participant2_id if conv.participant1_id == user_id else conv.participant1_id
            other_user = db.query(User).filter(User.id == other_id).first()
            
            # Context title
            title = "Conversation"
            if conv.context_type == "PROPERTY":
                entity = db.query(Property).filter(Property.id == conv.context_id).first()
                title = f"Inquiry: {entity.title}" if entity else "Property Inquiry"
            elif conv.context_type == "RENTAL_REQUEST":
                entity = db.query(RentalRequest).filter(RentalRequest.id == conv.context_id).first()
                title = f"Lease: {entity.property_title}" if entity else "Rental Request"
            elif conv.context_type == "TICKET":
                entity = db.query(Ticket).filter(Ticket.id == conv.context_id).first()
                title = f"Ticket: {entity.subject or 'No Subject'}" if entity else "Support Ticket"
            
            # Last message
            last_msg = db.query(Message).filter(Message.conversation_id == conv.id).order_by(Message.created_at.desc()).first()
            
            # Unread count (messages NOT sent by current user that are unread)
            unread = db.query(Message).filter(Message.conversation_id == conv.id, Message.sender_id != user_id, Message.is_read == False).count()
            
            inbox.append({
                "id": conv.id,
                "other_participant_id": other_id,
                "other_participant_name": other_user.full_name if other_user else "Unknown User",
                "context_type": conv.context_type,
                "context_id": conv.context_id,
                "context_title": title,
                "last_message": last_msg.content if last_msg else None,
                "last_message_at": last_msg.created_at if last_msg else None,
                "unread_count": unread
            })
        return inbox

    async def mark_as_read(self, db: Session, conversation_id: uuid.UUID, user_id: uuid.UUID):
        self.repo.mark_messages_as_read(db, conversation_id, user_id)
        # Notify user to refresh their inbox/unread counts
        await manager.send_personal_message({"type": "INBOX_UPDATE", "data": {"conversation_id": str(conversation_id)}}, user_id)
