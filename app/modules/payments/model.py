import uuid
from datetime import datetime

from sqlalchemy import String, Integer, DateTime
from sqlalchemy.dialects.sqlite import BLOB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

def _uuid_blob() -> bytes:
    return uuid.uuid4().bytes

class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[bytes] = mapped_column(BLOB, primary_key=True, default=_uuid_blob)

    request_id: Mapped[bytes] = mapped_column(BLOB, unique=True, index=True, nullable=False)
    owner_id: Mapped[bytes] = mapped_column(BLOB, index=True, nullable=False)
    tenant_id: Mapped[bytes] = mapped_column(BLOB, index=True, nullable=False)

    amount: Mapped[int] = mapped_column(Integer, nullable=False)

    method: Mapped[str] = mapped_column(String(10), nullable=False)  # CASH/BKASH/NAGAD/BANK
    reference: Mapped[str | None] = mapped_column(String(100), nullable=True)

    status: Mapped[str] = mapped_column(String(10), default="PAID", nullable=False)  # PENDING/PAID
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)