from app.db.base_service import BaseService
from app.modules.requests.model import RentalRequest
from app.modules.requests.repository import RequestRepository
from app.modules.properties.repository import PropertyRepository
from app.modules.notifications.service import NotificationService

class RequestService(BaseService[RentalRequest]):
    def __init__(self) -> None:
        super().__init__(RentalRequest, RequestRepository())
        self.notif_service = NotificationService()

    def create(
        self,
        db: Session,
        property_id: uuid.UUID,
        tenant_id: uuid.UUID,
        message: str | None,
    ) -> RentalRequest:
        # 1. Validate property
        prop = PropertyRepository().get_by_id(db, property_id)
        if not prop or not prop.is_available:
            raise ValueError("Property not found or is no longer available")
        
        # 2. Prevent self-renting (Business rule)
        if prop.owner_id == tenant_id:
            raise ValueError("Owners cannot rent their own properties")

        # 3. Check for existing active requests
        existing = self.repo.get_active_request(db, property_id, tenant_id)
        if existing:
            raise ValueError("An active request already exists for this property and tenant")

        req = RentalRequest(
            property_id=property_id,
            tenant_id=tenant_id,
            owner_id=prop.owner_id,
            message=message,
            status="PENDING",
        )
        return self.repo.create(db, req)
    
    async def approve(self, db: Session, req: RentalRequest) -> RentalRequest:
        if req.status != "PENDING":
            raise ValueError("Only pending requests can be approved")
        
        # Mark property as unavailable
        PropertyRepository().mark_as_unavailable(db, req.property_id)
        
        req.status = "APPROVED"
        updated_req = self.repo.create(db, req) # create handles save

        # Notify Tenant
        await self.notif_service.create_notification(
            db=db,
            user_id=req.tenant_id,
            title="Request Approved!",
            message=f"Your request for {req.property.title} has been approved. You can now proceed with payment.",
            notif_type="LEASE",
            context_type="RENTAL_REQUEST",
            context_id=req.id
        )
        
        return updated_req

    async def reject(self, db: Session, req: RentalRequest) -> RentalRequest:
        if req.status != "PENDING":
            raise ValueError("Only pending requests can be rejected")
        req.status = "REJECTED"
        updated_req = self.repo.create(db, req)

        # Notify Tenant
        await self.notif_service.create_notification(
            db=db,
            user_id=req.tenant_id,
            title="Request Update",
            message=f"Your request for {req.property.title} was not accepted at this time.",
            notif_type="LEASE",
            context_type="RENTAL_REQUEST",
            context_id=req.id
        )

        return updated_req

    def to_response(self, r: RentalRequest) -> dict:
        data = super().to_response(r)
        
        # Add human-readable titles and specific joins
        data["property_title"] = r.property.title if r.property else "Unknown Property"
        data["property_rent"] = r.property.rent_amount if r.property else 0
        data["property_area"] = r.property.area if r.property else None
        data["property_city"] = r.property.city if r.property else None
        data["tenant_name"] = r.tenant.full_name if r.tenant else "Unknown Tenant"
        data["tenant_email"] = r.tenant.email if r.tenant else None
        data["owner_name"] = r.owner.full_name if r.owner else "Property Owner"
        
        # Ensure UUIDs are strings
        for field in ["id", "property_id", "tenant_id", "owner_id"]:
            if field in data:
                data[field] = str(data[field])

        # Add payment info if it exists
        if hasattr(r, 'payment') and r.payment:
            data["payment"] = {
                "id": str(r.payment.id),
                "status": r.payment.status,
                "amount": r.payment.amount,
                "method": r.payment.method,
                "transaction_id": r.payment.transaction_id,
            }
        
        return data

    def get_for_owner(self, db: Session, request_id: uuid.UUID, owner_id: uuid.UUID) -> RentalRequest:
        req = self.get_or_404(db, request_id)
        if req.owner_id != owner_id:
            raise ValueError("Unauthorized access to rental request")
        return req

    def get_for_tenant(self, db: Session, request_id: uuid.UUID, tenant_id: uuid.UUID) -> RentalRequest:
        req = self.get_or_404(db, request_id)
        if req.tenant_id != tenant_id:
            raise ValueError("Unauthorized access to rental request")
        return req

    def list_for_owner(self, db: Session, owner_id: uuid.UUID) -> list[RentalRequest]:
        return self.repo.list_for_owner(db, owner_id)

    def list_for_tenant(self, db: Session, tenant_id: uuid.UUID) -> list[RentalRequest]:
        return self.repo.list_for_tenant(db, tenant_id)
