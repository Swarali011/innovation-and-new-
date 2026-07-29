from fastapi import APIRouter, Depends
from pydantic import BaseModel
from db.models import UserModel
from auth.dependencies import get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from db.database import get_db

router = APIRouter(prefix="/settings", tags=["User Settings"])

class ApiKeyUpdate(BaseModel):
    gemini_api_key: str

@router.post("/api-key")
async def set_gemini_api_key(
    payload: ApiKeyUpdate,
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Save custom user Gemini API key override."""
    current_user.gemini_api_key_override = payload.gemini_api_key
    await db.commit()
    return {"message": "Gemini API Key updated successfully"}
