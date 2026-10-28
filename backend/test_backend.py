import asyncio
import httpx
from app.main import app
from app.models.database import init_db

async def run_tests():
    init_db()
    print("=== Testing FastAPI Endpoints with ASGI Transport ===")
    
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health
        r = await client.get("/api/health")
        assert r.status_code == 200, f"Health check failed: {r.text}"
        assert r.json()["success"] == True
        print("✔ GET /api/health passed")

        # 2. System Status
        r = await client.get("/api/system/status")
        assert r.status_code == 200
        assert r.json()["success"] == True
        print("✔ GET /api/system/status passed:", r.json()["data"]["mode_label"])

        # 3. Dashboard metrics
        r = await client.get("/api/dashboard/metrics")
        assert r.status_code == 200
        assert r.json()["data"]["total_projects"] >= 3
        print("✔ GET /api/dashboard/metrics passed")

        # 4. Site Safety Analysis
        r = await client.post("/api/analyze/safety", data={
            "image_url": "/sample_images/safety_scaffold.svg",
            "context": "Perimeter slab inspection",
            "project_id": "proj-1"
        })
        assert r.status_code == 200
        res = r.json()
        assert res["success"] == True
        assert "overall_risk" in res["data"]
        assert len(res["data"]["hazards"]) > 0
        print("✔ POST /api/analyze/safety passed (Risk:", res["data"]["overall_risk"], "Score:", res["data"]["risk_score"], ")")

        # 5. Construction Image Analysis
        r = await client.post("/api/analyze/image", data={
            "image_url": "/sample_images/construction_site.svg",
            "context": "Superstructure frame",
            "project_id": "proj-1"
        })
        assert r.status_code == 200
        res = r.json()
        assert res["success"] == True
        assert "construction_stage" in res["data"]
        print("✔ POST /api/analyze/image passed (Stage:", res["data"]["construction_stage"], ")")

        # 6. Crack Analysis
        r = await client.post("/api/analyze/crack", data={
            "image_url": "/sample_images/concrete_crack.svg",
            "context": "Column-beam shear crack",
            "project_id": "proj-1"
        })
        assert r.status_code == 200
        res = r.json()
        assert res["success"] == True
        assert res["data"]["crack_detected"] == True
        assert "disclaimer" in res["data"]
        print("✔ POST /api/analyze/crack passed (Severity:", res["data"]["severity"], ")")

        # 7. Project Planning
        r = await client.post("/api/projects/plan", json={
            "project_name": "Mayur Vihar G+8 Tower",
            "project_type": "Residential",
            "location": "Indore, MP",
            "start_date": "2026-11-01",
            "target_completion_date": "2027-11-01",
            "budget": "₹8.5 Cr",
            "number_of_workers": 40,
            "project_description": "Test G+8 RCC structure",
            "major_activities": ["Raft foundation", "Superstructure RCC", "Masonry"],
            "constraints": ["Monsoon season"]
        })
        assert r.status_code == 200
        res = r.json()
        assert res["success"] == True
        assert len(res["data"]["phases"]) > 0
        print("✔ POST /api/projects/plan passed (Total duration:", res["data"]["estimated_total_duration_days"], "days)")

        # 8. Property Valuation
        r = await client.post("/api/property/valuation", json={
            "property_type": "Residential Apartment",
            "location": "Vijay Nagar, Indore",
            "area_sqft": 1500.0,
            "number_of_floors": 4,
            "number_of_rooms": 3,
            "age_years": 2.0,
            "construction_quality": "Premium RCC",
            "amenities": ["Lift", "Power Backup", "Parking"],
            "nearby_facilities": ["Metro", "Hospital"],
            "current_condition": "Excellent",
            "additional_notes": "Corner flat"
        })
        assert r.status_code == 200
        res = r.json()
        assert res["success"] == True
        assert res["data"]["estimated_value_median"] > 0
        print("✔ POST /api/property/valuation passed (Rate:", res["data"]["price_per_sqft_range"], ")")

        # 9. Daily Site Assistant
        r = await client.post("/api/assistant/chat", json={
            "session_id": "test-session",
            "message": "What should be checked before concrete pouring?",
            "project_id": "proj-1"
        })
        assert r.status_code == 200
        res = r.json()
        assert res["success"] == True
        assert len(res["data"]["action_checklist"]) > 0
        print("✔ POST /api/assistant/chat passed")

        # 10. Weather Advisory
        r = await client.post("/api/weather/advisory", json={"location": "Indore, MP", "days_ahead": 5})
        assert r.status_code == 200
        res = r.json()
        assert res["success"] == True
        assert "weather_risk" in res["data"]
        print("✔ POST /api/weather/advisory passed (Risk:", res["data"]["weather_risk"], ")")

        # 11. Construction Knowledge
        r = await client.post("/api/knowledge/ask", json={
            "query": "What is the minimum curing period for concrete slabs under IS 456?",
            "category": "Concrete Technology & Quality"
        })
        assert r.status_code == 200
        res = r.json()
        assert res["success"] == True
        assert len(res["data"]["key_points"]) > 0
        print("✔ POST /api/knowledge/ask passed")

        # 12. Report Generation
        r = await client.post("/api/reports/generate", json={
            "title": "Comprehensive Test Site Audit Report",
            "project_id": "proj-1",
            "include_safety": True,
            "include_cracks": True,
            "include_weather": True,
            "include_planning": True
        })
        assert r.status_code == 200
        res = r.json()
        assert res["success"] == True
        assert "executive_summary" in res["data"]
        print("✔ POST /api/reports/generate passed (Report ID:", res["data"]["id"], ")")

    print("\n🎉 ALL 12 BACKEND ENDPOINTS TESTED AND VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(run_tests())
