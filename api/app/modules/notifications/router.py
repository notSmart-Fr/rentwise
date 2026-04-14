import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.modules.auth.deps import get_current_user
from app.modules.auth.model import User
from app.modules.notifications.schemas import NotificationResponse
from app.modules.notifications.service import NotificationService

router = APIRouter(prefix="/notifications", tags=["notifications"])
service = NotificationService()

@router.get("", response_model=list[NotificationResponse])
def get_notifications(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.get_recent(db, current_user.id, limit)

@router.get("/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return {"count": service.get_unread_count(db, current_user.id)}

@router.post("/read")
def mark_all_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service.mark_as_read(db, current_user.id)
    return {"status": "ok"}

@router.post("/{notification_id}/read")
def mark_one_as_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service.mark_as_read(db, current_user.id, uuid.UUID(notification_id))
    return {"status": "ok"}
