from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID

class ResearchPaperSchema(BaseModel):
    id: UUID
    title: str
    authors: List[str]
    published_year: int
    abstract: str
    url: str
    source: str
    relevance_score: float
    key_findings: List[str]

    class Config:
        from_attributes = True

class ResearchGapSchema(BaseModel):
    id: UUID
    category: str
    description: str
    proposed_solution: str
    impact_level: str
    novelty_rating: float

    class Config:
        from_attributes = True
