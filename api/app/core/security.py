from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import jwt, JWTError
from passlib.context import CryptContext

from app.core.config import settings

JWT_SECRET = settings.jwt_secret
JWT_ALG = settings.jwt_alg
ACCESS_TOKEN_MINUTES = settings.access_token_minutes

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)

def create_access_token(subject: str, expires_minutes: Optional[int] = None) -> str:
    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=expires_minutes or ACCESS_TOKEN_MINUTES)
    payload = {"sub": subject, "iat": int(now.timestamp()), "exp": exp}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except JWTError as e:
        raise ValueError("Invalid token") from e

def create_reset_token(email: str) -> str:
    """Creates a short-lived token for password reset (15 mins)"""
    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=15)
    payload = {"sub": email, "iat": int(now.timestamp()), "exp": exp, "purpose": "password_reset"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def decode_reset_token(token: str) -> str:
    """Decodes a reset token and returns the email if valid"""
    payload = decode_token(token)
    if payload.get("purpose") != "password_reset":
        raise ValueError("Invalid token purpose")
    return payload["sub"]
