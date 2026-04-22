import uuid
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.persistence.deps import get_db
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
async def record_payment(
    request_id: str,
    payload: PaymentCreateRequest,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    payment = await service.create_manual_payment(
        db=db,
        request_id=uuid.UUID(request_id),
        owner_id=owner.id,
        tenant_id=uuid.UUID(payload.tenant_id) if hasattr(payload, 'tenant_id') and payload.tenant_id else None,
        amount=payload.amount,
        method=payload.method,
        reference=payload.reference,
        status=payload.status,
    )
    return service.to_response(payment)

@router.get("/requests/{request_id}/payments", response_model=PaymentResponse)
def get_payment(
    request_id: str,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    # Logic in router minimized, but still needs to verify ownership
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
    payment = service.update_payment(
        db=db,
        payment_id=uuid.UUID(payment_id),
        owner_id=owner.id,
        **payload.model_dump(exclude_none=True)
    )
    return service.to_response(payment)

@router.get("/analytics")
def get_analytics(
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    return service.get_analytics(db, owner.id)

@router.get("/payments/{payment_id}/receipt")
def download_receipt(
    payment_id: str,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    pid = uuid.UUID(payment_id)
    payment = service.get_or_404(db, pid)
    
    if payment.owner_id != owner.id:
        raise HTTPException(status_code=403, detail="Forbidden")
        
    pdf_buffer = service.generate_receipt_pdf(db, pid)
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=receipt-{payment.transaction_id}.pdf"}
    )

@router.get("/payments/export/csv")
def export_payments(
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    csv_output = service.export_payments_csv(db, owner.id)
    
    return StreamingResponse(
        iter([csv_output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=rentwise-payments-export.csv"}
    )



