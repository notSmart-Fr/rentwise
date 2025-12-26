from fastapi import APIRouter
from fastapi.params import Depends

from app.db import session
from app.db.deps import get_db
from app.modules.auth.deps import require_tenant
from app.modules.auth.model import User
from app.modules.payments.schemas import PaymentResponse
from app.modules.payments.service import PaymentService


router = APIRouter(prefix="/tenant", tags=["payments"])

service = PaymentService()

@router.get("/payments", response_model=list[PaymentResponse])
def list_payments_for_tenant(
    db: session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    payments = service.list_payments_for_tenant(db, tenant.id)
    return service.to_response_list(payments)
