from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from uuid import UUID

class ArchitectureSpecSchema(BaseModel):
    id: UUID
    project_id: UUID
    frontend_stack: List[str]
    backend_stack: List[str]
    database_stack: List[str]
    cloud_deployment: List[str]
    system_mermaid_code: str
    sequence_mermaid_code: str
    er_mermaid_code: str
    folder_tree_json: Dict[str, Any]

    class Config:
        from_attributes = True
