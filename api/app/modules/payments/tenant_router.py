import uuid
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.persistence.deps import get_db
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
async def initialize_payment(
    request_id: str,
    method: str,
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    payment = service.initialize_automated_payment(
        db=db,
        request_id=uuid.UUID(request_id),
        tenant_id=tenant.id,
        method=method
    )
    return service.to_response(payment)

@router.post("/payments/{payment_id}/verify", response_model=PaymentResponse)
async def verify_payment(
    payment_id: str,
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    # Verify ownership inside the service/repo logic if possible, 
    # but for now we'll do the simple layered check
    payment = await service.verify_automated_payment(
        db=db,
        payment_id=uuid.UUID(payment_id)
    )
    if payment.tenant_id != tenant.id:
         raise HTTPException(status_code=403, detail="Forbidden")
         
    return service.to_response(payment)

@router.get("/requests/{request_id}/payments", response_model=PaymentResponse)
def get_tenant_payment(
    request_id: str,
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    # Repository access standardized
    payment = service.repo.get_by_request_id(db, uuid.UUID(request_id))
    if not payment:
         raise HTTPException(status_code=404, detail="No payment recorded")
    
    if payment.tenant_id != tenant.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    return service.to_response(payment)

@router.get("/payments/{payment_id}/receipt")
def download_receipt(
    payment_id: str,
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    pid = uuid.UUID(payment_id)
    payment = service.get_or_404(db, pid)
    
    if payment.tenant_id != tenant.id:
        raise HTTPException(status_code=403, detail="Forbidden")
        
    pdf_buffer = service.generate_receipt_pdf(db, pid)
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=receipt-{payment.transaction_id}.pdf"}
    )

