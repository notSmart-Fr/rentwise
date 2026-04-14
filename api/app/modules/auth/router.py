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
from app.modules.auth.deps import oauth2_scheme, get_current_user
from app.core.security import decode_token, create_reset_token, decode_reset_token
from app.core.emails import send_password_reset_email
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

service = AuthService()

@router.post("/register", response_model=MeResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    try:
        user = service.register(db, payload.role, payload.full_name, payload.email, payload.phone, payload.password)
        return MeResponse(
            id=str(user.id),
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
        # Use exact error code for frontend processing
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/forgot-password")
def forgot_password(payload: dict, db: Session = Depends(get_db)):
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    # We check if user exists first to decide whether to send email
    # but for security we often return the same message.
    # However, since we are doing smart errors, we can be more open here or keep it generic.
    user = service.repo.get_by_email(db, email)
    if user:
        token = create_reset_token(email)
        reset_link = f"{settings.frontend_url}/reset-password?token={token}"
        send_password_reset_email(email, reset_link)
    
    # Return 200 even if email doesn't exist to prevent enumeration here 
    # (Smart errors are for login, forgot-password is best kept generic)
    return {"message": "If an account exists with this email, a reset link has been sent."}

@router.post("/reset-password")
def reset_password(payload: dict, db: Session = Depends(get_db)):
    token = payload.get("token")
    new_password = payload.get("password")
    if not token or not new_password:
        raise HTTPException(status_code=400, detail="Token and password are required")
    
    try:
        email = decode_reset_token(token)
        service.reset_password(db, email, new_password)
        return {"message": "Password updated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me", response_model=MeResponse)
def me(current: User = Depends(get_current_user)):
    return MeResponse(
        id=str(current.id),
        role=current.role,
        full_name=current.full_name,
        email=current.email,
        phone=current.phone,
        is_verified=current.is_verified,
    )
