from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class GeneratedDocumentSchema(BaseModel):
    id: UUID
    project_id: UUID
    doc_type: str
    title: str
    markdown_content: str
    version: int
    created_at: datetime

    class Config:
        from_attributes = True
