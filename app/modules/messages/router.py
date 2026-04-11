import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.modules.auth.deps import get_current_user
from app.modules.auth.model import User
from app.modules.messages.schemas import MessageCreate, MessageResponse, InboxConversationResponse
from app.modules.messages.service import MessageService
from app.modules.requests.model import RentalRequest
from app.modules.tickets.model import Ticket
from app.modules.properties.model import Property

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
    receiver_id: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ctx_uuid = uuid.UUID(context_id)

    # If receiver_id is provided, use it. Otherwise derive from context.
    rec_uuid = uuid.UUID(receiver_id) if receiver_id else None

    # Check if conversation already exists using participant-aware lookup
    conv = service.repo.get_conversation_by_context(db, context_type, ctx_uuid, current_user.id)
    
    if not conv or (rec_uuid and rec_uuid not in [conv.participant1_id, conv.participant2_id]):
        # Derive participants from the context entity if not provided or doesn't match existing
        if context_type == "RENTAL_REQUEST":
            req = db.query(RentalRequest).filter(RentalRequest.id == ctx_uuid).first()
            if not req:
                raise HTTPException(status_code=404, detail="Rental request not found")
            rec_uuid = req.owner_id if current_user.id == req.tenant_id else req.tenant_id
        elif context_type == "TICKET":
            ticket = db.query(Ticket).filter(Ticket.id == ctx_uuid).first()
            if not ticket:
                raise HTTPException(status_code=404, detail="Ticket not found")
            rec_uuid = ticket.owner_id if current_user.id == ticket.tenant_id else ticket.tenant_id
        elif context_type == "PROPERTY":
            prop = db.query(Property).filter(Property.id == ctx_uuid).first()
            if not prop:
                raise HTTPException(status_code=404, detail="Property not found")
            
            if not rec_uuid:
                # If tenant is messaging, receiver is owner
                if current_user.id != prop.owner_id:
                    rec_uuid = prop.owner_id
                else:
                    # Owner must provide receiver_id to specify which tenant inquiry they are replying to
                    raise HTTPException(status_code=400, detail="Owner must provide receiver_id for property inquiries")
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported context_type: {context_type}")
    else:
        # Conversation exists and participants match
        rec_uuid = conv.participant2_id if conv.participant1_id == current_user.id else conv.participant1_id

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
    receiver_id: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ctx_uuid = uuid.UUID(context_id)
    
    # If the current user is the owner, we might need receiver_id to find the right property inquiry thread
    target_participant = uuid.UUID(receiver_id) if receiver_id else current_user.id
    
    # Special handling for Owners viewing Property Inquiries without a specific receiver_id
    # We'll try to find the "first" or "only" inquiry thread if receiver_id is missing, 
    # but ideally the frontend should pass it.
    
    msgs = service.get_messages(db, context_type, ctx_uuid, current_user.id, receiver_id)
    return msgs

@router.get("/conversations", response_model=list[InboxConversationResponse])
def get_inbox(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all conversations for the current user (Inbox)"""
    return service.get_user_inbox(db, current_user.id)

@router.patch("/conversations/{conversation_id}/read")
def mark_read(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mark all messages in a conversation as read"""
    conv_uuid = uuid.UUID(conversation_id)
    service.mark_as_read(db, conv_uuid, current_user.id)
    return {"status": "ok"}
