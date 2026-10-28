import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.core.config import settings

def get_db():
    conn = sqlite3.connect(settings.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Projects table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        project_type TEXT NOT NULL,
        location TEXT NOT NULL,
        budget TEXT,
        status TEXT DEFAULT 'IN_PROGRESS',
        start_date TEXT,
        target_date TEXT,
        worker_count INTEGER DEFAULT 35,
        created_at TEXT
    )
    """)
    
    # Analyses table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS analyses (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        module_type TEXT NOT NULL,
        image_url TEXT,
        input_summary TEXT,
        result_json TEXT NOT NULL,
        risk_level TEXT,
        created_at TEXT
    )
    """)
    
    # Chat table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        module TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT
    )
    """)
    
    # Reports table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        project_id TEXT,
        report_data TEXT NOT NULL,
        created_at TEXT
    )
    """)
    
    conn.commit()
    
    # Seed initial projects if empty
    cursor.execute("SELECT COUNT(*) as count FROM projects")
    count = cursor.fetchone()["count"]
    if count == 0:
        seed_projects(cursor)
        conn.commit()
        
    conn.close()

def seed_projects(cursor):
    now = datetime.now().isoformat()
    projects = [
        ("proj-1", "Residential Building - Indore", "Residential Tower", "Indore, MP", "₹8.5 Cr", "ACTIVE", "2026-02-15", "2027-04-30", 45, now),
        ("proj-2", "Commercial Complex - Pune", "Commercial IT Park", "Hinjawadi, Pune", "₹24.0 Cr", "ACTIVE", "2025-10-01", "2027-08-15", 90, now),
        ("proj-3", "Road Infrastructure Project - Bhopal", "Highway & Flyover", "Bhopal Bypass, MP", "₹42.0 Cr", "ACTIVE", "2026-01-10", "2028-01-20", 120, now)
    ]
    for p in projects:
        cursor.execute("""
        INSERT INTO projects (id, name, project_type, location, budget, status, start_date, target_date, worker_count, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, p)

    # Seed some sample analyses
    sample_analyses = [
        (
            "ana-seed-1",
            "proj-1",
            "safety",
            "/sample_images/safety_scaffold.jpg",
            "Slab edge and exterior scaffolding on 5th floor",
            json.dumps({
                "overall_risk": "HIGH",
                "risk_score": 78,
                "summary": "High risk detected due to missing guardrails on perimeter floor edge and 2 workers without safety harnesses attached to life-lines.",
                "hazards": [
                    {
                        "type": "Fall Hazard / Missing Edge Protection",
                        "severity": "CRITICAL",
                        "status": "Observed",
                        "location_in_scene": "Floor slab perimeter, upper level",
                        "description": "Unprotected floor edge without toe-boards or standard 42-inch guardrail system.",
                        "recommendation": "Halt work immediately in the perimeter bay until temporary guardrails and safety netting are installed."
                    },
                    {
                        "type": "Missing PPE (Harness)",
                        "severity": "HIGH",
                        "status": "Observed",
                        "location_in_scene": "Worker near edge",
                        "description": "Worker observed within 1.5m of exposed edge without anchored fall arrest harness.",
                        "recommendation": "Provide full-body harness with shock-absorbing lanyard tied to certified overhead anchor."
                    },
                    {
                        "type": "Material Storage Disorder",
                        "severity": "MEDIUM",
                        "status": "Likely",
                        "location_in_scene": "Access staging area",
                        "description": "Reinforcement rebar offcuts scattered across primary walking route.",
                        "recommendation": "Clear walkway and designate secure material drop area."
                    }
                ],
                "observation_breakdown": {
                    "observed": ["Floor edge lacking guardrail", "Worker near edge without tethered harness", "Rebar offcuts on floor"],
                    "likely": ["Tripping hazard along transit paths", "Wind draft risk on high elevation"],
                    "cannot_determine": ["Integrity of scaffold ledger couplers without close inspection", "Load capacity rating of temporary shoring"]
                },
                "recommended_actions": [
                    "Stop work within 2 meters of unprotected slab edge",
                    "Erect OSHA-standard perimeter guardrails and safety nets",
                    "Conduct mandatory safety stand-down briefing for tower crew"
                ],
                "ppe_compliance_rate": "62%"
            }),
            "HIGH",
            now
        ),
        (
            "ana-seed-2",
            "proj-1",
            "crack",
            "/sample_images/concrete_crack.jpg",
            "Basement retaining wall shear line",
            json.dumps({
                "crack_detected": True,
                "severity": "MEDIUM",
                "type": "Diagonal shear crack in RCC beam-column junction",
                "location": "Upper quadrant of column junction",
                "estimated_width": "Approx 1.8mm to 2.5mm (visual estimate, reference coin nearby)",
                "length_estimate": "Approx 45cm visible length",
                "possible_causes": [
                    "Differential settlement or thermal shrinkage stress",
                    "Excess shear loading during recent formwork demolding",
                    "Inadequate secondary shear reinforcement (stirrups)"
                ],
                "recommendation": "Install optical crack tell-tale gauge to monitor live displacement. Schedule non-destructive ultrasonic pulse velocity (UPV) test and structural engineer sign-off before subsequent floor casting.",
                "inspection_required": True,
                "urgency": "High - within 48 hours",
                "disclaimer": "Visual indication only. Professional structural inspection is recommended."
            }),
            "MEDIUM",
            now
        )
    ]
    for a in sample_analyses:
        cursor.execute("""
        INSERT INTO analyses (id, project_id, module_type, image_url, input_summary, result_json, risk_level, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, a)

    # Seed sample report
    sample_report = (
        "rep-seed-1",
        "Weekly Structural & Safety Audit - Indore Tower",
        "proj-1",
        json.dumps({
            "id": "rep-seed-1",
            "title": "Weekly Structural & Safety Audit - Indore Tower",
            "project_name": "Residential Building - Indore",
            "created_at": now,
            "overall_site_risk": "HIGH",
            "executive_summary": "Weekly comprehensive audit identified critical fall hazard at 5th floor slab perimeter and a medium-severity diagonal crack in column B-4 basement junction requiring monitoring.",
            "safety_findings": [
                {
                    "hazard": "Missing Edge Guardrails",
                    "risk": "CRITICAL",
                    "action": "Immediate stoppage until guardrail installation"
                },
                {
                    "hazard": "Fall arrest harness omission",
                    "risk": "HIGH",
                    "action": "Mandatory PPE enforcement"
                }
            ],
            "structural_crack_findings": [
                {
                    "element": "Basement Retaining / Column Junction",
                    "severity": "MEDIUM",
                    "width": "Approx 1.8mm - 2.5mm",
                    "recommendation": "Install tell-tale crack monitoring gauge"
                }
            ],
            "planning_summary": {
                "current_phase": "Structural Work - Floor 5 RCC Pouring",
                "schedule_status": "On schedule (3 days buffer)",
                "next_milestone": "Floor 6 Slab shuttering"
            },
            "weather_context": {
                "condition": "Clear Sky / Warm",
                "wind": "12 km/h",
                "concrete_curing_impact": "High evaporation rate; apply curing compound or continuous wet hessian cover."
            },
            "critical_action_items": [
                "Install perimeter double-rail safety barriers on Floor 5 by 17:00 today.",
                "Fix optical crack displacement gauge at Column B-4 and record daily readings.",
                "Increase concrete misting frequency due to low daytime humidity."
            ],
            "disclaimer": "Multimodal AI Decision Support System: Field verifications must be confirmed by certified site engineers."
        }),
        now
    )
    cursor.execute("""
    INSERT INTO reports (id, title, project_id, report_data, created_at)
    VALUES (?, ?, ?, ?, ?)
    """, sample_report)

def get_all_projects() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM projects ORDER BY created_at DESC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

def create_project(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    proj_id = str(uuid.uuid4())[:8]
    now = datetime.now().isoformat()
    cursor.execute("""
    INSERT INTO projects (id, name, project_type, location, budget, status, start_date, target_date, worker_count, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        proj_id,
        data.get("name", "New Project"),
        data.get("project_type", "General"),
        data.get("location", "Not specified"),
        data.get("budget", "₹0"),
        data.get("status", "ACTIVE"),
        data.get("start_date", now[:10]),
        data.get("target_date", ""),
        data.get("worker_count", 20),
        now
    ))
    conn.commit()
    conn.close()
    return {"id": proj_id, **data, "created_at": now}

def save_analysis(project_id: Optional[str], module_type: str, image_url: Optional[str], input_summary: str, result_dict: Dict[str, Any], risk_level: str = "MEDIUM") -> str:
    conn = get_db()
    cursor = conn.cursor()
    ana_id = "ana-" + str(uuid.uuid4())[:8]
    now = datetime.now().isoformat()
    cursor.execute("""
    INSERT INTO analyses (id, project_id, module_type, image_url, input_summary, result_json, risk_level, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        ana_id,
        project_id,
        module_type,
        image_url,
        input_summary,
        json.dumps(result_dict),
        risk_level,
        now
    ))
    conn.commit()
    conn.close()
    return ana_id

def get_analyses(limit: int = 50, module_type: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    if module_type:
        cursor.execute("SELECT * FROM analyses WHERE module_type = ? ORDER BY created_at DESC LIMIT ?", (module_type, limit))
    else:
        cursor.execute("SELECT * FROM analyses ORDER BY created_at DESC LIMIT ?", (limit,))
    rows = []
    for r in cursor.fetchall():
        item = dict(r)
        try:
            item["result_json"] = json.loads(item["result_json"])
        except Exception:
            pass
        rows.append(item)
    conn.close()
    return rows

def save_report(title: str, project_id: Optional[str], report_data: Dict[str, Any]) -> str:
    conn = get_db()
    cursor = conn.cursor()
    rep_id = "rep-" + str(uuid.uuid4())[:8]
    now = datetime.now().isoformat()
    cursor.execute("""
    INSERT INTO reports (id, title, project_id, report_data, created_at)
    VALUES (?, ?, ?, ?, ?)
    """, (rep_id, title, project_id, json.dumps(report_data), now))
    conn.commit()
    conn.close()
    return rep_id

def get_reports(limit: int = 20) -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM reports ORDER BY created_at DESC LIMIT ?", (limit,))
    rows = []
    for r in cursor.fetchall():
        item = dict(r)
        try:
            item["report_data"] = json.loads(item["report_data"])
        except Exception:
            pass
        rows.append(item)
    conn.close()
    return rows

def save_chat_message(session_id: str, module: str, role: str, content: str):
    conn = get_db()
    cursor = conn.cursor()
    msg_id = "msg-" + str(uuid.uuid4())[:8]
    now = datetime.now().isoformat()
    cursor.execute("""
    INSERT INTO chat_messages (id, session_id, module, role, content, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (msg_id, session_id, module, role, content, now))
    conn.commit()
    conn.close()

def get_chat_history(session_id: str, module: str = "assistant", limit: int = 20) -> List[Dict[str, str]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT role, content FROM chat_messages 
    WHERE session_id = ? AND module = ? 
    ORDER BY created_at ASC LIMIT ?
    """, (session_id, module, limit))
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows
