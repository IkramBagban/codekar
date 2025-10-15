from fastapi import FastAPI
from app.core.config import settings
from app.core.database import init_db
from app.api import main_router, users_router

# Create FastAPI app instance
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG
)

# Include routers
app.include_router(main_router)
app.include_router(users_router)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database on application startup."""
    init_db()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )