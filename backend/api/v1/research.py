from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID
from db.database import get_db
from db.models import ResearchPaperModel, ResearchGapModel
from schemas.research import ResearchPaperSchema, ResearchGapSchema

router = APIRouter(prefix="/research", tags=["Research Workspace"])

@router.get("/{project_id}/papers", response_model=List[ResearchPaperSchema])
async def get_project_papers(project_id: UUID, db: AsyncSession = Depends(get_db)):
    """Fetch academic research papers linked to a project."""
    result = await db.execute(select(ResearchPaperModel).where(ResearchPaperModel.project_id == project_id))
    return result.scalars().all()

@router.get("/{project_id}/gaps", response_model=List[ResearchGapSchema])
async def get_project_gaps(project_id: UUID, db: AsyncSession = Depends(get_db)):
    """Fetch research gap matrix entries for a project."""
    result = await db.execute(select(ResearchGapModel).where(ResearchGapModel.project_id == project_id))
    return result.scalars().all()
