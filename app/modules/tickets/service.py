import uuid
from sqlalchemy.orm import Session
from app.modules.tickets.repository import TicketRepository
from app.modules.tickets.schemas import TicketCreate
from app.modules.messages.service import MessageService

class TicketService:
    def __init__(self):
        self.repo = TicketRepository()
        self.msg_service = MessageService()

    def create_ticket(self, db: Session, tenant_id: uuid.UUID, owner_id: uuid.UUID, payload: TicketCreate):
        # 1. Create the ticket
        ticket = self.repo.create(db, tenant_id, owner_id, payload)
        
        # 2. Add the initial message via the generalized messages module
        self.msg_service.send_message(
            db=db,
            context_type="TICKET",
            context_id=ticket.id,
            sender_id=tenant_id,
            receiver_id=owner_id,
            content=payload.initial_message
        )
        return ticket

    def get_tenant_tickets(self, db: Session, tenant_id: uuid.UUID):
        return self.repo.list_for_tenant(db, tenant_id)

    def get_owner_tickets(self, db: Session, owner_id: uuid.UUID):
        return self.repo.list_for_owner(db, owner_id)
        
    def get_ticket(self, db: Session, ticket_id: uuid.UUID):
        return self.repo.get_by_id(db, ticket_id)

    def update_status(self, db: Session, ticket_id: uuid.UUID, new_status: str):
        ticket = self.repo.get_by_id(db, ticket_id)
        if ticket:
            return self.repo.update_status(db, ticket, new_status)
        return None
