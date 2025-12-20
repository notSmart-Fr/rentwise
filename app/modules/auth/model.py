import uuid
from datetime import datetime

from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.dialects.sqlite import BLOB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

def _uuid_blob() -> bytes:
    return uuid.uuid4().bytes

class User(Base):
    __tablename__ = "users"

    id: Mapped[bytes] = mapped_column(BLOB, primary_key=True, default=_uuid_blob)
    role: Mapped[str] = mapped_column(String(10), nullable=False)  # OWNER / TENANT
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)

    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)