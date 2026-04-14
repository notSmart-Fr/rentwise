from app.db.base_repo import BaseRepository
from app.modules.notifications.model import Notification

class NotificationRepository(BaseRepository[Notification]):
    def __init__(self):
        super().__init__(Notification)

    def list_for_user(self, db: Session, user_id: uuid.UUID, limit: int = 20) -> list[Notification]:
        return db.query(Notification)\
            .filter(Notification.user_id == user_id)\
            .order_by(Notification.created_at.desc())\
            .limit(limit)\
            .all()

    def mark_as_read(self, db: Session, user_id: uuid.UUID, notification_id: uuid.UUID | None = None):
        query = db.query(Notification).filter(Notification.user_id == user_id)
        if notification_id:
            query = query.filter(Notification.id == notification_id)
        
        query.update({"is_read": True}, synchronize_session=False)
        db.commit()

    def count_unread(self, db: Session, user_id: uuid.UUID) -> int:
        return db.query(Notification).filter(Notification.user_id == user_id, Notification.is_read == False).count()
