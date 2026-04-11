import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.modules.auth.deps import get_current_user, require_owner
from app.modules.auth.model import User
from app.modules.messages.schemas import MessageCreate, MessageResponse
from app.modules.messages.service import MessageService

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
    receiver_id: str = None, # Optional: only needed if creating convo from scratch via this endpoint
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ctx_uuid = uuid.UUID(context_id)
    rec_uuid = uuid.UUID(receiver_id) if receiver_id else current_user.id # fallback, logic handled in service if convo exists
    
    # Let's handle the case where conversation exists in the service:
    conv = service.repo.get_conversation_by_context(db, context_type, ctx_uuid)
    if conv:
        # User sending might be participant1 or participant2.
        # Find who the receiver is based on conversation.
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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ctx_uuid = uuid.UUID(context_id)
    msgs = service.get_messages(db, context_type, ctx_uuid, current_user.id)
    return msgs
