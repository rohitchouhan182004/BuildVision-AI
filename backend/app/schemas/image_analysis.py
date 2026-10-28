from typing import List, Optional
from pydantic import BaseModel
from app.schemas.safety import ObservationBreakdown

class ImageAnalysisResult(BaseModel):
    scene_description: str
    detected_objects: List[str] = []
    construction_stage: str
    visible_materials: List[str] = []
    equipment: List[str] = []
    workers_count_est: str
    potential_issues: List[str] = []
    recommendations: List[str] = []
    confidence: str
    observation_breakdown: ObservationBreakdown
    image_url: Optional[str] = None
    timestamp: Optional[str] = None

