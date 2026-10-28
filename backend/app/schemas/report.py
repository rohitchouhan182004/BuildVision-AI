from typing import List, Optional, Any, Dict
from pydantic import BaseModel

class ReportGenerateRequest(BaseModel):
    title: str = "Site Intelligence & Compliance Audit Report"
    project_id: Optional[str] = "proj-1"
    analysis_ids: List[str] = []
    include_safety: bool = True
    include_cracks: bool = True
    include_weather: bool = True
    include_planning: bool = True
    notes: Optional[str] = "Generated for weekly site safety meeting."

class ReportResult(BaseModel):
    id: str
    title: str
    project_name: str
    created_at: str
    executive_summary: str
    overall_site_risk: str
    safety_findings: List[Dict[str, Any]] = []
    structural_crack_findings: List[Dict[str, Any]] = []
    planning_summary: Optional[Dict[str, Any]] = None
    weather_context: Optional[Dict[str, Any]] = None
    critical_action_items: List[str] = []
    disclaimer: str = "Multimodal AI Decision Support System: Field verifications must be confirmed by certified site engineers."

