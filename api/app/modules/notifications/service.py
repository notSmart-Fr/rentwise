from app.db.base_service import BaseService
from app.modules.notifications.model import Notification
from app.modules.notifications.repository import NotificationRepository
from app.core.websocket import manager

class NotificationService(BaseService[Notification]):
    def __init__(self):
        super().__init__(Notification, NotificationRepository())

    async def create_notification(
        self, 
        db: Session, 
        user_id: uuid.UUID, 
        title: str, 
        message: str, 
        notif_type: str = "SYSTEM",
        context_type: str | None = None,
        context_id: uuid.UUID | None = None
    ) -> Notification:
        # 1. Persist to DB using Base Pattern
        notif = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notif_type,
            context_type=context_type,
            context_id=context_id
        )
        saved = self.repo.create(db, notif)
        
        # 2. Broadcast via WebSocket using standardized data
        await manager.send_personal_message({
            "type": "NEW_NOTIFICATION",
            "data": self.to_response(saved)
        }, user_id)
        
        return saved

    def get_recent(self, db: Session, user_id: uuid.UUID, limit: int = 20):
        return self.repo.list_for_user(db, user_id, limit)

    def mark_as_read(self, db: Session, user_id: uuid.UUID, notification_id: uuid.UUID | None = None):
        self.repo.mark_as_read(db, user_id, notification_id)
        
    def get_unread_count(self, db: Session, user_id: uuid.UUID) -> int:
        return self.repo.count_unread(db, user_id)

    def to_response(self, n: Notification) -> dict:
        data = super().to_response(n)
        # Type field mapping fix (model has 'type', schemas often use different names, but let's keep consistency)
        data["id"] = str(n.id)
        data["user_id"] = str(n.user_id)
        data["created_at"] = n.created_at.isoformat() if n.created_at else None
        data["context_id"] = str(n.context_id) if n.context_id else None
        return data
