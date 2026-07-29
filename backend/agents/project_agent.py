from typing import Dict, Any
from agents.state import AgentState
from logging_config import logger

def run_project_agent(state: AgentState) -> Dict[str, Any]:
    """4. Project Structure Agent: Generates directory tree, SQL DDL, and ER Mermaid code."""
    logger.info(f"Project Structure Agent processing project {state['project_id']}")

    folder_structure = {
        "innovation-and-new-ai": {
            "backend": ["main.py", "config.py", "db/", "agents/", "api/"],
            "frontend": ["src/pages/", "src/components/", "src/context/"]
        }
    }

    db_schema_sql = """CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    raw_idea TEXT NOT NULL,
    innovation_score FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);"""

    er_mermaid = """erDiagram
    USERS ||--o{ PROJECTS : owns
    PROJECTS ||--o{ RESEARCH_PAPERS : contains
    PROJECTS ||--o{ RESEARCH_GAPS : detects
    PROJECTS ||--|| PROJECT_ARCHITECTURES : defines"""

    api_documentation = "POST /api/v1/projects | POST /api/v1/pipeline/{id}/run | GET /api/v1/chat/{id}/history"

    return {
        "folder_structure": folder_structure,
        "db_schema_sql": db_schema_sql,
        "er_mermaid": er_mermaid,
        "api_documentation": api_documentation,
        "current_step": "Project Structure Completed"
    }
