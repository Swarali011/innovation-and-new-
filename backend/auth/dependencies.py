from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from db.database import get_db
from db.models import UserModel
from auth.firebase import verify_firebase_token
from logging_config import logger

async def get_current_user(
    authorization: str = Header(None),
    db: AsyncSession = Depends(get_db)
) -> UserModel:
    """FastAPI Security Dependency to resolve current user from Firebase Bearer Token."""
    if not authorization or not authorization.startswith("Bearer "):
        # Dev fallback for testing without token header
        token = "usr-default"
    else:
        token = authorization.split(" ")[1]

    try:
        decoded = verify_firebase_token(token)
        firebase_uid = decoded.get("uid", "usr-default")
        email = decoded.get("email", "prachi.swarali@dypatil.edu")
        display_name = decoded.get("name", "Prachi & Swarali")
        photo_url = decoded.get("picture", "")

        # Sync user in PostgreSQL DB
        result = await db.execute(select(UserModel).where(UserModel.firebase_uid == firebase_uid))
        user = result.scalars().first()

        if not user:
            user = UserModel(
                firebase_uid=firebase_uid,
                email=email,
                display_name=display_name,
                photo_url=photo_url
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)

        return user
    except Exception as e:
        logger.error(f"Auth dependency error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authorization credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
