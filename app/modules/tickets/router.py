import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.modules.auth.deps import require_owner, require_tenant
from app.modules.auth.model import User
from app.modules.properties.repository import PropertyRepository
from app.modules.tickets.schemas import TicketCreate, TicketUpdateStatus, TicketResponse
from app.modules.tickets.service import TicketService

router = APIRouter(tags=["tickets"])
service = TicketService()
prop_repo = PropertyRepository()

@router.post("/tenant/tickets", response_model=TicketResponse)
def create_ticket(
    payload: TicketCreate,
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    # Verify property exists and get owner
    prop = prop_repo.get_by_id(db, payload.property_id)
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")

    ticket = service.create_ticket(db, tenant.id, prop.owner_id, payload)
    return ticket

@router.get("/tenant/tickets", response_model=list[TicketResponse])
def tenant_tickets_list(
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    return service.get_tenant_tickets(db, tenant.id)

@router.get("/owner/tickets", response_model=list[TicketResponse])
def owner_tickets_list(
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    return service.get_owner_tickets(db, owner.id)

@router.patch("/owner/tickets/{ticket_id}/status", response_model=TicketResponse)
def update_ticket_status(
    ticket_id: str,
    payload: TicketUpdateStatus,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    ticket = service.get_ticket(db, uuid.UUID(ticket_id))
    if not ticket or ticket.owner_id != owner.id:
        raise HTTPException(status_code=404, detail="Ticket not found via Owner")
    
    updated_ticket = service.update_status(db, uuid.UUID(ticket_id), payload.status)
    return updated_ticket

@router.get("/tenant/tickets/{ticket_id}", response_model=TicketResponse)
def get_tenant_ticket(
    ticket_id: str,
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    ticket = service.get_ticket(db, uuid.UUID(ticket_id))
    if not ticket or ticket.tenant_id != tenant.id:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.get("/owner/tickets/{ticket_id}", response_model=TicketResponse)
def get_owner_ticket(
    ticket_id: str,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    ticket = service.get_ticket(db, uuid.UUID(ticket_id))
    if not ticket or ticket.owner_id != owner.id:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket
