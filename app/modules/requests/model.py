import uuid
from datetime import datetime

from sqlalchemy import String, DateTime
from sqlalchemy.dialects.sqlite import BLOB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

def _uuid_blob() -> bytes:
    return uuid.uuid4().bytes

class RentalRequest(Base):
    __tablename__ = "rental_requests"

    id: Mapped[bytes] = mapped_column(BLOB, primary_key=True, default=_uuid_blob)

    property_id: Mapped[bytes] = mapped_column(BLOB, index=True, nullable=False)
    tenant_id: Mapped[bytes] = mapped_column(BLOB, index=True, nullable=False)
    owner_id: Mapped[bytes] = mapped_column(BLOB, index=True, nullable=False)

    status: Mapped[str] = mapped_column(
        String(20), default="PENDING", nullable=False
    )  # PENDING / APPROVED / REJECTED

    message: Mapped[str | None] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)