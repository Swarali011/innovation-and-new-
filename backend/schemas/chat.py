from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class ChatMessageCreate(BaseModel):
    message: str

class ChatMessageResponse(BaseModel):
    id: UUID
    project_id: UUID
    sender: str
    message: str
    context_chunks: Optional[List[str]] = None
    created_at: datetime

    class Config:
        from_attributes = True
