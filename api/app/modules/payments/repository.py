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
        from sqlalchemy import extract
        stmt = (
            select(
                extract('month', Payment.created_at).label('month_num'),
                extract('year', Payment.created_at).label('year_num'),
                func.coalesce(func.sum(Payment.amount), 0).label('total')
            )
            .where(Payment.owner_id == owner_id, Payment.status == 'SUCCESS')
            .group_by('year_num', 'month_num')
            .order_by('year_num', 'month_num')
        )
        results = db.execute(stmt).all()
        
        # Format for frontend: "Jan 2024"
        import calendar
        formatted = []
        for r in results:
            m_name = calendar.month_name[int(r.month_num)][:3]
            formatted.append({
                "month": f"{m_name} {int(r.year_num)}",
                "amount": int(r.total)
            })
        return formatted

