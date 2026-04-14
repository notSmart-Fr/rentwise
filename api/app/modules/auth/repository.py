import uuid
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.base_repo import BaseRepository
from app.modules.auth.model import User

class UserRepository(BaseRepository[User]):
    def __init__(self):
        super().__init__(User)

    def get_by_email(self, db: Session, email: str) -> User | None:
        stmt = select(User).where(User.email == email)
        return db.execute(stmt).scalar_one_or_none()
