from app.db.base_repo import BaseRepository
from app.modules.messages.model import Conversation, Message

class MessageRepository(BaseRepository[Conversation]):
    def __init__(self):
        super().__init__(Conversation)

    def get_conversation_by_context(self, db: Session, context_type: str, context_id: uuid.UUID, participant_id: uuid.UUID | None = None) -> Conversation | None:
        query = db.query(Conversation).filter(
            Conversation.context_type == context_type,
            Conversation.context_id == context_id
        )
        if participant_id:
            from sqlalchemy import or_
            query = query.filter(
                or_(
                    Conversation.participant1_id == participant_id,
                    Conversation.participant2_id == participant_id
                )
            )
        return query.first()

    def create_conversation(self, db: Session, participant1_id: uuid.UUID, participant2_id: uuid.UUID, context_type: str, context_id: uuid.UUID) -> Conversation:
        conv = Conversation(
            participant1_id=participant1_id,
            participant2_id=participant2_id,
            context_type=context_type,
            context_id=context_id
        )
        return self.create(db, conv)

    def add_message(self, db: Session, conversation_id: uuid.UUID, sender_id: uuid.UUID, content: str) -> Message:
        msg = Message(
            conversation_id=conversation_id,
            sender_id=sender_id,
            content=content
        )
        db.add(msg)
        db.commit()
        db.refresh(msg)
        return msg

    def get_messages_for_conversation(self, db: Session, conversation_id: uuid.UUID) -> list[Message]:
        return db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at.asc()).all()

    def get_user_conversations(self, db: Session, user_id: uuid.UUID) -> list[Conversation]:
        from sqlalchemy import or_
        return db.query(Conversation).filter(
            or_(
                Conversation.participant1_id == user_id,
                Conversation.participant2_id == user_id
            )
        ).order_by(Conversation.updated_at.desc()).all()

    def mark_messages_as_read(self, db: Session, conversation_id: uuid.UUID, receiver_id: uuid.UUID):
        db.query(Message).filter(
            Message.conversation_id == conversation_id,
            Message.sender_id != receiver_id,
            Message.is_read == False
        ).update({"is_read": True}, synchronize_session=False)
        db.commit()
