import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "Multimodal Construction Intelligence Platform"
    API_V1_STR: str = "/api"
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    WEATHER_API_KEY: str = os.getenv("WEATHER_API_KEY", "")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
    DATABASE_PATH: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "construction.db")
    MAX_UPLOAD_SIZE_MB: int = 25
    ALLOWED_IMAGE_TYPES: list[str] = ["image/jpeg", "image/png", "image/webp", "image/bmp"]
    
    @property
    def has_gemini_key(self) -> bool:
        return bool(self.GOOGLE_API_KEY and len(self.GOOGLE_API_KEY.strip()) > 5)

settings = Settings()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

