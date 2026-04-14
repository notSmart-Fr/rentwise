from fastapi import FastAPI
from app.core.config import settings

from app.persistence.session import engine
from app.persistence.base import Base

# IMPORTANT: import models so SQLAlchemy knows them

from app.modules.auth.router import router as auth_router
from app.modules.properties.router import owner_router, public_router
from app.modules.requests.router import router as request_router
from app.modules.payments.owner_router import router as payments_router
from app.modules.payments.tenant_router import router as tenant_payments_router
from app.modules.tickets.router import router as tickets_router
from app.modules.messages.router import router as messages_router
from app.modules.notifications.router import router as notifications_router



from app.core.errors import value_error_handler, generic_exception_handler

app = FastAPI(title=settings.app_name)

# Register Global Exception Handlers
app.add_exception_handler(ValueError, value_error_handler)
app.add_exception_handler(Exception, generic_exception_handler)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(owner_router)
app.include_router(public_router)
app.include_router(request_router)
app.include_router(payments_router)
app.include_router(tenant_payments_router)
app.include_router(tickets_router)
app.include_router(messages_router)
app.include_router(notifications_router)

@app.get("/")
def root():
    return {"message": "RentWise API is running. Visit /docs"}

@app.get("/health")
def health():
    return {"status": "ok"}
