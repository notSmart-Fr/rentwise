import uuid
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.base_repo import BaseRepository
from app.modules.payments.model import Payment

class PaymentRepository(BaseRepository[Payment]):
    def __init__(self):
        super().__init__(Payment)

    def get_by_request_id(self, db: Session, request_id: uuid.UUID) -> Payment | None:
        stmt = select(Payment).where(Payment.request_id == request_id)
        return db.execute(stmt).scalar_one_or_none()

    def list_for_owner(self, db: Session, owner_id: uuid.UUID) -> list[Payment]:
        stmt = select(Payment).where(Payment.owner_id == owner_id)
        return list(db.execute(stmt).scalars().all())

    def list_for_tenant(self, db: Session, tenant_id: uuid.UUID) -> list[Payment]:
        stmt = select(Payment).where(Payment.tenant_id == tenant_id)
        return list(db.execute(stmt).scalars().all())
