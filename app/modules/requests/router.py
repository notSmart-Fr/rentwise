import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.modules.auth.deps import get_current_user, require_owner, require_tenant
from app.modules.auth.model import User
from app.modules.properties.repository import PropertyRepository
from app.modules.requests.schemas import RequestCreate, RequestResponse
from app.modules.requests.service import RequestService
from app.modules.requests.repository import RequestRepository

router = APIRouter(tags=["requests"])
service = RequestService()
repo = RequestRepository()
prop_repo = PropertyRepository()

@router.post("tenant/properties/{property_id}/requests", response_model=RequestResponse)
def create_request(
    property_id: str,
    payload: RequestCreate,
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    prop_id = uuid.UUID(property_id).bytes
    prop = prop_repo.get_by_id(db, prop_id)
    if not prop or not prop.is_available:
        raise HTTPException(status_code=404, detail="Property not available")

    req = service.create(
        db,
        property_id=prop.id,
        tenant_id=tenant.id,
        owner_id=prop.owner_id,
        message=payload.message,
    )
    return service.to_response(req)

@router.get("/owner/requests", response_model=list[RequestResponse])
def owner_requests(
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    reqs = repo.list_for_owner(db, owner.id)
    return [service.to_response(r) for r in reqs]

@router.patch("/owner/requests/{request_id}/approve", response_model=RequestResponse)
def approve_request(
    request_id: str,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    req = repo.get_by_id(db, uuid.UUID(request_id).bytes)
    if not req or req.owner_id != owner.id:
        raise HTTPException(status_code=404, detail="Request not found")
    try:
        req = service.approve(db, req)
        return service.to_response(req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/owner/requests/{request_id}/reject", response_model=RequestResponse)
def reject_request(
    request_id: str,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    req = repo.get_by_id(db, uuid.UUID(request_id).bytes)
    if not req or req.owner_id != owner.id:
        raise HTTPException(status_code=404, detail="Request not found")
    try:
        req = service.reject(db, req)
        return service.to_response(req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
@router.get("/tenant/requests", response_model=list[RequestResponse])
def tenant_requests(
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    reqs = repo.list_for_tenant(db, tenant.id)
    return [service.to_response(r) for r in reqs]
@router.get("/tenant/requests/{request_id}", response_model=RequestResponse)
def get_tenant_request(
    request_id: str,
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    req = repo.get_by_id(db, uuid.UUID(request_id).bytes)
    if not req or req.tenant_id != tenant.id:
        raise HTTPException(status_code=404, detail="Request not found")
    return service.to_response(req)
@router.get("/owner/requests/{request_id}", response_model=RequestResponse)
def get_owner_request(
    request_id: str,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    req = repo.get_by_id(db, uuid.UUID(request_id).bytes)
    if not req or req.owner_id != owner.id:
        raise HTTPException(status_code=404, detail="Request not found")
    return service.to_response(req)
@router.delete("/tenant/requests/{request_id}", status_code=204)
def delete_tenant_request(
    request_id: str,
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    req = repo.get_by_id(db, uuid.UUID(request_id).bytes)
    if not req or req.tenant_id != tenant.id:
        raise HTTPException(status_code=404, detail="Request not found")
    repo.delete(db, req)    