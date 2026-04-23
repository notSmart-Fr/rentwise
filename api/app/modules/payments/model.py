import uuid
from datetime import datetime

from sqlalchemy import UUID, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.persistence.base import Base



class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    request_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("rental_requests.id"),
        unique=True, 
        index=True, 
        nullable=False
    )
    owner_id:   Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), index=True, nullable=False)
    tenant_id:  Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), index=True, nullable=False)
    amount: Mapped[int] = mapped_column(Integer, nullable=False)

    transaction_id:     Mapped[str | None] = mapped_column(String(50), unique=True, index=True, nullable=True)
    method:             Mapped[str] = mapped_column(String(20), nullable=False)  # CASH/BKASH/NAGAD/BANK/SSLCOMMERZ
    provider_reference: Mapped[str | None] = mapped_column(String(100), nullable=True)
    reference:          Mapped[str | None] = mapped_column(String(100), nullable=True)

    status: Mapped[str] = mapped_column(String(15), default="INITIATED", nullable=False)  # INITIATED/SUCCESS/FAILED/CANCELLED
    
    lease_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("leases.id"), nullable=True)

    # Relationships
    request: Mapped["RentalRequest"] = relationship("RentalRequest", back_populates="payment")
    lease: Mapped["Lease"] = relationship("Lease", back_populates="payments")

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
