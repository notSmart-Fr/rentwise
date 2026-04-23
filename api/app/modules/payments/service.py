import uuid
from sqlalchemy.orm import Session
from app.persistence.base_service import BaseService
from app.modules.payments.enums import PaymentStatus
from app.modules.payments.model import Payment
from app.modules.payments.repository import PaymentRepository
from app.modules.properties.repository import PropertyRepository
from app.modules.requests.repository import RequestRepository
from app.modules.notifications.service import NotificationService
from app.modules.leases.service import LeaseService
from app.utils.pdf import render_to_pdf

class PaymentService(BaseService[Payment]):
    def __init__(self) -> None:
        super().__init__(Payment, PaymentRepository())
        self.property_repo = PropertyRepository()
        self.request_repo = RequestRepository()
        self.notif_service = NotificationService()
        self.lease_service = LeaseService()

    async def create_manual_payment(
        self,
        db: Session,
        request_id: uuid.UUID,
        owner_id: uuid.UUID,
        tenant_id: uuid.UUID,
        amount: int,
        method: str,
        reference: str | None = None,
        status: str = "SUCCESS"
    ) -> Payment:
        # Validate request via Repository check
        req = self.request_repo.get_by_id(db, request_id)
        if not req or req.owner_id != owner_id:
            raise ValueError("Associated request not found or unauthorized")
        
        if req.status != "APPROVED":
            raise ValueError("Payments can only be recorded for approved requests")

        transaction_id = f"MANUAL-{uuid.uuid4().hex[:10].upper()}"
        
        payment = Payment(
            request_id=request_id,
            owner_id=owner_id,
            tenant_id=tenant_id,
            amount=amount,
            method=method,
            reference=reference,
            transaction_id=transaction_id,
            status=status
        )
        
        # If successfully paid, mark property as unavailable
        if status == "SUCCESS":
            self.property_repo.mark_as_unavailable(db, req.property_id)
            # Create notification for TENANT
            await self.notif_service.create_notification(
                db=db,
                user_id=tenant_id,
                title="Payment Recorded",
                message=f"A payment of {amount} has been recorded for {req.property.title}.",
                notif_type="PAYMENT",
                context_type="RENTAL_REQUEST",
                context_id=request_id
            )
            
            # PHASE 2: Create Lease automatically
            self.lease_service.create_lease_from_request(
                db=db,
                request_id=request_id,
                tenant_id=tenant_id,
                property_id=req.property_id,
                monthly_rent=amount
            )
            
        return self.repo.create(db, payment)

    def update_payment(
        self,
        db: Session,
        payment_id: uuid.UUID,
        owner_id: uuid.UUID,
        **updates
    ) -> Payment:
        payment = self.get_or_404(db, payment_id)
        if payment.owner_id != owner_id:
            raise ValueError("Unauthorized access to payment")
        
        return self.repo.update(db, payment, updates)

    def initialize_automated_payment(
        self,
        db: Session,
        request_id: uuid.UUID,
        tenant_id: uuid.UUID,
        method: str,
    ) -> Payment:
        # 1. Fetch and validate request using repo directly for multi-model logic
        req = self.request_repo.get_by_id(db, request_id)
        if not req or req.tenant_id != tenant_id:
            raise ValueError("Lease request not found or unauthorized")
        
        if req.status != "APPROVED":
            raise ValueError("Payments can only be initiated for approved lease requests")

        # 2. Validate property
        prop = self.property_repo.get_by_id(db, req.property_id)
        if not prop or not prop.is_available:
            raise ValueError("Property is no longer available")

        # 3. Check if payment already exists
        existing = self.repo.get_by_request_id(db, request_id)
        if existing:
            if existing.status == "SUCCESS":
                raise ValueError("Payment already completed for this request")
            return existing

        transaction_id = f"AUTO-{uuid.uuid4().hex[:12].upper()}"
        
        payment = Payment(
            request_id=request_id,
            owner_id=req.owner_id,
            tenant_id=tenant_id,
            amount=prop.rent_amount,
            method=method,
            transaction_id=transaction_id,
            status="INITIATED"
        )
        return self.repo.create(db, payment)

    async def verify_automated_payment(
        self,
        db: Session,
        payment_id: uuid.UUID,
        provider_reference: str | None = None
    ) -> Payment:
        payment = self.get_or_404(db, payment_id)
        
        if payment.status == "SUCCESS":
            return payment

        # SIMULATION logic preserved
        payment.status = "SUCCESS"
        payment.provider_reference = provider_reference or f"REF-{uuid.uuid4().hex[:8].upper()}"
        
        # Mark property as unavailable
        req = self.request_repo.get_by_id(db, payment.request_id)
        if req:
            self.property_repo.mark_as_unavailable(db, req.property_id)
            # Create notifications for OWNER
            await self.notif_service.create_notification(
                db=db,
                user_id=payment.owner_id,
                title="Payment Received",
                message=f"Received payment of {payment.amount} for {req.property.title}.",
                notif_type="PAYMENT",
                context_type="RENTAL_REQUEST",
                context_id=payment.request_id
            )
            
            # PHASE 2: Create Lease automatically
            self.lease_service.create_lease_from_request(
                db=db,
                request_id=payment.request_id,
                tenant_id=payment.tenant_id,
                property_id=req.property_id,
                monthly_rent=payment.amount
            )
        
        return self.repo.create(db, payment)

    def to_response(self, p: Payment) -> dict:
        data = super().to_response(p)
        # Ensure UUIDs are strings and format creation date
        data["id"] = str(p.id)
        data["request_id"] = str(p.request_id)
        data["owner_id"] = str(p.owner_id)
        data["tenant_id"] = str(p.tenant_id)
        data["created_at"] = p.created_at.isoformat() if p.created_at else None
        return data

    def list_payments_for_owner(self, db: Session, owner_id: uuid.UUID) -> list[Payment]:
        return self.repo.list_for_owner(db, owner_id)

    def list_payments_for_tenant(self, db: Session, tenant_id: uuid.UUID) -> list[Payment]:
        return self.repo.list_for_tenant(db, tenant_id)

    def get_analytics(self, db: Session, owner_id: uuid.UUID) -> dict:
        """
        Gathers both revenue and occupancy analytics for an owner.
        """
        try:
            # 1. Revenue Analytics
            revenue_data = self.repo.get_revenue_by_month(db, owner_id)
            
            # 2. Occupancy Analytics
            my_properties = self.property_repo.list_by_owner(db, owner_id)
            total = len(my_properties)
            rented = len([p for p in my_properties if not p.is_available])
            available = total - rented
            
            occupancy_data = [
                {"name": "Rented", "value": rented},
                {"name": "Available", "value": available}
            ] if total > 0 else [
                {"name": "Rented", "value": 0},
                {"name": "Available", "value": 0}
            ]

            return {
                "revenue": revenue_data,
                "occupancy": occupancy_data,
                "summary": {
                    "total_properties": int(total),
                    "active_leases": int(rented),
                    "total_revenue": int(sum(d["amount"] for d in revenue_data))
                }
            }
        except Exception as e:
            # Log the full error but return a helpful message
            import logging
            logging.getLogger("app").error(f"Analytics Error: {str(e)}", exc_info=True)
            return {
                "revenue": [],
                "occupancy": [{"name": "Error", "value": 1}],
                "summary": {"error": str(e)},
                "debug_info": "Check server logs for full traceback"
            }

    def generate_receipt_pdf(self, db: Session, payment_id: uuid.UUID):
        """
        Gathers all necessary data and renders a professional PDF receipt.
        """
        payment = self.get_or_404(db, payment_id)
        if payment.status != "SUCCESS":
            raise ValueError("Receipts can only be generated for successful payments")

        req = self.request_repo.get_by_id(db, payment.request_id)
        prop = self.property_repo.get_by_id(db, req.property_id)

        context = {
            "transaction_id": payment.transaction_id,
            "tenant_name": req.tenant.full_name,
            "tenant_email": req.tenant.email,
            "owner_name": req.owner.full_name,
            "owner_email": req.owner.email,
            "date": payment.created_at.strftime('%d %B %Y'),
            "method": payment.method,
            "property_title": prop.title,
            "property_area": prop.area,
            "property_city": prop.city,
            "amount": f"{payment.amount:,}"
        }

        return render_to_pdf("receipt.html", context)

    def export_payments_csv(self, db: Session, owner_id: uuid.UUID):
        """
        Generates a CSV of all payments for an owner.
        """
        import csv
        from io import StringIO
        
        payments = self.list_payments_for_owner(db, owner_id)
        
        output = StringIO()
        writer = csv.writer(output)
        
        # Headers
        writer.writerow(["Date", "Transaction ID", "Tenant", "Property", "Amount", "Method", "Status", "Reference"])
        
        for p in payments:
            writer.writerow([
                p.created_at.strftime('%Y-%m-%d %H:%M'),
                p.transaction_id,
                p.tenant.full_name if p.tenant else "N/A",
                p.request.property.title if p.request and p.request.property else "N/A",
                p.amount,
                p.method,
                p.status,
                p.provider_reference or p.reference or ""
            ])
            
        output.seek(0)
        return output



