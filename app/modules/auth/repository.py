from sqlalchemy.orm import Session
from sqlalchemy import select

from app.modules.auth.model import User

class UserRepository:
    def get_by_email(self, db: Session, email: str) -> User | None:
        stmt = select(User).where(User.email == email)
        return db.execute(stmt).scalar_one_or_none()

    def create(self, db: Session, user: User) -> User:
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    def get_by_id(self, db: Session, user_id: bytes) -> User | None:
        stmt = select(User).where(User.id == user_id)
        return db.execute(stmt).scalar_one_or_none()