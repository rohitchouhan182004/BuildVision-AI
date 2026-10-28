from typing import List, Optional
from pydantic import BaseModel

class KnowledgeQuery(BaseModel):
    query: str
    category: Optional[str] = "General"

class KnowledgeResult(BaseModel):
    question: str
    category: str
    answer: str
    key_points: List[str] = []
    recommended_practice: str
    safety_note: str
    standard_references: List[str] = []
    disclaimer: str = "General engineering guidance only. Field implementation must follow project structural drawings and local building codes."

