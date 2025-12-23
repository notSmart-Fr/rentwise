import uuid
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.db.deps import get_db
from app.modules.auth.model import User
from app.modules.auth.repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
repo=UserRepository()
def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> User:
    try:
        payload = decode_token(token)
        user_id = uuid.UUID(payload["sub"]).bytes
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    user= repo.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

def require_owner(user: User = Depends(get_current_user)) -> User:
    if user.role != "OWNER":
        raise HTTPException(status_code=403, detail="Owner access required")
    return user
def require_tenant(user: User = Depends(get_current_user)) -> User:
    if user.role != "TENANT":
        raise HTTPException(status_code=403, detail="Tenant access required")
    return user