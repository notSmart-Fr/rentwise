import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.persistence.deps import get_db
from app.modules.auth.deps import require_owner, require_tenant
from app.modules.auth.model import User
from app.modules.properties.repository import PropertyRepository
from app.modules.requests.schemas import RequestCreate, RequestResponse
from app.modules.requests.service import RequestService
from app.modules.requests.repository import RequestRepository

router = APIRouter(tags=["requests"])
service = RequestService()

@router.post("/tenant/properties/{property_id}/requests", response_model=RequestResponse)
def create_request(
    property_id: uuid.UUID,
    payload: RequestCreate,
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    req = service.create(
        db,
        property_id=property_id,
        tenant_id=tenant.id,
        message=payload.message,
    )
    return service.to_response(req)

@router.get("/owner/requests", response_model=list[RequestResponse])
def owner_requests(
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    reqs = service.list_for_owner(db, owner.id)
    return service.to_response_list(reqs)

@router.get("/tenant/requests", response_model=list[RequestResponse])
def tenant_requests(
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    reqs = service.list_for_tenant(db, tenant.id)
    return service.to_response_list(reqs)

@router.patch("/owner/requests/{request_id}/approve", response_model=RequestResponse)
async def approve_request(
    request_id: uuid.UUID,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    req = service.get_for_owner(db, request_id, owner.id)
    req = await service.approve(db, req)
    return service.to_response(req)

@router.patch("/owner/requests/{request_id}/reject", response_model=RequestResponse)
async def reject_request(
    request_id: uuid.UUID,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    req = service.get_for_owner(db, request_id, owner.id)
    req = await service.reject(db, req)
    return service.to_response(req)

@router.get("/tenant/requests/{request_id}", response_model=RequestResponse)
def get_tenant_request(
    request_id: uuid.UUID,
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    req = service.get_for_tenant(db, request_id, tenant.id)
    return service.to_response(req)

@router.get("/owner/requests/{request_id}", response_model=RequestResponse)
def get_owner_request(
    request_id: uuid.UUID,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    req = service.get_for_owner(db, request_id, owner.id)
    return service.to_response(req)

@router.delete("/tenant/requests/{request_id}", status_code=204)
def delete_tenant_request(
    request_id: uuid.UUID,
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    req = service.get_for_tenant(db, request_id, tenant.id)
    service.repo.delete(db, req)
    
