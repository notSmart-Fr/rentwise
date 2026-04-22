import uuid
from datetime import datetime

from sqlalchemy import String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.persistence.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    is_owner: Mapped[bool] = mapped_column(Boolean, default=False)
    is_tenant: Mapped[bool] = mapped_column(Boolean, default=True)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)

    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    verifications: Mapped[list["VerificationRequest"]] = relationship(back_populates="user")


class VerificationRequest(Base):
    __tablename__ = "verification_requests"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    
    document_type: Mapped[str] = mapped_column(String(50), nullable=False) # NID, Passport, TradeLicense
    document_url: Mapped[str] = mapped_column(String(512), nullable=False)
    
    status: Mapped[str] = mapped_column(String(20), default="PENDING") # PENDING, APPROVED, REJECTED
    
    reviewer_notes: Mapped[str | None] = mapped_column(String(512), nullable=True)
    
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    user: Mapped["User"] = relationship(back_populates="verifications")

