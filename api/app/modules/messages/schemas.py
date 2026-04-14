import uuid
from datetime import datetime
from pydantic import BaseModel, Field

class MessageBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)

class MessageCreate(MessageBase):
    pass

class MessageResponse(MessageBase):
    id: uuid.UUID
    sender_id: uuid.UUID
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    id: uuid.UUID
    participant1_id: uuid.UUID
    participant2_id: uuid.UUID
    context_type: str
    context_id: uuid.UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class InboxConversationResponse(BaseModel):
    id: uuid.UUID
    other_participant_id: uuid.UUID
    other_participant_name: str
    context_type: str
    context_id: uuid.UUID
    context_title: str
    last_message: str | None = None
    last_message_at: datetime | None = None
    unread_count: int = 0
