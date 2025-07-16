import warnings
from fastapi import FastAPI

from backend.profile.routers import profile, project
try:
    from backend.profile.verify import temp_router
except (ModuleNotFoundError, ImportError):
    # warnings.warn("Verify handler not found, skipping...")
    temp_router = None


app = FastAPI()
app.include_router(profile.router)
app.include_router(project.router)
if temp_router:
    app.include_router(temp_router, prefix="/auth")
