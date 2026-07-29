from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class ProjectCreate(BaseModel):
    title: str = Field(..., example="AI-powered medical research copilot")
    raw_idea: str = Field(..., example="Autonomous multi-agent research literature analyzer")
    domain: str = Field(default="General CS/AI", example="Artificial Intelligence")
    target_audience: Optional[str] = Field(None, example="Medical Researchers")

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    raw_idea: Optional[str] = None
    domain: Optional[str] = None
    target_audience: Optional[str] = None
    status: Optional[str] = None

class ProjectResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    raw_idea: str
    domain: str
    target_audience: Optional[str] = None
    status: str
    current_agent_step: Optional[str] = None
    innovation_score: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
