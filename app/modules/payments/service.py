import uuid
from sqlalchemy.orm import Session

from app.modules.payments.enums import PaymentStatus
from app.modules.payments.model import Payment
from app.modules.payments.repository import PaymentRepository
from app.modules.properties.repository import PropertyRepository
from app.modules.requests.repository import RequestRepository


class PaymentService:
    def __init__(self) -> None:
        self.repo = PaymentRepository()
        self.property_repo = PropertyRepository()
        self.request_repo = RequestRepository()
        
    
    def create(
        self,
        db: Session,
        request_id: bytes,
        owner_id: bytes,
        tenant_id: bytes,
        amount: int,
        method: str,
        reference: str | None,
        status: PaymentStatus,
    ) -> Payment:
        existing = self.repo.get_by_request_id(db, request_id)
        if existing:
            raise ValueError("Payment already recorded for this request")

        payment = Payment(
            request_id=request_id,
            owner_id=owner_id,
            tenant_id=tenant_id,
            amount=amount,
            method=method,
            reference=reference,
            status=status.value,
        )
        property_id = self.request_repo.get_property_id(db, request_id)
        self.property_repo.mark_as_unavailable(db, property_id)
        return self.repo.create(db, payment)

    def to_response(self, p: Payment) -> dict:
        return {
            "id": str(uuid.UUID(bytes=p.id)),
            "request_id": str(uuid.UUID(bytes=p.request_id)),
            "owner_id": str(uuid.UUID(bytes=p.owner_id)),
            "tenant_id": str(uuid.UUID(bytes=p.tenant_id)),
            "amount": p.amount,
            "method": p.method,
            "reference": p.reference,
            "status": p.status,
        }
    def list_payments_for_owner(self, db: Session, owner_id: bytes) -> list[Payment]:
        return self.repo.list_for_owner(db, owner_id)
    def  list_payments_for_tenant(self, db: Session, tenant_id: bytes) -> list[Payment]:
        return self.repo.list_for_tenant(db, tenant_id)
    def to_response_list(self, payments: list[Payment]) -> list[dict]:
        return [self.to_response(p) for p in payments]    