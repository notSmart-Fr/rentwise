import uuid
from sqlalchemy.orm import Session
from app.persistence.base_service import BaseService
from app.modules.tickets.model import Ticket
from app.modules.tickets.repository import TicketRepository
from app.modules.tickets.schemas import TicketCreate
from app.modules.messages.service import MessageService
from app.modules.notifications.service import NotificationService

class TicketService(BaseService[Ticket]):
    def __init__(self):
        super().__init__(Ticket, TicketRepository())
        self.msg_service = MessageService()
        self.notif_service = NotificationService()

    async def create_ticket(self, db: Session, tenant_id: uuid.UUID, payload: TicketCreate) -> Ticket:
        # 1. Resolve owner from property
        from app.modules.properties.repository import PropertyRepository
        prop = PropertyRepository().get_by_id(db, payload.property_id)
        if not prop:
            raise ValueError("Property not found")
            
        # 2. Create the ticket
        ticket = self.repo.create_ticket(db, tenant_id, prop.owner_id, payload)
        
        # 3. Add initial message
        await self.msg_service.send_message(
            db=db,
            context_type="TICKET",
            context_id=ticket.id,
            sender_id=tenant_id,
            receiver_id=prop.owner_id,
            content=payload.initial_message
        )

        # 4. Notify Owner
        await self.notif_service.create_notification(
            db=db,
            user_id=prop.owner_id,
            title="New Maintenance Ticket",
            message=f"A new issue has been reported for {prop.title}: {payload.title}",
            notif_type="TICKET",
            context_type="TICKET",
            context_id=ticket.id
        )
        
        return ticket

    async def get_tenant_tickets(self, db: Session, tenant_id: uuid.UUID):
        return self.repo.list_for_tenant(db, tenant_id)

    async def get_owner_tickets(self, db: Session, owner_id: uuid.UUID):
        return self.repo.list_for_owner(db, owner_id)
        
    async def update_status(self, db: Session, ticket_id: uuid.UUID, new_status: str, owner_id: uuid.UUID) -> Ticket:
        ticket = self.get_or_404(db, ticket_id)
        if ticket.owner_id != owner_id:
            raise ValueError("Unauthorized access to ticket")
            
        updated = self.repo.update_status(db, ticket, new_status)
        
        # Notify Tenant of status change
        await self.notif_service.create_notification(
            db=db,
            user_id=ticket.tenant_id,
            title="Ticket Update",
            message=f"Maintanance ticket for {ticket.property.title} is now {new_status}.",
            notif_type="TICKET",
            context_type="TICKET",
            context_id=ticket.id
        )
        
        return updated

    def to_response(self, t: Ticket) -> dict:
        data = super().to_response(t)
        # Add human-readable titles
        data["property_title"] = t.property.title if t.property else "Unknown Property"
        data["tenant_name"] = t.tenant.full_name if t.tenant else "Unknown Tenant"
        data["owner_name"] = t.owner.full_name if t.owner else "Property Owner"
        
        # Ensure UUIDs are strings
        for field in ["id", "property_id", "tenant_id", "owner_id"]:
            if field in data:
                data[field] = str(data[field])
        return data
