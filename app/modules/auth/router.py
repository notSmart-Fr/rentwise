import uuid
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi.security import OAuth2PasswordRequestForm
from app.db.deps import get_db
from app.core.security import decode_token
from app.modules.auth.schemas import RegisterRequest, LoginRequest, TokenResponse, MeResponse
from app.modules.auth.service import AuthService
from app.modules.auth.model import User

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

service = AuthService()

@router.post("/register", response_model=MeResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    try:
        user = service.register(db, payload.role, payload.full_name, payload.email, payload.phone, payload.password)
        return MeResponse(
            id=str(uuid.UUID(bytes=user.id)),
            role=user.role,
            full_name=user.full_name,
            email=user.email,
            phone=user.phone,
            is_verified=user.is_verified,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        # Swagger calls this "username", we treat it as email
        token = service.login(db, form_data.username, form_data.password)
        return TokenResponse(access_token=token)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = decode_token(token)
        user_id = uuid.UUID(payload["sub"]).bytes
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    stmt = select(User).where(User.id == user_id)
    user = db.execute(stmt).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.get("/me", response_model=MeResponse)
def me(current: User = Depends(get_current_user)):
    return MeResponse(
        id=str(uuid.UUID(bytes=current.id)),
        role=current.role,
        full_name=current.full_name,
        email=current.email,
        phone=current.phone,
        is_verified=current.is_verified,
    )