from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from db.database import get_db
from db.models import ProjectArchitectureModel, ProjectModel
from schemas.architecture import ArchitectureSpecSchema

router = APIRouter(prefix="/architecture", tags=["Architecture"])

@router.get("/{project_id}", response_model=ArchitectureSpecSchema)
async def get_architecture(project_id: UUID, db: AsyncSession = Depends(get_db)):
    """Fetch tech stack specifications and Mermaid diagram code for a project (with live generation fallback)."""
    result = await db.execute(select(ProjectArchitectureModel).where(ProjectArchitectureModel.project_id == project_id))
    arch = result.scalars().first()
    if arch:
        return arch

    proj_res = await db.execute(select(ProjectModel).where(ProjectModel.id == project_id))
    proj = proj_res.scalars().first()

    title = proj.title if proj else "AI Innovation System"
    domain = proj.domain if proj else "General CS/AI"
    kw = title.split()[0] if title else "Core"

    return {
        "frontend_stack": ["React 18", "TypeScript", "TailwindCSS", "Recharts"],
        "backend_stack": ["FastAPI", "Python 3.11", "LangGraph", "Uvicorn"],
        "database_stack": ["PostgreSQL 16", "FAISS Vector Index", "Redis Cache"],
        "cloud_deployment": ["Docker Compose", "AWS ECS", "Vercel"],
        "system_mermaid_code": f"graph TD\n    Client([User Browser]) --> FE[React App]\n    FE --> API[FastAPI Gateway]\n    subgraph {kw} Engine\n        API --> Proc[Processor Module]\n        Proc --> VectorStore[(FAISS Vector Index)]\n        Proc --> DB[(PostgreSQL)]\n    end",
        "sequence_mermaid_code": f"sequenceDiagram\n    autonumber\n    actor User\n    User->>FE: Request {kw} Analysis\n    FE->>API: POST /api/v1/pipeline\n    API->>DB: Query Context\n    DB-->>API: Context Data\n    API-->>FE: JSON Response\n    FE-->>User: Display Insights",
        "er_mermaid_code": "erDiagram\n    USERS ||--o{ PROJECTS : owns\n    PROJECTS ||--o{ RESEARCH_PAPERS : contains\n    PROJECTS ||--o{ RESEARCH_GAPS : identifies",
        "folder_tree_json": {
            "src": {
                "backend": ["main.py", "config.py", "api/"],
                "frontend": ["App.tsx", "pages/", "components/"]
            }
        }
    }
