import uuid
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.persistence.base_repo import BaseRepository
from app.modules.leases.model import Lease

class LeaseRepository(BaseRepository[Lease]):
    def __init__(self):
        super().__init__(Lease)

    def list_for_tenant(self, db: Session, tenant_id: uuid.UUID) -> list[Lease]:
        stmt = select(Lease).where(Lease.tenant_id == tenant_id)
        return list(db.execute(stmt).scalars().all())

    def get_active_for_property(self, db: Session, property_id: uuid.UUID) -> Lease | None:
        stmt = select(Lease).where(
            Lease.property_id == property_id,
            Lease.status == "ACTIVE"
        )
        return db.execute(stmt).scalar_one_or_none()
