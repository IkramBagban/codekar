from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.common import ApiResponse
from app.schemas.user import UserCreate, UserLogin, UserResponse, AuthResponse
from app.services.user_service import UserService
from app.services.auth_service import AuthService
from app.utils.helper import hash_password, match_password

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


@router.post("/register", response_model=ApiResponse[AuthResponse], status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    try:
        existing_user = UserService.get_user_by_email(db, user_data.email)
        if existing_user:
            return ApiResponse(
                success=False,
                message=None,
                data=None,
                error="User with this email already exists."
            )
        
        hashed_password = hash_password(user_data.password)
        user_data.password = hashed_password
        
        new_user = UserService.create_user(db, user_data)
        
        token_payload = {
            "user_id": new_user.id,
            "email": new_user.email
        }
        access_token = AuthService.create_access_token(token_payload)
        
        user_response = UserResponse(
            id=new_user.id,
            email=new_user.email,
            name=new_user.name
        )
        auth_response = AuthResponse(
            user=user_response,
            token=access_token,
            token_type="Bearer"
        )
        
        return ApiResponse(
            success=True,
            message="User registered successfully.",
            data=auth_response,
            error=None
        )
        
    except Exception as e:
        print(f"Registration error: {str(e)}")
        import traceback
        traceback.print_exc()
        return ApiResponse(
            success=False,
            message=None,
            data=None,
            error=f"Registration failed: {str(e)}"
        )


@router.post("/login", response_model=ApiResponse[AuthResponse], status_code=status.HTTP_200_OK)
async def login_user(user_data: UserLogin, db: Session = Depends(get_db)):
    """
    Login an existing user.
    
    - **email**: User's email address
    - **password**: User's password
    
    Returns user details and JWT token for authentication.
    """
    try:
        # Check if user exists
        user = UserService.get_user_by_email(db, user_data.email)
        if not user:
            return ApiResponse(
                success=False,
                message=None,
                data=None,
                error="Invalid email or password."
            )
        
        # Verify password
        is_password_correct = match_password(user_data.password, user.password)
        if not is_password_correct:
            return ApiResponse(
                success=False,
                message=None,
                data=None,
                error="Invalid email or password."
            )
        
        # Generate JWT token
        token_payload = {
            "user_id": user.id,
            "email": user.email
        }
        access_token = AuthService.create_access_token(token_payload)
        
        # Prepare response
        user_response = UserResponse(
            id=user.id,
            email=user.email,
            name=user.name
        )
        auth_response = AuthResponse(
            user=user_response,
            token=access_token,
            token_type="Bearer"
        )
        
        return ApiResponse(
            success=True,
            message="Login successful.",
            data=auth_response,
            error=None
        )
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        import traceback
        traceback.print_exc()
        return ApiResponse(
            success=False,
            message=None,
            data=None,
            error=f"Login failed: {str(e)}"
        )