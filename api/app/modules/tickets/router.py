import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.persistence.deps import get_db
from app.modules.auth.deps import require_owner, require_tenant
from app.modules.auth.model import User
from app.modules.properties.repository import PropertyRepository
from app.modules.tickets.schemas import TicketCreate, TicketUpdateStatus, TicketResponse
from app.modules.tickets.service import TicketService

router = APIRouter(tags=["tickets"])
service = TicketService()
prop_repo = PropertyRepository()

@router.post("/tenant/tickets", response_model=TicketResponse)
async def create_ticket(
    payload: TicketCreate,
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    return await service.create_ticket(db, tenant.id, payload)

@router.get("/tenant/tickets", response_model=list[TicketResponse])
async def tenant_tickets_list(
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    return await service.get_tenant_tickets(db, tenant.id)

@router.get("/owner/tickets", response_model=list[TicketResponse])
async def owner_tickets_list(
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    return await service.get_owner_tickets(db, owner.id)

@router.patch("/owner/tickets/{ticket_id}/status", response_model=TicketResponse)
async def update_ticket_status(
    ticket_id: str,
    payload: TicketUpdateStatus,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    return await service.update_status(
        db, 
        uuid.UUID(ticket_id), 
        payload.status,
        owner.id
    )

@router.get("/tenant/tickets/{ticket_id}", response_model=TicketResponse)
async def get_tenant_ticket(
    ticket_id: str,
    db: Session = Depends(get_db),
    tenant: User = Depends(require_tenant),
):
    ticket = await service.get_ticket(db, uuid.UUID(ticket_id))
    if not ticket or ticket.tenant_id != tenant.id:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.get("/owner/tickets/{ticket_id}", response_model=TicketResponse)
async def get_owner_ticket(
    ticket_id: str,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    ticket = await service.get_ticket(db, uuid.UUID(ticket_id))
    if not ticket or ticket.owner_id != owner.id:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket
