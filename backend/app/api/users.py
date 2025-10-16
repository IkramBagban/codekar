from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth_middleware import get_current_user
from app.schemas.user import UserResponse, ApiResponse
from app.services.user_service import UserService
from app.models.user import User
from typing import List

router = APIRouter(prefix="/api/v1/users", tags=["Users"])


@router.get("/me", response_model=ApiResponse[UserResponse])
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user's information.
    Requires Bearer token in Authorization header.
    """
    user_response = UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name
    )
    return ApiResponse(
        success=True,
        message="User retrieved successfully.",
        data=user_response,
        error=None
    )


@router.get("/", response_model=ApiResponse[List[UserResponse]])
async def get_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get list of users (protected route).
    Requires Bearer token in Authorization header.
    """
    users = UserService.get_users(db, skip=skip, limit=limit)
    users_response = [
        UserResponse(id=user.id, email=user.email, name=user.name)
        for user in users
    ]
    return ApiResponse(
        success=True,
        message=f"Retrieved {len(users_response)} users.",
        data=users_response,
        error=None
    )


@router.get("/{user_id}", response_model=ApiResponse[UserResponse])
async def get_user(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get user by ID (protected route).
    Requires Bearer token in Authorization header.
    """
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        return ApiResponse(
            success=False,
            message=None,
            data=None,
            error="User not found"
        )
    
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        name=user.name
    )
    return ApiResponse(
        success=True,
        message="User retrieved successfully.",
        data=user_response,
        error=None
    )