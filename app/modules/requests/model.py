import uuid
from datetime import datetime

from sqlalchemy import UUID, String, DateTime

from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base



class RentalRequest(Base):
    __tablename__ = "rental_requests"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    property_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), index=True, nullable=False)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), index=True, nullable=False)
    owner_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), index=True, nullable=False)

    status: Mapped[str] = mapped_column(
        String(20), default="PENDING", nullable=False
    )  # PENDING / APPROVED / REJECTED

    message: Mapped[str | None] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)