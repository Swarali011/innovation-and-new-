from fastapi import APIRouter, Depends
from db.models import UserModel
from auth.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/sync")
async def sync_user(current_user: UserModel = Depends(get_current_user)):
    """Sync Firebase user token and return user profile."""
    return {
        "id": str(current_user.id),
        "firebase_uid": current_user.firebase_uid,
        "email": current_user.email,
        "display_name": current_user.display_name,
        "photo_url": current_user.photo_url
    }

@router.get("/me")
async def get_me(current_user: UserModel = Depends(get_current_user)):
    """Fetch active user profile."""
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "display_name": current_user.display_name,
        "photo_url": current_user.photo_url
    }
