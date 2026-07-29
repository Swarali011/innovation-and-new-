from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID
from db.database import get_db
from db.models import ProjectModel, UserModel
from schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from auth.dependencies import get_current_user

router = APIRouter(prefix="/projects", tags=["Projects CRUD"])

@router.get("", response_model=List[ProjectResponse])
async def list_projects(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """List all projects owned by current user."""
    result = await db.execute(select(ProjectModel).where(ProjectModel.user_id == current_user.id))
    return result.scalars().all()

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_in: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Create a new research project idea entry."""
    new_proj = ProjectModel(
        user_id=current_user.id,
        title=project_in.title,
        raw_idea=project_in.raw_idea,
        domain=project_in.domain,
        target_audience=project_in.target_audience
    )
    db.add(new_proj)
    await db.commit()
    await db.refresh(new_proj)
    return new_proj

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Get project details by ID."""
    result = await db.execute(
        select(ProjectModel).where(ProjectModel.id == project_id, ProjectModel.user_id == current_user.id)
    )
    proj = result.scalars().first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Delete a project entry."""
    result = await db.execute(
        select(ProjectModel).where(ProjectModel.id == project_id, ProjectModel.user_id == current_user.id)
    )
    proj = result.scalars().first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.delete(proj)
    await db.commit()
