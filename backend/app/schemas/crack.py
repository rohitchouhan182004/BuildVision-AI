from typing import List, Optional
from pydantic import BaseModel

class CrackAnalysisResult(BaseModel):
    crack_detected: bool
    severity: str
    type: str
    location: str
    estimated_width: Optional[str] = None
    length_estimate: Optional[str] = None
    possible_causes: List[str] = []
    recommendation: str
    inspection_required: bool
    urgency: str
    disclaimer: str = "Visual indication only. Professional structural inspection is recommended."
    image_url: Optional[str] = None
    timestamp: Optional[str] = None

