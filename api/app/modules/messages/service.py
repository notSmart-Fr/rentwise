import uuid
from sqlalchemy.orm import Session
from app.persistence.base_service import BaseService
from app.modules.messages.model import Conversation, Message
from app.modules.messages.repository import MessageRepository
from app.modules.auth.model import User
from app.modules.properties.model import Property
from app.modules.requests.model import RentalRequest
from app.modules.tickets.model import Ticket
from app.core.websocket import manager

class MessageService(BaseService[Conversation]):
    def __init__(self):
        super().__init__(Conversation, MessageRepository())

    def get_or_create_conversation(self, db: Session, participant1_id: uuid.UUID, participant2_id: uuid.UUID, context_type: str, context_id: uuid.UUID):
        # Specific pair check
        conv = self.repo.get_conversation_by_context(db, context_type, context_id, participant1_id)
        
        if conv:
            participants = [conv.participant1_id, conv.participant2_id]
            if participant2_id not in participants:
                conv = None

        if not conv:
            conv = self.repo.create_conversation(db, participant1_id, participant2_id, context_type, context_id)
        return conv
    
    def resolve_receiver(self, db: Session, context_type: str, context_id: uuid.UUID, sender_id: uuid.UUID, provided_receiver_id: uuid.UUID | None = None) -> uuid.UUID:
        conv = self.repo.get_conversation_by_context(db, context_type, context_id, sender_id)
        if conv:
            return conv.participant2_id if conv.participant1_id == sender_id else conv.participant1_id

        if context_type == "RENTAL_REQUEST":
            req = db.query(RentalRequest).filter(RentalRequest.id == context_id).first()
            if not req: raise ValueError("Rental request not found")
            return req.owner_id if sender_id == req.tenant_id else req.tenant_id
        
        elif context_type == "TICKET":
            ticket = db.query(Ticket).filter(Ticket.id == context_id).first()
            if not ticket: raise ValueError("Ticket not found")
            return ticket.owner_id if sender_id == ticket.tenant_id else ticket.tenant_id
        
        elif context_type == "PROPERTY":
            prop = db.query(Property).filter(Property.id == context_id).first()
            if not prop: raise ValueError("Property not found")
            if sender_id != prop.owner_id: return prop.owner_id
            if provided_receiver_id: return provided_receiver_id
            raise ValueError("Receiver ID required for owner-initiated property inquiries")
            
        raise ValueError(f"Unsupported context_type: {context_type}")

    async def send_message(self, db: Session, context_type: str, context_id: uuid.UUID, sender_id: uuid.UUID, receiver_id: uuid.UUID | None, content: str):
        resolved_receiver_id = self.resolve_receiver(db, context_type, context_id, sender_id, receiver_id)
        conv = self.get_or_create_conversation(db, sender_id, resolved_receiver_id, context_type, context_id)
        
        msg = self.repo.add_message(db, conv.id, sender_id, content)
        
        # Broadcast via WebSocket
        msg_data = {
            "id": str(msg.id),
            "conversation_id": str(msg.conversation_id),
            "sender_id": str(msg.sender_id),
            "content": msg.content,
            "created_at": msg.created_at.isoformat(),
            "context_type": context_type,
            "context_id": str(context_id)
        }
        await manager.send_personal_message({"type": "NEW_MESSAGE", "data": msg_data}, resolved_receiver_id)

        inbox_update = {"type": "INBOX_UPDATE", "data": {"conversation_id": str(conv.id)}}
        await manager.send_personal_message(inbox_update, resolved_receiver_id)
        await manager.send_personal_message(inbox_update, sender_id)

        return msg

    def get_messages(self, db: Session, context_type: str, context_id: uuid.UUID, requesting_user_id: uuid.UUID, other_participant_id: str | None = None):
        other_uuid = uuid.UUID(other_participant_id) if other_participant_id else None
        
        # If we have the other participant's ID, we can get the unique conversation
        if other_uuid:
            # Check both directions
            from sqlalchemy import or_, and_
            conv = db.query(Conversation).filter(
                Conversation.context_type == context_type,
                Conversation.context_id == context_id,
                or_(
                    and_(Conversation.participant1_id == requesting_user_id, Conversation.participant2_id == other_uuid),
                    and_(Conversation.participant1_id == other_uuid, Conversation.participant2_id == requesting_user_id)
                )
            ).first()
        else:
            # Fallback to general lookup (only safe for unique contexts like TICKET or REQUEST)
            conv = self.repo.get_conversation_by_context(db, context_type, context_id, requesting_user_id)
            
        if not conv: return []
        return self.repo.get_messages_for_conversation(db, conv.id)

    def get_user_inbox(self, db: Session, user_id: uuid.UUID):
        convs = self.repo.get_user_conversations(db, user_id)
        inbox = []
        for conv in convs:
            if conv.participant1_id == conv.participant2_id:
                continue
                
            other_id = conv.participant2_id if conv.participant1_id == user_id else conv.participant1_id
            other_user = db.query(User).filter(User.id == other_id).first()
            
            user_role = "TENANT"
            title = "Conversation"
            status = None
            if conv.context_type == "PROPERTY":
                entity = db.query(Property).filter(Property.id == conv.context_id).first()
                title = f"Inquiry: {entity.title}" if entity else "Property Inquiry"
                status = "Available" if entity and entity.is_available else "Rented"
                if entity and entity.owner_id == user_id: user_role = "OWNER"
            elif conv.context_type == "RENTAL_REQUEST":
                entity = db.query(RentalRequest).filter(RentalRequest.id == conv.context_id).first()
                title = f"Lease: {entity.property_title}" if entity else "Rental Request"
                status = entity.status if entity else "Unknown"
                if entity and entity.owner_id == user_id: user_role = "OWNER"
            elif conv.context_type == "TICKET":
                entity = db.query(Ticket).filter(Ticket.id == conv.context_id).first()
                title = f"Ticket: {entity.title}" if entity else "Support Ticket"
                status = entity.status if entity else "Unknown"
                if entity and entity.owner_id == user_id: user_role = "OWNER"
            
            last_msg = db.query(Message).filter(Message.conversation_id == conv.id).order_by(Message.created_at.desc()).first()
            unread = db.query(Message).filter(Message.conversation_id == conv.id, Message.sender_id != user_id, Message.is_read == False).count()
            
            inbox.append({
                "id": str(conv.id),
                "other_participant_id": str(other_id),
                "other_participant_name": other_user.full_name if other_user else "Unknown User",
                "context_type": conv.context_type,
                "context_id": str(conv.context_id),
                "context_title": title,
                "context_status": status,
                "user_role": user_role,
                "last_message": last_msg.content if last_msg else None,
                "last_message_at": last_msg.created_at.isoformat() if last_msg else None,
                "unread_count": unread
            })
        return inbox

    async def mark_as_read(self, db: Session, conversation_id: uuid.UUID, user_id: uuid.UUID):
        self.repo.mark_messages_as_read(db, conversation_id, user_id)
        await manager.send_personal_message({"type": "INBOX_UPDATE", "data": {"conversation_id": str(conversation_id)}}, user_id)
