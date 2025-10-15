from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user import UserCreate, UserResponse, ApiResponse
from app.services.user_service import UserService
from app.utils.helper import successResponse, errorResponse
from typing import Any, Dict, Generic, List, Optional, TypeVar

router = APIRouter(prefix="/api/v1", tags=["users"])


@router.post("/register", response_model=ApiResponse[UserResponse], status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    print("Registering", user_data)

    existing_user = UserService.get_user_by_email(db, user_data.email)
    print("exisitng user", existing_user)
    if existing_user:
        return {"success": False, "error": "Email already exists.", "message": None, "data": None}
    print("before new user")

    new_user = UserService.create_user(db, user_data)
    print("new user", new_user)
    response = UserResponse(id=new_user.id, email=new_user.email, name=new_user.name) 
    return {"success": True, "message": "User registered successfully.", "data": response}

@router.get("/", response_model=List[UserResponse])
async def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get list of users."""
    users = UserService.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID."""
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user