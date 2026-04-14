import uuid
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.modules.auth.deps import get_current_user, get_current_user_ws
from app.modules.auth.model import User
from app.modules.messages.schemas import MessageCreate, MessageResponse, InboxConversationResponse
from app.modules.messages.service import MessageService
from app.modules.requests.model import RentalRequest
from app.modules.tickets.model import Ticket
from app.modules.properties.model import Property
from app.core.websocket import manager

router = APIRouter(tags=["messages"])
service = MessageService()

@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str,
    db: Session = Depends(get_db)
):
    user = get_current_user_ws(token, db)
    if not user:
        await websocket.close(code=4001)  # Unauthorized
        return

    await manager.connect(user.id, websocket)
    try:
        while True:
            # Keep connection alive and wait for client to close or send heartbeats
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user.id, websocket)

@router.post("/messages/context/{context_type}/{context_id}", response_model=MessageResponse)
async def send_message(
    context_type: str,
    context_id: str,
    payload: MessageCreate,
    receiver_id: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ctx_uuid = uuid.UUID(context_id)
    rec_uuid = uuid.UUID(receiver_id) if receiver_id else None

    # Check if conversation already exists using participant-aware lookup
    conv = service.repo.get_conversation_by_context(db, context_type, ctx_uuid, current_user.id)
    
    if not conv or (rec_uuid and rec_uuid not in [conv.participant1_id, conv.participant2_id]):
        # Derive participants from context
        if context_type == "RENTAL_REQUEST":
            req = db.query(RentalRequest).filter(RentalRequest.id == ctx_uuid).first()
            if not req: raise HTTPException(status_code=404, detail="Rental request not found")
            rec_uuid = req.owner_id if current_user.id == req.tenant_id else req.tenant_id
        elif context_type == "TICKET":
            ticket = db.query(Ticket).filter(Ticket.id == ctx_uuid).first()
            if not ticket: raise HTTPException(status_code=404, detail="Ticket not found")
            rec_uuid = ticket.owner_id if current_user.id == ticket.tenant_id else ticket.tenant_id
        elif context_type == "PROPERTY":
            prop = db.query(Property).filter(Property.id == ctx_uuid).first()
            if not prop: raise HTTPException(status_code=404, detail="Property not found")
            if not rec_uuid:
                if current_user.id != prop.owner_id: rec_uuid = prop.owner_id
                else: raise HTTPException(status_code=400, detail="Owner must provide receiver_id")
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported context_type: {context_type}")
    else:
        rec_uuid = conv.participant2_id if conv.participant1_id == current_user.id else conv.participant1_id

    try:
        msg = await service.send_message(db, context_type, ctx_uuid, current_user.id, rec_uuid, payload.content)
        return msg
    except HTTPException as e: raise e
    except Exception as e: raise HTTPException(status_code=400, detail=str(e))

@router.get("/messages/context/{context_type}/{context_id}", response_model=list[MessageResponse])
def get_conversation_messages(
    context_type: str,
    context_id: str,
    receiver_id: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ctx_uuid = uuid.UUID(context_id)
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
async def mark_read(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mark all messages in a conversation as read"""
    conv_uuid = uuid.UUID(conversation_id)
    await service.mark_as_read(db, conv_uuid, current_user.id)
    return {"status": "ok"}
