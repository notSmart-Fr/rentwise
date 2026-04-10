import uuid
from datetime import datetime

from sqlalchemy import UUID, String, Integer, DateTime

from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base



class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    request_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), unique=True, index=True, nullable=False)
    owner_id:   Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), index=True, nullable=False)
    tenant_id:  Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), index=True, nullable=False)
    amount: Mapped[int] = mapped_column(Integer, nullable=False)

    transaction_id:     Mapped[str | None] = mapped_column(String(50), unique=True, index=True, nullable=True)
    method:             Mapped[str] = mapped_column(String(20), nullable=False)  # CASH/BKASH/NAGAD/BANK/SSLCOMMERZ
    provider_reference: Mapped[str | None] = mapped_column(String(100), nullable=True)
    reference:          Mapped[str | None] = mapped_column(String(100), nullable=True)

    status: Mapped[str] = mapped_column(String(15), default="INITIATED", nullable=False)  # INITIATED/SUCCESS/FAILED/CANCELLED
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
