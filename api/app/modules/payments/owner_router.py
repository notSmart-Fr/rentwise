import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.modules.auth.deps import require_owner
from app.modules.auth.model import User
from app.modules.requests.repository import RequestRepository
from app.modules.payments.schemas import PaymentCreateRequest, PaymentResponse, PaymentUpdateRequest
from app.modules.payments.service import PaymentService
from app.modules.payments.repository import PaymentRepository

router = APIRouter(prefix="/owner", tags=["payments"])

service = PaymentService()
repo = PaymentRepository()
req_repo = RequestRepository()

@router.post("/requests/{request_id}/payments", response_model=PaymentResponse)
def record_payment(
    request_id: str,
    payload: PaymentCreateRequest,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    req = req_repo.get_by_id(db, uuid.UUID(request_id))
    if not req or req.owner_id != owner.id:
        raise HTTPException(status_code=404, detail="Request not found")

    if req.status != "APPROVED":
        raise HTTPException(status_code=400, detail="Payment allowed only for approved requests")

    try:
        payment = service.create(
            db=db,
            request_id=req.id,
            owner_id=req.owner_id,
            tenant_id=req.tenant_id,
            amount=payload.amount,
            method=payload.method,
            reference=payload.reference,
            status=payload.status,
        )
        return service.to_response(payment)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/requests/{request_id}/payments", response_model=PaymentResponse)
def get_payment(
    request_id: str,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    req = req_repo.get_by_id(db, uuid.UUID(request_id))
    if not req or req.owner_id != owner.id:
        raise HTTPException(status_code=404, detail="Request not found")

    payment = repo.get_by_request_id(db, req.id)
    if not payment:
        raise HTTPException(status_code=404, detail="No payment recorded")

    return service.to_response(payment)
@router.get("/payments/{payment_id}", response_model=PaymentResponse)
def get_payment_by_id(
    payment_id: str,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    payment = repo.get_by_id(db, uuid.UUID(payment_id))
    if not payment or payment.owner_id != owner.id:
        raise HTTPException(status_code=404, detail="Payment not found")

    return service.to_response(payment)
@router.get("/payments", response_model=list[PaymentResponse])
def list_payments(
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    payments = service.list_payments_for_owner(db, owner.id)
    return service.to_response_list(payments)
@router.patch("/payments/{payment_id}", response_model=PaymentResponse)
def update_payment(
    payment_id: str,
    payload: PaymentUpdateRequest,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    payment = repo.get_by_id(db, uuid.UUID(payment_id))
    if not payment or payment.owner_id != owner.id:
        raise HTTPException(status_code=404, detail="Payment not found")

    if payload.amount is not None:
        payment.amount = payload.amount
    if payload.method is not None:
        payment.method = payload.method
    if payload.reference is not None:
        payment.reference = payload.reference
    if payload.status is not None:
        payment.status = payload.status

    payment = repo.update(db, payment)
    return service.to_response(payment)
