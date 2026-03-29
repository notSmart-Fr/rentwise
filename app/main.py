from fastapi import FastAPI
from app.core.config import settings

from app.db.session import engine
from app.db.base import Base

# IMPORTANT: import models so SQLAlchemy knows them

from app.modules.auth.router import router as auth_router
from app.modules.properties.router import owner_router, public_router
from app.modules.requests.router import router as request_router
from app.modules.payments.owner_router import router as payments_router
from app.modules.payments.tenant_router import router as tenant_payments_router



app = FastAPI(title=settings.app_name)


Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(owner_router)
app.include_router(public_router)
app.include_router(request_router)
app.include_router(payments_router)
app.include_router(tenant_payments_router)

@app.get("/")
def root():
    return {"message": "RentWise API is running. Visit /docs"}

@app.get("/health")
def health():
    return {"status": "ok"}