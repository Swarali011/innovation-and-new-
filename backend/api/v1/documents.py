from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID
from db.database import get_db
from db.models import GeneratedDocumentModel
from schemas.document import GeneratedDocumentSchema

router = APIRouter(prefix="/documents", tags=["Generated Documents"])

@router.get("/{project_id}", response_model=List[GeneratedDocumentSchema])
async def get_project_documents(project_id: UUID, db: AsyncSession = Depends(get_db)):
    """List all generated project research reports and blueprints."""
    result = await db.execute(select(GeneratedDocumentModel).where(GeneratedDocumentModel.project_id == project_id))
    return result.scalars().all()

@router.get("/download/{doc_id}")
async def download_document(doc_id: UUID, db: AsyncSession = Depends(get_db)):
    """Download markdown document file."""
    result = await db.execute(select(GeneratedDocumentModel).where(GeneratedDocumentModel.id == doc_id))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    return Response(
        content=doc.markdown_content,
        media_type="text/markdown",
        headers={"Content-Disposition": f"attachment; filename={doc.title.replace(' ', '_')}.md"}
    )
