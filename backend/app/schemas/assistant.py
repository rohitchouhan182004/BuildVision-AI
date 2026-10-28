from typing import List, Optional
from pydantic import BaseModel

class SiteAssistantRequest(BaseModel):
    session_id: Optional[str] = "default-session"
    message: str
    project_id: Optional[str] = None
    project_context: Optional[str] = None

class SiteAssistantResponse(BaseModel):
    session_id: str
    reply: str
    action_checklist: List[str] = []
    safety_reminders: List[str] = []
    suggested_followups: List[str] = []

