from fastapi import FastAPI
from app.core.config import settings

from app.db.session import engine
from app.db.base import Base
from app.modules.auth.router import router as auth_router

app = FastAPI(title=settings.app_name)

# V1 simple table creation (later we switch to Alembic migrations)
Base.metadata.create_all(bind=engine)

app.include_router(auth_router)

@app.get("/")
def root():
    return {"message": "RentWise API is running. Visit /docs"}

@app.get("/health")
def health():
    return {"status": "ok"}