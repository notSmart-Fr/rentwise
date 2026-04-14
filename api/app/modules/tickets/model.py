import uuid
from datetime import datetime

from sqlalchemy import UUID, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.persistence.base import Base
from app.modules.auth.model import User
from app.modules.properties.model import Property

class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)
    property_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("properties.id"), index=True, nullable=False)
    owner_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    
    status: Mapped[str] = mapped_column(
        String(20), default="PENDING", nullable=False
    )  # PENDING / IN_PROGRESS / RESOLVED / REJECTED

    priority: Mapped[str] = mapped_column(
        String(20), default="LOW", nullable=False
    ) # LOW / MEDIUM / HIGH / EMERGENCY

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    tenant: Mapped["User"] = relationship(foreign_keys=[tenant_id])
    owner: Mapped["User"] = relationship(foreign_keys=[owner_id])
    property: Mapped["Property"] = relationship(foreign_keys=[property_id])
