import uuid
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from app.persistence.base_repo import BaseRepository
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

    def get_revenue_by_month(self, db: Session, owner_id: uuid.UUID) -> list[dict]:
        """
        Aggregates revenue by month for the last 6 months.
        """
        stmt = (
            select(
                func.date_trunc('month', Payment.created_at).label('month'),
                func.coalesce(func.sum(Payment.amount), 0).label('total')
            )
            .where(Payment.owner_id == owner_id, Payment.status == 'SUCCESS')
            .group_by(func.date_trunc('month', Payment.created_at))
            .order_by(func.date_trunc('month', Payment.created_at))
        )
        results = db.execute(stmt).all()
        return [{"month": r.month.strftime('%b %Y') if r.month else "Unknown", "amount": int(r.total)} for r in results]

