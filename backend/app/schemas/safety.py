from typing import List, Optional
from pydantic import BaseModel
from enum import Enum

class SeverityLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class ObservationStatus(str, Enum):
    OBSERVED = "Observed"
    LIKELY = "Likely"
    CANNOT_DETERMINE = "Cannot determine"

class HazardItem(BaseModel):
    type: str
    severity: SeverityLevel
    status: ObservationStatus
    description: str
    recommendation: str
    location_in_scene: Optional[str] = "Visual Field"

class ObservationBreakdown(BaseModel):
    observed: List[str] = []
    likely: List[str] = []
    cannot_determine: List[str] = []

class SafetyAnalysisResult(BaseModel):
    overall_risk: SeverityLevel
    risk_score: int
    summary: str
    hazards: List[HazardItem] = []
    observation_breakdown: ObservationBreakdown
    recommended_actions: List[str] = []
    ppe_compliance_rate: Optional[str] = "Not estimated"
    image_url: Optional[str] = None
    timestamp: Optional[str] = None

