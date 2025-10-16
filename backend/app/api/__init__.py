# Import all API routers here
from .main import router as main_router
from .users import router as users_router
from .auth import router as auth_router

__all__ = ["main_router", "users_router", "auth_router"]