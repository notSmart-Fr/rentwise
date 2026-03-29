from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.requests.model import RentalRequest

class RequestRepository:
    def create(self, db: Session, req: RentalRequest) -> RentalRequest:
        db.add(req)
        db.commit()
        db.refresh(req)
        return req

    def get_by_id(self, db: Session, req_id: bytes) -> RentalRequest | None:
        stmt = select(RentalRequest).where(RentalRequest.id == req_id)
        return db.execute(stmt).scalar_one_or_none()

    def list_for_owner(self, db: Session, owner_id: bytes) -> list[RentalRequest]:
        stmt = select(RentalRequest).where(RentalRequest.owner_id == owner_id)
        return list(db.execute(stmt).scalars().all())
    def list_for_tenant(self, db: Session, tenant_id: bytes) -> list[RentalRequest]:
        stmt = select(RentalRequest).where(RentalRequest.tenant_id == tenant_id)
        return list(db.execute(stmt).scalars().all())
    def get_active_request(self, db: Session, property_id: bytes, tenant_id: bytes) -> RentalRequest | None:
        stmt = select(RentalRequest).where(
            RentalRequest.property_id == property_id,
            RentalRequest.tenant_id == tenant_id,
            RentalRequest.status == "PENDING"
        )
        return db.execute(stmt).scalar_one_or_none()
    def get_property_id(self, db: Session, request_id: bytes) -> bytes:
        stmt = select(RentalRequest.property_id).where(RentalRequest.id == request_id)
        result = db.execute(stmt).scalar_one()
        return result
    def delete(self, db: Session, req: RentalRequest) -> None:
        db.delete(req)
        db.commit()
    def update(self, db: Session, req: RentalRequest) -> RentalRequest:
        db.commit()
        db.refresh(req)
        return req    
