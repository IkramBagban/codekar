from pydantic import BaseModel
from pydantic.generics import GenericModel 
from typing import Any, Dict, Generic, List, Optional, TypeVar

M = TypeVar("M", bound=BaseModel)

class ApiResponse(GenericModel, Generic[M]):
    message: Optional[str] = None
    success: bool
    data: Optional[M] = None
    error: Optional[Any] = None


class UserBase(BaseModel):
    """Base user schema with common fields."""
    email: str
    name: Optional[str] = None  

class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str

class UserResponse(UserBase):
    """Schema for user response (excludes password)."""
    id: int
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    """Schema for updating user information."""
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

