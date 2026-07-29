from fastapi import APIRouter
from api.v1.auth import router as auth_router
from api.v1.projects import router as projects_router
from api.v1.pipeline import router as pipeline_router
from api.v1.research import router as research_router
from api.v1.chat import router as chat_router
from api.v1.architecture import router as architecture_router
from api.v1.scoring import router as scoring_router
from api.v1.documents import router as documents_router
from api.v1.settings import router as settings_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(projects_router)
api_router.include_router(pipeline_router)
api_router.include_router(research_router)
api_router.include_router(chat_router)
api_router.include_router(architecture_router)
api_router.include_router(scoring_router)
api_router.include_router(documents_router)
api_router.include_router(settings_router)
