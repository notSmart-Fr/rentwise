from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.payments.model import Payment

class PaymentRepository:
    def create(self, db: Session, payment: Payment) -> Payment:
        db.add(payment)
        db.commit()
        db.refresh(payment)
        return payment
    def update(self, db: Session, payment: Payment) -> Payment:
        db.commit()
        db.refresh(payment)
        return payment

    def get_by_request_id(self, db: Session, request_id: bytes) -> Payment | None:
        stmt = select(Payment).where(Payment.request_id == request_id)
        return db.execute(stmt).scalar_one_or_none()
    def list_for_owner(self, db: Session, owner_id: bytes) -> list[Payment]:
        stmt = select(Payment).where(Payment.owner_id == owner_id)
        return list(db.execute(stmt).scalars().all())
    def list_for_tenant(self, db: Session, tenant_id: bytes) -> list[Payment]:
        stmt = select(Payment).where(Payment.tenant_id == tenant_id)
        return list(db.execute(stmt).scalars().all())
    def get_by_id(self, db: Session, payment_id: bytes) -> Payment | None:
        stmt = select(Payment).where(Payment.id == payment_id)
        return db.execute(stmt).scalar_one_or_none()