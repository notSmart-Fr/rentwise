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

    def initialize_automated_payment(
        self,
        db: Session,
        request_id: uuid.UUID,
        amount: int,
        method: str,
        tenant_id: uuid.UUID,
        owner_id: uuid.UUID,
    ) -> Payment:
        # Check if payment already exists
        existing = self.repo.get_by_request_id(db, request_id)
        if existing:
            if existing.status == "SUCCESS":
                raise ValueError("Payment already completed")
            # Reuse initiated payment if it exists
            return existing

        transaction_id = f"TRX-{uuid.uuid4().hex[:12].upper()}"
        
        payment = Payment(
            request_id=request_id,
            owner_id=owner_id,
            tenant_id=tenant_id,
            amount=amount,
            method=method,
            transaction_id=transaction_id,
            status="INITIATED"
        )
        return self.repo.create(db, payment)

    def verify_automated_payment(
        self,
        db: Session,
        payment_id: uuid.UUID,
        provider_reference: str | None = None
    ) -> Payment:
        payment = self.repo.get_by_id(db, payment_id)
        if not payment:
            raise ValueError("Payment not found")
        
        if payment.status == "SUCCESS":
            return payment

        # SIMULATION: In a real app, we would verify with the gateway here
        payment.status = "SUCCESS"
        payment.provider_reference = provider_reference or f"REF-{uuid.uuid4().hex[:8].upper()}"
        
        # Mark property as unavailable
        property_id = self.request_repo.get_property_id(db, payment.request_id)
        self.property_repo.mark_as_unavailable(db, property_id)
        
        return self.repo.save(db, payment)

    def to_response(self, p: Payment) -> dict:
        return {
            "id": str(p.id),
            "request_id": str(p.request_id),
            "owner_id": str(p.owner_id),
            "tenant_id": str(p.tenant_id),
            "amount": p.amount,
            "method": p.method,
            "transaction_id": p.transaction_id,
            "provider_reference": p.provider_reference,
            "reference": p.reference,
            "status": p.status,
            "created_at": p.created_at.isoformat() if p.created_at else None
        }

    def list_payments_for_owner(self, db: Session, owner_id: bytes) -> list[Payment]:
        return self.repo.list_for_owner(db, owner_id)

    def list_payments_for_tenant(self, db: Session, tenant_id: bytes) -> list[Payment]:
        return self.repo.list_for_tenant(db, tenant_id)

    def to_response_list(self, payments: list[Payment]) -> list[dict]:
        return [self.to_response(p) for p in payments]
