import os
import uuid
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
from app.core.config import settings
from app.schemas.common import APIResponse, APIError
from app.schemas.safety import SafetyAnalysisResult
from app.schemas.image_analysis import ImageAnalysisResult
from app.schemas.crack import CrackAnalysisResult
from app.schemas.planning import ProjectPlanRequest, ProjectPlanResult
from app.schemas.valuation import ValuationRequest, ValuationResult
from app.schemas.weather import WeatherAdvisoryRequest, WeatherAdvisoryResult
from app.schemas.knowledge import KnowledgeQuery, KnowledgeResult
from app.schemas.assistant import SiteAssistantRequest, SiteAssistantResponse
from app.schemas.report import ReportGenerateRequest, ReportResult

from app.services.ai_service import ai_service
from app.services.weather_service import get_weather_advisory
from app.services.report_service import generate_consolidated_report
from app.models.database import (
    get_all_projects, create_project, save_analysis, get_analyses,
    save_report, get_reports, save_chat_message, get_chat_history
)

router = APIRouter()

@router.get("/health", response_model=APIResponse[Dict[str, Any]])
async def health_check():
    return APIResponse(
        success=True,
        data={
            "status": "healthy",
            "service": settings.PROJECT_NAME,
            "gemini_configured": settings.has_gemini_key,
            "gemini_model": settings.GEMINI_MODEL,
            "demo_mode_active": not settings.has_gemini_key
        },
        demo_mode=not settings.has_gemini_key
    )

@router.get("/system/status", response_model=APIResponse[Dict[str, Any]])
async def system_status():
    return APIResponse(
        success=True,
        data={
            "gemini_live": ai_service.is_live,
            "model": settings.GEMINI_MODEL,
            "weather_api_configured": bool(settings.WEATHER_API_KEY),
            "demo_mode": not ai_service.is_live,
            "mode_label": "Live Gemini AI" if ai_service.is_live else "Demo / Mock Mode"
        },
        demo_mode=not ai_service.is_live
    )

# ----------------- MODULE 1: SITE SAFETY MONITORING -----------------
@router.post("/analyze/safety", response_model=APIResponse[SafetyAnalysisResult])
async def analyze_safety(
    file: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None),
    context: Optional[str] = Form(""),
    project_id: Optional[str] = Form(None)
):
    try:
        content_bytes = b""
        mime_type = "image/jpeg"
        saved_rel_url = image_url or "/sample_images/safety_scaffold.svg"

        if file:
            content_bytes = await file.read()
            mime_type = file.content_type or "image/jpeg"
            filename = f"safety_{uuid.uuid4().hex[:8]}_{file.filename}"
            filepath = os.path.join(settings.UPLOAD_DIR, filename)
            with open(filepath, "wb") as f:
                f.write(content_bytes)
            saved_rel_url = f"/uploads/{filename}"
        elif image_url:
            # Check if it's a sample image
            clean_url = image_url.lstrip("/")
            local_sample = os.path.join(os.path.dirname(settings.UPLOAD_DIR), clean_url)
            if os.path.exists(local_sample):
                with open(local_sample, "rb") as f:
                    content_bytes = f.read()
                    mime_type = "image/svg+xml" if local_sample.endswith(".svg") else "image/jpeg"

        result, is_demo = await ai_service.analyze_safety(content_bytes, mime_type=mime_type, context=context or "")
        result.image_url = saved_rel_url

        save_analysis(
            project_id=project_id,
            module_type="safety",
            image_url=saved_rel_url,
            input_summary=context or "Site Safety Vision Inspection",
            result_dict=result.model_dump(),
            risk_level=result.overall_risk.value
        )

        return APIResponse(success=True, data=result, demo_mode=is_demo)
    except Exception as e:
        return APIResponse(
            success=False,
            error=APIError(code="SAFETY_ANALYSIS_FAILED", message=str(e)),
            demo_mode=True
        )

# ----------------- MODULE 2: CONSTRUCTION IMAGE ANALYSIS -----------------
@router.post("/analyze/image", response_model=APIResponse[ImageAnalysisResult])
async def analyze_image(
    file: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None),
    context: Optional[str] = Form(""),
    project_id: Optional[str] = Form(None)
):
    try:
        content_bytes = b""
        mime_type = "image/jpeg"
        saved_rel_url = image_url or "/sample_images/construction_site.svg"

        if file:
            content_bytes = await file.read()
            mime_type = file.content_type or "image/jpeg"
            filename = f"img_{uuid.uuid4().hex[:8]}_{file.filename}"
            filepath = os.path.join(settings.UPLOAD_DIR, filename)
            with open(filepath, "wb") as f:
                f.write(content_bytes)
            saved_rel_url = f"/uploads/{filename}"
        elif image_url:
            clean_url = image_url.lstrip("/")
            local_sample = os.path.join(os.path.dirname(settings.UPLOAD_DIR), clean_url)
            if os.path.exists(local_sample):
                with open(local_sample, "rb") as f:
                    content_bytes = f.read()
                    mime_type = "image/svg+xml" if local_sample.endswith(".svg") else "image/jpeg"

        result, is_demo = await ai_service.analyze_image(content_bytes, mime_type=mime_type, context=context or "")
        result.image_url = saved_rel_url

        save_analysis(
            project_id=project_id,
            module_type="image_analysis",
            image_url=saved_rel_url,
            input_summary=context or "General Construction Scene Inspection",
            result_dict=result.model_dump(),
            risk_level="MEDIUM"
        )

        return APIResponse(success=True, data=result, demo_mode=is_demo)
    except Exception as e:
        return APIResponse(
            success=False,
            error=APIError(code="IMAGE_ANALYSIS_FAILED", message=str(e)),
            demo_mode=True
        )

# ----------------- MODULE 3: CRACK DETECTION & ANALYSIS -----------------
@router.post("/analyze/crack", response_model=APIResponse[CrackAnalysisResult])
async def analyze_crack(
    file: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None),
    context: Optional[str] = Form(""),
    project_id: Optional[str] = Form(None)
):
    try:
        content_bytes = b""
        mime_type = "image/jpeg"
        saved_rel_url = image_url or "/sample_images/concrete_crack.svg"

        if file:
            content_bytes = await file.read()
            mime_type = file.content_type or "image/jpeg"
            filename = f"crack_{uuid.uuid4().hex[:8]}_{file.filename}"
            filepath = os.path.join(settings.UPLOAD_DIR, filename)
            with open(filepath, "wb") as f:
                f.write(content_bytes)
            saved_rel_url = f"/uploads/{filename}"
        elif image_url:
            clean_url = image_url.lstrip("/")
            local_sample = os.path.join(os.path.dirname(settings.UPLOAD_DIR), clean_url)
            if os.path.exists(local_sample):
                with open(local_sample, "rb") as f:
                    content_bytes = f.read()
                    mime_type = "image/svg+xml" if local_sample.endswith(".svg") else "image/jpeg"

        result, is_demo = await ai_service.analyze_crack(content_bytes, mime_type=mime_type, context=context or "")
        result.image_url = saved_rel_url

        save_analysis(
            project_id=project_id,
            module_type="crack",
            image_url=saved_rel_url,
            input_summary=context or "Structural Crack Inspection",
            result_dict=result.model_dump(),
            risk_level=result.severity
        )

        return APIResponse(success=True, data=result, demo_mode=is_demo)
    except Exception as e:
        return APIResponse(
            success=False,
            error=APIError(code="CRACK_ANALYSIS_FAILED", message=str(e)),
            demo_mode=True
        )

# ----------------- MODULE 4: PROJECT PLANNING -----------------
@router.post("/projects/plan", response_model=APIResponse[ProjectPlanResult])
async def plan_project(req: ProjectPlanRequest):
    try:
        result, is_demo = await ai_service.generate_project_plan(req)
        save_analysis(
            project_id=None,
            module_type="planning",
            image_url=None,
            input_summary=f"Project Plan: {req.project_name} ({req.project_type})",
            result_dict=result.model_dump(),
            risk_level="LOW"
        )
        return APIResponse(success=True, data=result, demo_mode=is_demo)
    except Exception as e:
        return APIResponse(
            success=False,
            error=APIError(code="PLANNING_FAILED", message=str(e)),
            demo_mode=True
        )

# ----------------- MODULE 5: PROPERTY VALUATION -----------------
@router.post("/property/valuation", response_model=APIResponse[ValuationResult])
async def value_property(req: ValuationRequest):
    try:
        result, is_demo = await ai_service.estimate_property(req)
        save_analysis(
            project_id=None,
            module_type="valuation",
            image_url=None,
            input_summary=f"Valuation: {req.property_type} in {req.location} ({req.area_sqft} sqft)",
            result_dict=result.model_dump(),
            risk_level="LOW"
        )
        return APIResponse(success=True, data=result, demo_mode=is_demo)
    except Exception as e:
        return APIResponse(
            success=False,
            error=APIError(code="VALUATION_FAILED", message=str(e)),
            demo_mode=True
        )

# ----------------- MODULE 6: DAILY SITE ASSISTANT -----------------
@router.post("/assistant/chat", response_model=APIResponse[SiteAssistantResponse])
async def assistant_chat(req: SiteAssistantRequest):
    try:
        session_id = req.session_id or "default-session"
        history = get_chat_history(session_id, module="assistant", limit=8)
        save_chat_message(session_id, "assistant", "user", req.message)
        
        result, is_demo = await ai_service.site_assistant_chat(req, history)
        save_chat_message(session_id, "assistant", "assistant", result.reply)
        
        return APIResponse(success=True, data=result, demo_mode=is_demo)
    except Exception as e:
        return APIResponse(
            success=False,
            error=APIError(code="ASSISTANT_FAILED", message=str(e)),
            demo_mode=True
        )

@router.get("/assistant/history/{session_id}", response_model=APIResponse[List[Dict[str, str]]])
async def get_assistant_history(session_id: str):
    history = get_chat_history(session_id, module="assistant", limit=30)
    return APIResponse(success=True, data=history)

# ----------------- MODULE 7: WEATHER ADVISORY -----------------
@router.get("/weather/{location}", response_model=APIResponse[WeatherAdvisoryResult])
async def weather_by_location(location: str):
    try:
        advisory = get_weather_advisory(location)
        return APIResponse(success=True, data=advisory, demo_mode=not bool(settings.WEATHER_API_KEY))
    except Exception as e:
        return APIResponse(
            success=False,
            error=APIError(code="WEATHER_FAILED", message=str(e)),
            demo_mode=True
        )

@router.post("/weather/advisory", response_model=APIResponse[WeatherAdvisoryResult])
async def weather_advisory_post(req: WeatherAdvisoryRequest):
    try:
        advisory = get_weather_advisory(req.location)
        return APIResponse(success=True, data=advisory, demo_mode=not bool(settings.WEATHER_API_KEY))
    except Exception as e:
        return APIResponse(
            success=False,
            error=APIError(code="WEATHER_FAILED", message=str(e)),
            demo_mode=True
        )

# ----------------- MODULE 8: CONSTRUCTION KNOWLEDGE -----------------
@router.post("/knowledge/ask", response_model=APIResponse[KnowledgeResult])
async def ask_knowledge(req: KnowledgeQuery):
    try:
        result, is_demo = await ai_service.answer_construction_question(req)
        return APIResponse(success=True, data=result, demo_mode=is_demo)
    except Exception as e:
        return APIResponse(
            success=False,
            error=APIError(code="KNOWLEDGE_FAILED", message=str(e)),
            demo_mode=True
        )

# ----------------- MODULE 9: REPORT GENERATION -----------------
@router.post("/reports/generate", response_model=APIResponse[ReportResult])
async def create_report(req: ReportGenerateRequest):
    try:
        report = generate_consolidated_report(req)
        save_report(report.title, req.project_id, report.model_dump())
        return APIResponse(success=True, data=report, demo_mode=False)
    except Exception as e:
        return APIResponse(
            success=False,
            error=APIError(code="REPORT_GENERATION_FAILED", message=str(e))
        )

@router.get("/reports", response_model=APIResponse[List[Dict[str, Any]]])
async def list_reports():
    reports = get_reports(30)
    return APIResponse(success=True, data=reports)

# ----------------- PROJECTS & ANALYSES RECORDS -----------------
@router.get("/projects", response_model=APIResponse[List[Dict[str, Any]]])
async def list_projects():
    projects = get_all_projects()
    return APIResponse(success=True, data=projects)

@router.post("/projects", response_model=APIResponse[Dict[str, Any]])
async def add_project(data: Dict[str, Any]):
    new_proj = create_project(data)
    return APIResponse(success=True, data=new_proj)

@router.get("/analyses", response_model=APIResponse[List[Dict[str, Any]]])
async def list_analyses(module: Optional[str] = Query(None)):
    analyses = get_analyses(50, module_type=module)
    return APIResponse(success=True, data=analyses)

@router.get("/dashboard/metrics", response_model=APIResponse[Dict[str, Any]])
async def dashboard_metrics():
    projects = get_all_projects()
    analyses = get_analyses(30)
    reports = get_reports(10)
    
    high_risk_count = sum(1 for a in analyses if (a.get("risk_level") or "").upper() in ["HIGH", "CRITICAL"])
    safety_analyses_count = sum(1 for a in analyses if a.get("module_type") == "safety")
    crack_analyses_count = sum(1 for a in analyses if a.get("module_type") == "crack")
    
    weather_summary = get_weather_advisory("Indore, MP")
    
    return APIResponse(
        success=True,
        data={
            "total_projects": len(projects),
            "active_projects": [p["name"] for p in projects[:3]],
            "total_analyses": len(analyses),
            "high_risk_count": high_risk_count,
            "safety_analyses_count": safety_analyses_count,
            "crack_analyses_count": crack_analyses_count,
            "total_reports": len(reports),
            "recent_analyses": analyses[:5],
            "recent_reports": reports[:3],
            "weather_status": {
                "location": weather_summary.location,
                "risk": weather_summary.weather_risk,
                "temp": weather_summary.current.temperature_c,
                "summary": weather_summary.risk_summary
            },
            "system_mode": {
                "is_live": ai_service.is_live,
                "model": settings.GEMINI_MODEL
            }
        },
        demo_mode=not ai_service.is_live
    )
