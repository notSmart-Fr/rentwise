import uuid
from sqlalchemy.orm import Session

from app.modules.requests.model import RentalRequest
from app.modules.requests.repository import RequestRepository

class RequestService:
    def __init__(self) -> None:
        self.repo = RequestRepository()

    def create(
        self,
        db: Session,
        property_id: bytes,
        tenant_id: bytes,
        owner_id: bytes,
        message: str | None,
    ) -> RentalRequest:
        existing = self.repo.get_active_request(db, property_id, tenant_id)
        if existing:
            raise ValueError("An active request already exists for this property and tenant")
        req = RentalRequest(
            property_id=property_id,
            tenant_id=tenant_id,
            owner_id=owner_id,
            message=message,
            status="PENDING",
        )
        return self.repo.create(db, req)
    

    def approve(self, db: Session, req: RentalRequest) -> RentalRequest:
        if req.status != "PENDING":
            raise ValueError("Only pending requests can be approved")
        req.status = "APPROVED"
        return self.repo.update(db, req)

    def reject(self, db: Session, req: RentalRequest) -> RentalRequest:
        if req.status != "PENDING":
            raise ValueError("Only pending requests can be rejected")
        req.status = "REJECTED"
        return self.repo.create(db, req)

    def to_response(self, r: RentalRequest) -> dict:
        return {
            "id": str(r.id),
            "property_id": str(r.property_id),
            "property_title": r.property.title if r.property else "Unknown Property",
            "tenant_id": str(r.tenant_id),
            "tenant_name": r.tenant.full_name if r.tenant else "Unknown Tenant",
            "tenant_email": r.tenant.email if r.tenant else None,
            "owner_id": str(r.owner_id),
            "status": r.status,
            "message": r.message,
            "created_at": r.created_at,
        }
