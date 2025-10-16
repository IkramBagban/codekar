from datetime import datetime, timedelta
from typing import Optional
import jwt
from app.core.config import settings


class AuthService:    
    @staticmethod
    def create_access_token(data: dict) -> str:
        to_encode = data.copy()
                
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> Optional[dict]:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            print("Token has expired")
            return None
        except jwt.JWTError as e:
            print(f"Token verification failed: {e}")
            return None
