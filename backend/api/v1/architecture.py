from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from db.database import get_db
from db.models import ProjectArchitectureModel
from schemas.architecture import ArchitectureSpecSchema

router = APIRouter(prefix="/architecture", tags=["Architecture"])

@router.get("/{project_id}", response_model=ArchitectureSpecSchema)
async def get_architecture(project_id: UUID, db: AsyncSession = Depends(get_db)):
    """Fetch tech stack specifications and Mermaid diagram code for a project."""
    result = await db.execute(select(ProjectArchitectureModel).where(ProjectArchitectureModel.project_id == project_id))
    arch = result.scalars().first()
    if not arch:
        raise HTTPException(status_code=404, detail="Architecture specifications not generated yet")
    return arch
