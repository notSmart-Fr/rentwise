import uuid
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.persistence.base_repo import BaseRepository
from app.modules.requests.model import RentalRequest

class RequestRepository(BaseRepository[RentalRequest]):
    def __init__(self):
        super().__init__(RentalRequest)

    def list_for_owner(self, db: Session, owner_id: uuid.UUID) -> list[RentalRequest]:
        stmt = select(RentalRequest).where(RentalRequest.owner_id == owner_id)
        return list(db.execute(stmt).scalars().all())

    def list_for_tenant(self, db: Session, tenant_id: uuid.UUID) -> list[RentalRequest]:
        stmt = select(RentalRequest).where(RentalRequest.tenant_id == tenant_id)
        return list(db.execute(stmt).scalars().all())

    def get_active_request(self, db: Session, property_id: uuid.UUID, tenant_id: uuid.UUID) -> RentalRequest | None:
        stmt = select(RentalRequest).where(
            RentalRequest.property_id == property_id,
            RentalRequest.tenant_id == tenant_id,
            RentalRequest.status == "PENDING"
        )
        return db.execute(stmt).scalar_one_or_none()

    def get_property_id(self, db: Session, request_id: uuid.UUID) -> uuid.UUID:
        stmt = select(RentalRequest.property_id).where(RentalRequest.id == request_id)
        result = db.execute(stmt).scalar_one()
        return result
