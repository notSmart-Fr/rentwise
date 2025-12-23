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