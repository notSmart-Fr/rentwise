import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.persistence.deps import get_db
from app.modules.auth.deps import get_current_user
from app.modules.auth.model import User
from app.modules.leases.service import LeaseService
from app.modules.leases.schemas import LeaseResponse

router = APIRouter(prefix="/leases", tags=["leases"])
service = LeaseService()

@router.get("/owner/list", response_model=list[LeaseResponse])
def list_owner_leases(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Returns all leases for properties owned by the current user.
    """
    leases = service.get_by_owner(db, user.id)
    return service.to_response_list(leases)

@router.get("/my", response_model=list[LeaseResponse])
def list_my_leases(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Returns all leases associated with the current user (as tenant).
    """
    leases = service.get_by_tenant(db, user.id)
    return service.to_response_list(leases)

@router.get("/{lease_id}", response_model=LeaseResponse)
def get_lease(
    lease_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Fetches a specific lease and ensures the user is authorized to see it.
    """
    lid = uuid.UUID(lease_id)
    lease = service.get_or_404(db, lid)
    
    if lease.tenant_id != user.id:
        # Check if they are the owner of the property as well
        # (Owners should also be able to see leases for their properties)
        from app.modules.properties.repository import PropertyRepository
        prop_repo = PropertyRepository()
        prop = prop_repo.get_by_id(db, lease.property_id)
        if not prop or prop.owner_id != user.id:
            raise HTTPException(status_code=403, detail="Forbidden")
            
    return service.to_response(lease)
