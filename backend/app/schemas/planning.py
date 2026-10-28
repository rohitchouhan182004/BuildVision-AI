from typing import List, Optional
from pydantic import BaseModel

class ProjectPlanRequest(BaseModel):
    project_name: str
    project_type: str = "Residential"
    location: str = "Indore, MP"
    start_date: str = "2026-11-01"
    target_completion_date: str = "2027-10-31"
    budget: str = "₹2.5 Crore"
    number_of_workers: int = 40
    project_description: str
    major_activities: List[str] = []
    constraints: List[str] = []

class TaskItem(BaseModel):
    name: str
    duration_days: int
    dependencies: List[str] = []
    workers_required: int = 10
    key_deliverable: str

class PhaseItem(BaseModel):
    phase_number: int
    phase_name: str
    duration_days: int
    tasks: List[TaskItem] = []
    milestones: List[str] = []
    critical_checks: List[str] = []

class ProjectPlanResult(BaseModel):
    project_name: str
    estimated_total_duration_days: int
    phases: List[PhaseItem] = []
    dependencies: List[str] = []
    suggested_timeline: str
    resource_requirements: List[str] = []
    risk_factors: List[str] = []
    milestones: List[str] = []
    recommendations: List[str] = []
    human_readable_summary: str

