import json
import re
import logging
from typing import Tuple, Dict, Any, List, Optional
from datetime import datetime

from app.core.config import settings
from app.schemas.safety import SafetyAnalysisResult, SeverityLevel, ObservationStatus, HazardItem, ObservationBreakdown
from app.schemas.image_analysis import ImageAnalysisResult
from app.schemas.crack import CrackAnalysisResult
from app.schemas.planning import ProjectPlanRequest, ProjectPlanResult, PhaseItem, TaskItem
from app.schemas.valuation import ValuationRequest, ValuationResult
from app.schemas.knowledge import KnowledgeQuery, KnowledgeResult
from app.schemas.assistant import SiteAssistantRequest, SiteAssistantResponse

from app.services.safety_service import generate_mock_safety_analysis
from app.services.image_service import generate_mock_image_analysis
from app.services.crack_service import generate_mock_crack_analysis
from app.services.planning_service import generate_mock_project_plan
from app.services.valuation_service import generate_mock_valuation
from app.services.knowledge_service import answer_mock_knowledge

logger = logging.getLogger("ai_service")

def _clean_json_str(text: str) -> str:
    """Strips markdown code fences and returns raw JSON text."""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

class AIService:
    def __init__(self):
        self.client = None
        self._init_gemini_client()

    def _init_gemini_client(self):
        if settings.has_gemini_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=settings.GOOGLE_API_KEY)
                logger.info("Google GenAI client initialized successfully.")
            except Exception as e:
                logger.warning(f"Could not initialize Google GenAI client: {e}. Falling back to demo mode.")
                self.client = None
        else:
            self.client = None

    @property
    def is_live(self) -> bool:
        return self.client is not None

    async def analyze_safety(self, image_bytes: bytes, mime_type: str = "image/jpeg", context: str = "") -> Tuple[SafetyAnalysisResult, bool]:
        """Analyzes construction site image for PPE, hazards, housekeeping and structural risks."""
        if self.is_live:
            try:
                from google.genai import types
                prompt = f"""
You are an expert Certified Construction Safety Professional (CSP / OSHA Compliance Officer).
Analyze this construction site photograph rigorously for visible safety risks, hazards, and OSHA/IS code compliance.
Additional context from user: "{context}".

You MUST return a STRICT JSON object with this exact structure:
{{
  "overall_risk": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "risk_score": <integer from 0 to 100, where 100 is fatal danger>,
  "summary": "<concise paragraph summarizing safety observations>",
  "hazards": [
    {{
      "type": "<e.g. Missing Hardhat / Fall Hazard / Uncapped Rebar / Heavy Plant Proximity>",
      "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      "status": "Observed" | "Likely" | "Cannot determine",
      "location_in_scene": "<where in the image>",
      "description": "<detailed observation>",
      "recommendation": "<practical engineering/safety corrective action>"
    }}
  ],
  "observation_breakdown": {{
    "observed": ["<strictly verified items in the photo>"],
    "likely": ["<strongly inferred risks>"],
    "cannot_determine": ["<items obscured, distant or needing instruments>"]
  }},
  "recommended_actions": ["<step 1>", "<step 2>", "<step 3>"],
  "ppe_compliance_rate": "<estimated percentage e.g. 75%>"
}}

IMPORTANT SAFETY & INTEGRITY RULES:
1. Never invent or hallucinate objects or violations that are not visible.
2. Clearly distinguish between "Observed", "Likely", and "Cannot determine".
3. Return ONLY valid JSON.
"""
                response = self.client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=[
                        types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                        prompt
                    ]
                )
                raw_json = _clean_json_str(response.text)
                data = json.loads(raw_json)
                result = SafetyAnalysisResult(**data)
                result.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                return result, False
            except Exception as e:
                logger.error(f"Gemini live safety analysis failed: {e}. Falling back to demo mode.")

        # Fallback to rich mock
        res = generate_mock_safety_analysis(context)
        return res, True

    async def analyze_image(self, image_bytes: bytes, mime_type: str = "image/jpeg", context: str = "") -> Tuple[ImageAnalysisResult, bool]:
        """General-purpose construction site scene, equipment, materials, and stage analysis."""
        if self.is_live:
            try:
                from google.genai import types
                prompt = f"""
You are a Principal Construction Engineer. Analyze this site photograph.
Context: "{context}".

Return a STRICT JSON object with this exact structure:
{{
  "scene_description": "<detailed description of construction activities and scene>",
  "detected_objects": ["<object 1>", "<object 2>"],
  "construction_stage": "<e.g. Substructure / Superstructure Framing / MEP / Finishing>",
  "visible_materials": ["<concrete, TMT steel, formwork, etc.>"],
  "equipment": ["<tower crane, excavators, vibrators, etc.>"],
  "workers_count_est": "<e.g. 6 visible personnel>",
  "potential_issues": ["<issue 1>", "<issue 2>"],
  "recommendations": ["<rec 1>", "<rec 2>"],
  "confidence": "<e.g. High visual certainty 85%>",
  "observation_breakdown": {{
    "observed": ["<verified>"],
    "likely": ["<probable>"],
    "cannot_determine": ["<cannot verify without specs>"]
  }}
}}
Return ONLY valid JSON.
"""
                response = self.client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=[
                        types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                        prompt
                    ]
                )
                raw_json = _clean_json_str(response.text)
                data = json.loads(raw_json)
                result = ImageAnalysisResult(**data)
                result.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                return result, False
            except Exception as e:
                logger.error(f"Gemini live image analysis failed: {e}. Falling back to demo mode.")

        return generate_mock_image_analysis(context), True

    async def analyze_crack(self, image_bytes: bytes, mime_type: str = "image/jpeg", context: str = "") -> Tuple[CrackAnalysisResult, bool]:
        """Crack detection and preliminary visual risk appraisal."""
        if self.is_live:
            try:
                from google.genai import types
                prompt = f"""
You are a Senior Structural Forensic Engineer. Analyze this photograph of a concrete/masonry surface for cracks and defects.
Context: "{context}".

You MUST return a STRICT JSON object:
{{
  "crack_detected": true | false,
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "type": "<e.g. Diagonal Shear / Plastic Shrinkage / Thermal Hairline / Flexural Tension Crack>",
  "location": "<approximate location in member/scene>",
  "estimated_width": "<e.g. Approx 1.5mm - 2.5mm (visual estimate, reference scale not calibrated)>",
  "length_estimate": "<e.g. Approx 50cm visible trace>",
  "possible_causes": ["<cause 1>", "<cause 2>"],
  "recommendation": "<recommended structural engineering testing and action>",
  "inspection_required": true,
  "urgency": "<e.g. Immediate / Within 48 hours / Routine observation>",
  "disclaimer": "Visual indication only. Professional structural inspection is recommended."
}}

CRITICAL RULES:
1. Never claim a definitive structural diagnosis from a 2D photograph.
2. Clearly state that dimension estimates are approximate without calibrated scale.
3. Include the disclaimer sentence verbatim.
4. Return ONLY valid JSON.
"""
                response = self.client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=[
                        types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                        prompt
                    ]
                )
                raw_json = _clean_json_str(response.text)
                data = json.loads(raw_json)
                result = CrackAnalysisResult(**data)
                result.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                return result, False
            except Exception as e:
                logger.error(f"Gemini live crack analysis failed: {e}. Falling back to demo mode.")

        return generate_mock_crack_analysis(context), True

    async def generate_project_plan(self, req: ProjectPlanRequest) -> Tuple[ProjectPlanResult, bool]:
        """Generates multi-phase construction project plan with tasks, dependencies and milestones."""
        if self.is_live:
            try:
                prompt = f"""
You are a Master Project Scheduler (PMP / Construction Manager).
Generate an end-to-end master construction execution schedule for:
Project Name: {req.project_name}
Type: {req.project_type}
Location: {req.location}
Start: {req.start_date} | Target: {req.target_completion_date}
Budget: {req.budget} | Daily Labor Workforce: {req.number_of_workers}
Description: {req.project_description}
Activities: {', '.join(req.major_activities)}
Constraints: {', '.join(req.constraints)}

Return a STRICT JSON matching:
{{
  "project_name": "{req.project_name}",
  "estimated_total_duration_days": <integer>,
  "phases": [
    {{
      "phase_number": 1,
      "phase_name": "<Phase Name>",
      "duration_days": <integer>,
      "tasks": [
        {{
          "name": "<Task name>",
          "duration_days": <integer>,
          "dependencies": ["<preceding task or milestone>"],
          "workers_required": <integer>,
          "key_deliverable": "<deliverable>"
        }}
      ],
      "milestones": ["<milestone 1>"],
      "critical_checks": ["<quality/safety inspection check>"]
    }}
  ],
  "dependencies": ["<key critical dependency 1>", "<key critical dependency 2>"],
  "suggested_timeline": "<summary timeline string>",
  "resource_requirements": ["<plant/labor/material requirement>"],
  "risk_factors": ["<risk 1>"],
  "milestones": ["<milestone 1>", "<milestone 2>"],
  "recommendations": ["<recommendation 1>"],
  "human_readable_summary": "<executive master summary paragraph>"
}}
Return ONLY valid JSON.
"""
                response = self.client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=[prompt]
                )
                raw_json = _clean_json_str(response.text)
                data = json.loads(raw_json)
                result = ProjectPlanResult(**data)
                return result, False
            except Exception as e:
                logger.error(f"Gemini live project planning failed: {e}. Falling back to demo mode.")

        return generate_mock_project_plan(req), True

    async def estimate_property(self, req: ValuationRequest) -> Tuple[ValuationResult, bool]:
        """Estimates real estate property valuation range with key parametric drivers."""
        if self.is_live:
            try:
                prompt = f"""
You are an expert Real Estate Appraiser and Cost Engineer.
Estimate the realistic market valuation range for:
Type: {req.property_type}
Location: {req.location}
Built-up Area: {req.area_sqft} sq.ft | Floors: {req.number_of_floors} | Rooms: {req.number_of_rooms}
Age: {req.age_years} years | Construction Quality: {req.construction_quality}
Current Condition: {req.current_condition}
Amenities: {', '.join(req.amenities)}
Nearby Facilities: {', '.join(req.nearby_facilities)}
Notes: {req.additional_notes}

Return a STRICT JSON matching:
{{
  "estimated_value_min": <number in INR>,
  "estimated_value_max": <number in INR>,
  "estimated_value_median": <number in INR>,
  "currency": "INR (₹)",
  "price_per_sqft_range": "<e.g. ₹6,500 - ₹7,800 per sq.ft>",
  "key_factors": ["<factor 1>", "<factor 2>"],
  "positive_factors": ["<pos 1>", "<pos 2>"],
  "negative_factors": ["<neg 1>", "<neg 2>"],
  "confidence": "Moderate (Estimated range ±10%)",
  "explanation": "<detailed narrative explaining pricing dynamics>",
  "disclaimer": "Visual and parametric indication only. AI valuation is not a certified appraiser's guarantee or bank-certified mortgage appraisal."
}}
DO NOT present single fake precision figures; provide a realistic valuation band.
Return ONLY valid JSON.
"""
                response = self.client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=[prompt]
                )
                raw_json = _clean_json_str(response.text)
                data = json.loads(raw_json)
                result = ValuationResult(**data)
                return result, False
            except Exception as e:
                logger.error(f"Gemini live property valuation failed: {e}. Falling back to demo mode.")

        return generate_mock_valuation(req), True

    async def answer_construction_question(self, req: KnowledgeQuery) -> Tuple[KnowledgeResult, bool]:
        """Answers construction technical, safety, or code questions."""
        if self.is_live:
            try:
                prompt = f"""
You are a Principal Civil Engineer and Construction Technologist.
Answer the following construction inquiry:
Question: "{req.query}"
Category: "{req.category}"

Return a STRICT JSON matching:
{{
  "question": "{req.query}",
  "category": "{req.category}",
  "answer": "<thorough technical explanation>",
  "key_points": ["<point 1>", "<point 2>", "<point 3>"],
  "recommended_practice": "<field-proven best engineering practice>",
  "safety_note": "<critical safety precaution for site personnel>",
  "standard_references": ["<e.g. IS 456, ACI 318, OSHA 1926>"],
  "disclaimer": "General engineering guidance only. Field implementation must follow project structural drawings and local building codes."
}}
Return ONLY valid JSON.
"""
                response = self.client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=[prompt]
                )
                raw_json = _clean_json_str(response.text)
                data = json.loads(raw_json)
                result = KnowledgeResult(**data)
                return result, False
            except Exception as e:
                logger.error(f"Gemini live knowledge inquiry failed: {e}. Falling back to demo mode.")

        return answer_mock_knowledge(req), True

    async def site_assistant_chat(self, req: SiteAssistantRequest, history: List[Dict[str, str]]) -> Tuple[SiteAssistantResponse, bool]:
        """Conversational site assistant with retained session context."""
        session_id = req.session_id or "default-session"
        if self.is_live:
            try:
                history_formatted = "\n".join([f"{h['role'].upper()}: {h['content']}" for h in history[-6:]])
                prompt = f"""
You are the AI Daily Site Assistant for a construction project manager and site supervisor.
Project Context: {req.project_context or 'Active multistory reinforced concrete development'}.
Conversation History:
{history_formatted}

User: {req.message}

Provide a practical, concise, action-oriented construction response.
You MUST return a STRICT JSON object:
{{
  "session_id": "{session_id}",
  "reply": "<practical direct answer with clear site instructions>",
  "action_checklist": ["<check 1>", "<check 2>", "<check 3>"],
  "safety_reminders": ["<safety point 1>", "<safety point 2>"],
  "suggested_followups": ["<followup question 1>", "<followup question 2>"]
}}
Return ONLY valid JSON.
"""
                response = self.client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=[prompt]
                )
                raw_json = _clean_json_str(response.text)
                data = json.loads(raw_json)
                result = SiteAssistantResponse(**data)
                return result, False
            except Exception as e:
                logger.error(f"Gemini live site assistant chat failed: {e}. Falling back to demo mode.")

        # Context-aware mock reply
        msg_lower = req.message.lower()
        if "concrete" in msg_lower or "pour" in msg_lower:
            reply = "Before approving today's concrete pour, ensure all formwork supports are checked for plumb, spacer cover blocks are secured under bottom rebar, and MEP conduits are pressure-tested. Verify the concrete batch ticket slump and temperature before discharging the transit mixer."
            checklist = [
                "Verify formwork cleanliness: clear all tie wire clippings and sawdust with air blower",
                "Confirm minimum 40mm cover block placement on beam bottom & sides",
                "Check slump test (target: 120-140 mm for pump mix) and record cube test mold numbers",
                "Ensure at least two working needle vibrators (including 1 standby unit) are plugged in"
            ]
            safety = [
                "Provide rubber boots and eye protection to the pouring gang",
                "Station a spotter near the concrete pump boom swing perimeter"
            ]
            followups = [
                "What is the recommended curing schedule for this slab?",
                "What cube strength is required before striking formwork props?"
            ]
        elif "inspect" in msg_lower or "priority" in msg_lower or "today" in msg_lower:
            reply = "Today's top site priorities: 1) Verify edge guardrails and safety netting on the upper active floor deck; 2) Inspect reinforcement binding for column C-3 to C-7 before closing shutter panels; 3) Coordinate slump and cube test sampling for the scheduled morning slab pour."
            checklist = [
                "Morning 10-minute Toolbox Talk (TBT) on working at heights",
                "Sign off scaffolding green inspection tags on the eastern facade",
                "Audit rebar starter dowel plastic caps along ground access paths",
                "Log daily transit mixer deliveries and slump test readings"
            ]
            safety = [
                "Enforce 100% hardhat and safety vest compliance across all contractor crews",
                "Check that all electrical temporary distribution boards have active ELCB/GFCI breakers"
            ]
            followups = [
                "What should be checked before scaffolding work?",
                "Review today's weather advisory for high-elevation lifting"
            ]
        elif "scaffold" in msg_lower:
            reply = "Prior to authorizing scaffolding work, verify the scaffold has been inspected by a certified scaffolding supervisor within the last 7 days and displays an active green tag. Confirm sole boards, base plates, diagonal cross-braces, and 42-inch top guardrails with toe-boards are complete."
            checklist = [
                "Inspect base plates and timber sole plates on compacted ground",
                "Verify top rail (42 in), mid rail (21 in), and 4 in toe-boards on all open edges",
                "Check that scaffold is securely tied to permanent structure at 4m vertical / 6m horizontal intervals",
                "Ensure working deck is fully planked without gaps exceeding 1 inch"
            ]
            safety = [
                "Mandate full body harnesses with twin lanyards tied off to certified independent life lines",
                "Do not allow work on external scaffolds if wind gusts exceed 38 km/h"
            ]
            followups = [
                "What PPE is mandatory for scaffold erectors?",
                "How do we handle scaffold load capacity ratings?"
            ]
        else:
            reply = f"Understood. For '{req.message}', ensure standard engineering quality checks and Site Safety Work Procedures (SWP) are enforced before proceeding. Keep accurate records in the daily site logbook."
            checklist = [
                "Review Good-For-Construction (GFC) drawings and manufacturer specifications",
                "Conduct task hazard assessment with the subcontractor lead foreman",
                "Verify required tools and calibrated testing instruments are ready"
            ]
            safety = [
                "Ensure all operatives are wearing hardhats, high-vis vests, and safety boots",
                "Maintain clear access corridors and fire extinguisher access points"
            ]
            followups = [
                "What documents should be reviewed before this step?",
                "Generate a daily site safety inspection checklist"
            ]

        res = SiteAssistantResponse(
            session_id=session_id,
            reply=reply,
            action_checklist=checklist,
            safety_reminders=safety,
            suggested_followups=followups
        )
        return res, True

ai_service = AIService()

