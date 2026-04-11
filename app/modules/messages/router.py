import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.modules.auth.deps import get_current_user
from app.modules.auth.model import User
from app.modules.messages.schemas import MessageCreate, MessageResponse
from app.modules.messages.service import MessageService
from app.modules.requests.model import RentalRequest
from app.modules.tickets.model import Ticket

router = APIRouter(tags=["messages"])
service = MessageService()

# Need a robust way to know the "receiver" when sending a message if the conversation doesn't exist.
# Wait, for a ticket or request, the context_id allows us to look up the DB entity (Ticket/RentalRequest) 
# and find the other participant. But for simplicity, we pass receiver_id from frontend on first message, 
# or we let the get_or_create_conversation implicitly take participant2_id from query.
# Actually, the Conversation requires participant1_id and participant2_id.
# If the conversation is already created (e.g. by Ticket creation), we don't *need* receiver_id to send a message.
# Let's adjust MessageService slightly to look up existing participant if not provided?
# For now, let's keep it simple: the frontend passes receiver_id in query if it's the very first message.

@router.post("/messages/context/{context_type}/{context_id}", response_model=MessageResponse)
def send_message(
    context_type: str,
    context_id: str,
    payload: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ctx_uuid = uuid.UUID(context_id)

    # Check if conversation already exists
    conv = service.repo.get_conversation_by_context(db, context_type, ctx_uuid)
    
    if conv:
        # Derive receiver from existing conversation
        rec_uuid = conv.participant2_id if conv.participant1_id == current_user.id else conv.participant1_id
    else:
        # Derive both participants from the context entity
        if context_type == "RENTAL_REQUEST":
            req = db.query(RentalRequest).filter(RentalRequest.id == ctx_uuid).first()
            if not req:
                raise HTTPException(status_code=404, detail="Rental request not found")
            # Determine who the other participant is
            if current_user.id == req.tenant_id:
                rec_uuid = req.owner_id
            elif current_user.id == req.owner_id:
                rec_uuid = req.tenant_id
            else:
                raise HTTPException(status_code=403, detail="Not a participant in this request")
        elif context_type == "TICKET":
            ticket = db.query(Ticket).filter(Ticket.id == ctx_uuid).first()
            if not ticket:
                raise HTTPException(status_code=404, detail="Ticket not found")
            if current_user.id == ticket.tenant_id:
                rec_uuid = ticket.owner_id
            elif current_user.id == ticket.owner_id:
                rec_uuid = ticket.tenant_id
            else:
                raise HTTPException(status_code=403, detail="Not a participant in this ticket")
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported context_type: {context_type}")

    try:
        msg = service.send_message(db, context_type, ctx_uuid, current_user.id, rec_uuid, payload.content)
        return msg
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/messages/context/{context_type}/{context_id}", response_model=list[MessageResponse])
def get_conversation_messages(
    context_type: str,
    context_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ctx_uuid = uuid.UUID(context_id)
    msgs = service.get_messages(db, context_type, ctx_uuid, current_user.id)
    return msgs
