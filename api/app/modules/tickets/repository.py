from app.db.base_repo import BaseRepository
from app.modules.tickets.model import Ticket
from app.modules.tickets.schemas import TicketCreate

class TicketRepository(BaseRepository[Ticket]):
    def __init__(self):
        super().__init__(Ticket)

    def create_ticket(self, db: Session, tenant_id: uuid.UUID, owner_id: uuid.UUID, payload: TicketCreate) -> Ticket:
        db_ticket = Ticket(
            tenant_id=tenant_id,
            property_id=payload.property_id,
            owner_id=owner_id,
            title=payload.title,
            priority=payload.priority,
            status="PENDING"
        )
        return self.create(db, db_ticket)

    def list_for_tenant(self, db: Session, tenant_id: uuid.UUID) -> list[Ticket]:
        return db.query(Ticket).filter(Ticket.tenant_id == tenant_id).order_by(Ticket.created_at.desc()).all()

    def list_for_owner(self, db: Session, owner_id: uuid.UUID) -> list[Ticket]:
        return db.query(Ticket).filter(Ticket.owner_id == owner_id).order_by(Ticket.created_at.desc()).all()

    def update_status(self, db: Session, ticket: Ticket, new_status: str) -> Ticket:
        ticket.status = new_status
        return self.create(db, ticket) # create in BaseRepo handles commit/refresh
