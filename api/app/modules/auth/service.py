import uuid
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token
from app.modules.auth.enums import UserRole
from app.modules.auth.enums import UserRole
from app.modules.auth.model import User
from app.modules.auth.repository import UserRepository

class AuthService:
    def __init__(self) -> None:
        self.repo = UserRepository()

    def register(self, db: Session, role: str, full_name: str, email: str, phone: str | None, password: str) -> User:
        existing = self.repo.get_by_email(db, email)
        if existing:
            raise ValueError("Email already registered")

        user = User(
            role=role,
            full_name=full_name,
            email=email,
            phone=phone,
            password_hash=hash_password(password),
            is_verified=False,
        )
        return self.repo.create(db, user)

    def login(self, db: Session, email: str, password: str) -> str:
        user = self.repo.get_by_email(db, email)
        if not user:
            raise ValueError("ACCOUNT_NOT_FOUND")
        
        if not verify_password(password, user.password_hash):
            raise ValueError("INCORRECT_PASSWORD")

        # subject is user id as string
        subject = str(user.id)
        return create_access_token(subject=subject)

    def reset_password(self, db: Session, email: str, new_password: str):
        user = self.repo.get_by_email(db, email)
        if not user:
            raise ValueError("User not found")
        
        user.password_hash = hash_password(new_password)
        self.repo.create(db, user) # Repository.create uses db.add and commit, which works for updates too in this repo structure
