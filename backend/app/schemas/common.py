from pydantic import BaseModel
from pydantic.generics import GenericModel 
from typing import Generic, Optional, TypeVar

M = TypeVar("M", bound=BaseModel)

class ApiResponse(GenericModel, Generic[M]):
    """Generic API response wrapper for consistent response structure."""
    success: bool
    message: Optional[str] = None
    data: Optional[M] = None
    error: Optional[str] = None
