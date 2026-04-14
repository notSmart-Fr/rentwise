import uuid
from datetime import datetime

from sqlalchemy import UUID, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.modules.auth.model import User
from app.modules.properties.model import Property

from app.db.base import Base



class RentalRequest(Base):
    __tablename__ = "rental_requests"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    property_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("properties.id"), index=True, nullable=False)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)
    owner_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)

    # Relationships
    property: Mapped["Property"] = relationship(foreign_keys=[property_id])
    tenant: Mapped["User"] = relationship(foreign_keys=[tenant_id])
    owner: Mapped["User"] = relationship(foreign_keys=[owner_id])
    payment: Mapped["Payment"] = relationship("Payment", back_populates="request", uselist=False)

    status: Mapped[str] = mapped_column(
        String(20), default="PENDING", nullable=False
    )  # PENDING / APPROVED / REJECTED

    message: Mapped[str | None] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
