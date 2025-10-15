from sqlalchemy import Column, Integer, String
from app.core.database import Base

class User(Base):
    """User model for database."""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', name='{self.name}')>"