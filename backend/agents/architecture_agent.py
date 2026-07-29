from typing import Dict, Any
from agents.state import AgentState
from logging_config import logger

def run_architecture_agent(state: AgentState) -> Dict[str, Any]:
    """3. Architecture Builder Agent: Designs multi-tier system architecture and Mermaid code."""
    logger.info(f"Architecture Builder Agent processing project {state['project_id']}")

    frontend_stack = ["React 18", "TypeScript", "TailwindCSS", "shadcn/ui", "Recharts", "Framer Motion"]
    backend_stack = ["FastAPI", "Python 3.11", "LangGraph", "LangChain", "Google Gemini API"]
    database_stack = ["PostgreSQL 16", "FAISS Vector Store", "SQLAlchemy Async"]
    cloud_deployment = ["Docker Compose", "Render (FastAPI)", "Vercel (React Frontend)"]

    system_mermaid = """graph TD
    Client([React Frontend]) --> Gateway[FastAPI REST API]
    Gateway --> Auth[Firebase Authentication]
    Gateway --> Orchestrator[LangGraph Multi-Agent Engine]
    Orchestrator --> Gemini[Google Gemini 1.5 Pro]
    Orchestrator --> PG[(PostgreSQL DB)]
    Orchestrator --> FAISS[(FAISS Vector Store)]"""

    sequence_mermaid = """sequenceDiagram
    actor User
    User->>Client: Input Project Idea
    Client->>Gateway: POST /api/v1/pipeline/{id}/run
    Gateway->>Orchestrator: Invoke LangGraph StateGraph
    Orchestrator-->>Client: SSE Stream Agent Steps
    Orchestrator->>PG: Save Complete Blueprint"""

    return {
        "frontend_stack": frontend_stack,
        "backend_stack": backend_stack,
        "database_stack": database_stack,
        "cloud_deployment": cloud_deployment,
        "system_mermaid": system_mermaid,
        "sequence_mermaid": sequence_mermaid,
        "current_step": "Architecture Builder Completed"
    }
