import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.modules.auth.deps import require_tenant
from app.modules.auth.model import User
from app.modules.payments.schemas import PaymentResponse
from app.modules.payments.service import PaymentService
from app.modules.requests.repository import RequestRepository
from app.modules.properties.repository import PropertyRepository


router = APIRouter(prefix="/tenant", tags=["payments"])

service = PaymentService()
req_repo = RequestRepository()
prop_repo = PropertyRepository()

@router.get("/payments", response_model=list[PaymentResponse])
def list_payments_for_tenant(
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    payments = service.list_payments_for_tenant(db, tenant.id)
    return service.to_response_list(payments)

@router.post("/payments/initialize", response_model=PaymentResponse)
def initialize_payment(
    request_id: str,
    method: str,
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    req = req_repo.get_by_id(db, uuid.UUID(request_id))
    if not req or req.tenant_id != tenant.id:
        raise HTTPException(status_code=404, detail="Lease request not found")

    if req.status != "APPROVED":
        raise HTTPException(status_code=400, detail="Cannot pay for a request that is not approved")

    prop = prop_repo.get_by_id(db, req.property_id)
    if not prop or not prop.is_available:
        raise HTTPException(status_code=400, detail="Property is no longer available")

    try:
        payment = service.initialize_automated_payment(
            db=db,
            request_id=req.id,
            amount=prop.rent_amount,
            method=method,
            tenant_id=tenant.id,
            owner_id=req.owner_id
        )
        return service.to_response(payment)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/payments/{payment_id}/verify", response_model=PaymentResponse)
def verify_payment(
    payment_id: str,
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    try:
        payment = service.verify_automated_payment(
            db=db,
            payment_id=uuid.UUID(payment_id)
        )
        # Verify ownership
        if payment.tenant_id != tenant.id:
             raise HTTPException(status_code=403, detail="Forbidden")
             
        return service.to_response(payment)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/requests/{request_id}/payments", response_model=PaymentResponse)
def get_tenant_payment(
    request_id: str,
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    req = req_repo.get_by_id(db, uuid.UUID(request_id))
    if not req or req.tenant_id != tenant.id:
        raise HTTPException(status_code=404, detail="Request not found")

    payment = service.repo.get_by_request_id(db, req.id)
    if not payment:
         raise HTTPException(status_code=404, detail="No payment recorded")

    return service.to_response(payment)
