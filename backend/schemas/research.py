from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from uuid import UUID

class ResearchPaperSchema(BaseModel):
    id: str
    title: str
    authors: List[str]
    published_year: int
    abstract: str
    url: str
    source: str
    relevance_score: float
    key_findings: List[str]
    journal: Optional[str] = "Academic Journal"
    citation_count: Optional[int] = 0
    doi: Optional[str] = ""
    pdf_url: Optional[str] = ""
    is_embeddable: Optional[bool] = True

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

class GitHubRepositorySchema(BaseModel):
    id: str
    name: str
    full_name: str
    description: str
    owner: str
    owner_avatar: Optional[str] = ""
    stars: int
    forks: int
    watchers: Optional[int] = 0
    open_issues: Optional[int] = 0
    primary_language: str
    topics: List[str]
    last_updated: str
    license: str
    html_url: str
    relevance_score: float

class GitHubRepoDetailsSchema(BaseModel):
    owner: str
    repo: str
    full_name: str
    readme_md: str
    file_tree: List[Dict[str, str]]
    languages: Dict[str, int]
    commits: List[Dict[str, Any]]
    open_issues: int
    stars: int
    forks: int
    html_url: str

class RoadmapPhaseSchema(BaseModel):
    phase_id: str
    phase_number: int
    title: str
    estimated_duration: str
    status: str
    deliverables: List[str]
    required_skills: List[str]
    suggested_tools: List[str]
    potential_risks: List[str]

class PaperSearchRequest(BaseModel):
    query: str
    domain: Optional[str] = "General CS/AI"
    limit: Optional[int] = 6

class GitHubSearchRequest(BaseModel):
    query: str
    limit: Optional[int] = 6

class RoadmapRequest(BaseModel):
    project_title: str
    raw_idea: str
    domain: Optional[str] = "General CS/AI"
    tech_stack: Optional[Dict[str, List[str]]] = None
