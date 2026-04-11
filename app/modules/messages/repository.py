import uuid
from sqlalchemy.orm import Session
from app.modules.messages.model import Conversation, Message

class MessageRepository:
    def get_conversation_by_context(self, db: Session, context_type: str, context_id: uuid.UUID) -> Conversation | None:
        return db.query(Conversation).filter(
            Conversation.context_type == context_type,
            Conversation.context_id == context_id
        ).first()

    def create_conversation(self, db: Session, participant1_id: uuid.UUID, participant2_id: uuid.UUID, context_type: str, context_id: uuid.UUID) -> Conversation:
        conv = Conversation(
            participant1_id=participant1_id,
            participant2_id=participant2_id,
            context_type=context_type,
            context_id=context_id
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)
        return conv

    def add_message(self, db: Session, conversation_id: uuid.UUID, sender_id: uuid.UUID, content: str) -> Message:
        msg = Message(
            conversation_id=conversation_id,
            sender_id=sender_id,
            content=content
        )
        db.add(msg)
        db.commit()
        db.refresh(msg)
        
        # update conversation updated_at ? Not strictly necessary but good practice
        # conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        # conv.updated_at = datetime.utcnow()
        # db.commit()
        
        return msg

    def get_messages_for_conversation(self, db: Session, conversation_id: uuid.UUID) -> list[Message]:
        return db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at.asc()).all()

    def get_conversation_by_id(self, db: Session, conversation_id: uuid.UUID) -> Conversation | None:
        return db.query(Conversation).filter(Conversation.id == conversation_id).first()
