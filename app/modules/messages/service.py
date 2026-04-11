import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.modules.messages.repository import MessageRepository
from app.modules.messages.schemas import MessageResponse

class MessageService:
    def __init__(self):
        self.repo = MessageRepository()

    def get_or_create_conversation(self, db: Session, participant1_id: uuid.UUID, participant2_id: uuid.UUID, context_type: str, context_id: uuid.UUID):
        conv = self.repo.get_conversation_by_context(db, context_type, context_id)
        if not conv:
            conv = self.repo.create_conversation(db, participant1_id, participant2_id, context_type, context_id)
        return conv
    
    def send_message(self, db: Session, context_type: str, context_id: uuid.UUID, sender_id: uuid.UUID, receiver_id: uuid.UUID, content: str):
        conv = self.get_or_create_conversation(db, sender_id, receiver_id, context_type, context_id)
        
        # Before adding, verify sender is participant
        if sender_id not in [conv.participant1_id, conv.participant2_id]:
            raise HTTPException(status_code=403, detail="Not a participant in this conversation")
            
        msg = self.repo.add_message(db, conv.id, sender_id, content)
        return msg

    def get_messages(self, db: Session, context_type: str, context_id: uuid.UUID, requesting_user_id: uuid.UUID):
        conv = self.repo.get_conversation_by_context(db, context_type, context_id)
        if not conv:
            return [] # No conversation yet
        
        if requesting_user_id not in [conv.participant1_id, conv.participant2_id]:
            raise HTTPException(status_code=403, detail="Not a participant in this conversation")
            
        msgs = self.repo.get_messages_for_conversation(db, conv.id)
        # We could map to response here
        return msgs
