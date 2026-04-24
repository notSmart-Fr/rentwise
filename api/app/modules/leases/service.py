import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.persistence.base_service import BaseService
from app.modules.leases.model import Lease
from app.modules.leases.repository import LeaseRepository

class LeaseService(BaseService[Lease]):
    def __init__(self) -> None:
        super().__init__(Lease, LeaseRepository())

    def create_lease_from_request(
        self, 
        db: Session, 
        request_id: uuid.UUID,
        tenant_id: uuid.UUID,
        property_id: uuid.UUID,
        monthly_rent: int,
        duration_months: int = 12
    ) -> Lease:
        """
        Spawns a new lease based on an approved and paid rental request.
        """
        start_date = datetime.utcnow()
        # Default to 1 year lease if not specified
        end_date = start_date + timedelta(days=30 * duration_months)
        
        # Next payment is usually 1 month from now
        next_payment = start_date + timedelta(days=30)
        
        lease = Lease(
            request_id=request_id,
            tenant_id=tenant_id,
            property_id=property_id,
            start_date=start_date,
            end_date=end_date,
            monthly_rent=monthly_rent,
            due_day=start_date.day,
            status="ACTIVE",
            next_payment_date=next_payment
        )
        
        return self.repo.create(db, lease)

    def create_managed_lease(
        self,
        db: Session,
        owner_id: uuid.UUID,
        property_id: uuid.UUID,
        tenant_name: str,
        tenant_email: str | None = None,
        monthly_rent: int | None = None,
        start_date: datetime | None = None,
        duration_months: int = 12
    ) -> Lease:
        """
        Allows an owner to directly onboard a tenant (even without an account).
        Creates a 'Shadow User' if the email is provided, or uses a placeholder.
        """
        from app.modules.auth.model import User
        from app.core.security import hash_password
        from app.modules.properties.repository import PropertyRepository
        
        prop_repo = PropertyRepository()
        prop = prop_repo.get_by_id(db, property_id)
        
        if not prop or prop.owner_id != owner_id:
            raise ValueError("Property not found or unauthorized")

        # 1. Handle Tenant Identity (Shadow User)
        target_email = tenant_email or f"offline-{uuid.uuid4().hex[:8]}@rentwise.internal"
        
        from app.modules.auth.repository import UserRepository
        user_repo = UserRepository()
        tenant = user_repo.get_by_email(db, target_email)
        
        if not tenant:
            # Create a 'Shadow' user account
            tenant = User(
                full_name=tenant_name,
                email=target_email,
                is_owner=False,
                is_tenant=True,
                is_verified=False, # Important: Not verified until they claim it
                password_hash=hash_password(uuid.uuid4().hex) # Randomized locked password
            )
            tenant = user_repo.create(db, tenant)

        # 2. Create the Lease
        actual_rent = monthly_rent or prop.rent_amount
        actual_start = start_date or datetime.utcnow()
        end_date = actual_start + timedelta(days=30 * duration_months)
        
        lease = Lease(
            tenant_id=tenant.id,
            property_id=property_id,
            start_date=actual_start,
            end_date=end_date,
            monthly_rent=actual_rent,
            due_day=actual_start.day,
            status="ACTIVE",
            next_payment_date=actual_start + timedelta(days=30)
        )
        
        # 3. Mark Property as Occupied
        prop_repo.mark_as_unavailable(db, property_id)
        
        return self.repo.create(db, lease)

    def get_by_owner(self, db: Session, owner_id: uuid.UUID) -> list[Lease]:
        return self.repo.list_for_owner(db, owner_id)

    def get_by_tenant(self, db: Session, tenant_id: uuid.UUID) -> list[Lease]:
        return self.repo.list_for_tenant(db, tenant_id)

    def get_by_property(self, db: Session, property_id: uuid.UUID) -> Lease | None:
        return self.repo.get_active_for_property(db, property_id)

    def to_response(self, l: Lease) -> dict:
        data = super().to_response(l)
        # Populate metadata from relationships
        if l.property:
            data["property_title"] = l.property.title
            data["property_image"] = l.property.images[0] if l.property.images else None
        if l.tenant:
            data["tenant_name"] = l.tenant.full_name
        
        # Format dates for JSON
        data["start_date"] = l.start_date.isoformat()
        data["end_date"] = l.end_date.isoformat()
        data["next_payment_date"] = l.next_payment_date.isoformat() if l.next_payment_date else None
        
        return data
