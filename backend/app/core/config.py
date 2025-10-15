import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Application settings and configuration."""
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    APP_NAME: str = "CodeKar Backend"
    VERSION: str = "0.1.0"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

settings = Settings()