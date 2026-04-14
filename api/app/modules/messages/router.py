import uuid
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.persistence.deps import get_db
from app.modules.auth.deps import get_current_user, get_current_user_ws
from app.modules.auth.model import User
from app.modules.messages.schemas import MessageCreate, MessageResponse, InboxConversationResponse
from app.modules.messages.service import MessageService
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

    try:
        msg = await service.send_message(
            db, 
            context_type, 
            ctx_uuid, 
            current_user.id, 
            rec_uuid, 
            payload.content
        )
        return msg
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

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
