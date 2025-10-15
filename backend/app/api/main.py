from fastapi import APIRouter

router = APIRouter()

@router.get("/api/v1/")
async def read_root():
    """Health check endpoint."""
    return {
        "message": "Hello world", 
        "status": "success",
        "app": "CodeKar Backend"
    }

@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "message": "Service is running"
    }