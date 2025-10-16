from pydantic import BaseModel, EmailStr
from pydantic.generics import GenericModel 
from typing import Any, Dict, Generic, List, Optional, TypeVar

M = TypeVar("M", bound=BaseModel)

class ApiResponse(GenericModel, Generic[M]):
    success: bool
    message: Optional[str] = None
    data: Optional[M] = None
    error: Optional[str] = None


class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None  

class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    
    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    user: UserResponse
    token: str
    token_type: str = "Bearer"

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

