# Multimodal Construction Intelligence Platform

A decision-support system for construction managers, structural engineers, and site safety supervisors. The platform ingests multimodal inputs (construction imagery, telemetry, schedules, environmental parameters) and produces structured engineering assessments, safety audits, crack classifications, project execution plans, real-estate valuations, and weather-aware guidance.

---

## 1. Project Overview

Modern construction sites generate unstructured visual and contextual data that is rarely synthesized in real time. **BuildVision AI** bridges this gap by unifying:

- **Computer Vision & Reasoning**: Identifying missing PPE, unbarricaded slab edges, heavy equipment swing hazards, and concrete defects.
- **Forensic Structural Screening**: Classifying crack patterns (shear, settlement, plastic shrinkage) with explicit conservative safety caveats.
- **Schedule Optimization (WBS & CPM)**: Generating multi-phase construction execution plans with resource requirements, dependencies, and critical milestones.
- **Parametric Property Valuation**: Estimating realistic market valuation bands based on civil quality and regional real-estate metrics.
- **Site Weather Governance**: Analyzing thermal and wind ceilings for concrete pouring, curing, crane lifting, and worker hydration.
- **Interactive Daily Assistant & Knowledge Base**: Retaining session context to answer pre-pour checks, scaffolding tags, and IS/ACI/OSHA code inquiries.
- **Consolidated Audit Reporting**: Compiling field telemetry into exportable, printable compliance reports with PDF export support.

---

## 2. Architecture

```
                  +-----------------------------------------+
                  |             React Frontend              |
                  |     (Vite + TypeScript + Dashboard UI)  |
                  +-----------------------------------------+
                                       |
                                       | REST / JSON
                                       v
                  +-----------------------------------------+
                  |             FastAPI Backend             |
                  |          (Pydantic v2 Validation)       |
                  +-----------------------------------------+
                                       |
                   +-------------------+-------------------+
                   |                                       |
                   v                                       v
      +-------------------------+             +-------------------------+
      |        AI Service       |             |     SQLite Database     |
      |   (Central Abstraction) |             | (Projects, Analyses,   |
      +-------------------------+             |  Audits, Session Logs)  |
         |                   |                +-------------------------+
         | (Live API)        | (Demo Mode)
         v                   v
+------------------+  +--------------------+
|  Google Gemini   |  | Realistic Mock     |
|  Multimodal LLM  |  | Engineering Engine |
+------------------+  +--------------------+
```

The system employs a strict fallback mechanism:
1. When `GOOGLE_API_KEY` is present, it uses Google GenAI / Gemini for multimodal vision and structured reasoning.
2. If the API key is omitted, invalid, or rate-limited, the application operates in **Demo Mode**, utilizing calibrated civil engineering models with zero degradation of UI workflows.

---

## 3. Technology Stack

- **Frontend**:
  - React 18+ with TypeScript
  - Vite build tool
  - Lucide React iconography
  - Clean engineering dashboard styling with print-to-PDF support
- **Backend**:
  - Python 3.12+
  - FastAPI (REST API with ASGI lifespan)
  - Pydantic v2 for strict request/response data contracts
  - SQLite (zero-config, thread-safe persistence)
  - `python-multipart` for high-throughput image uploads
- **AI & Vision**:
  - Google Gemini API (`google-genai` SDK)
  - Multimodal vision parsing for JPG, PNG, WEBP, and SVG diagrams
  - Fallback civil engineering reasoning engine

---

## 4. Folder Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application & middleware
│   │   ├── api/
│   │   │   └── endpoints.py     # All 12 REST endpoints & upload handlers
│   │   ├── core/
│   │   │   └── config.py        # Environment settings & validation
│   │   ├── models/
│   │   │   └── database.py      # SQLite models, seeder & queries
│   │   ├── schemas/             # Pydantic contract schemas
│   │   │   ├── common.py        # Generic APIResponse envelope
│   │   │   ├── safety.py        # PPE & hazard models
│   │   │   ├── image_analysis.py# Visual stage & material models
│   │   │   ├── crack.py         # Forensic crack & disclaimer models
│   │   │   ├── planning.py      # WBS phases, tasks & milestones
│   │   │   ├── valuation.py     # Real-estate valuation band models
│   │   │   ├── weather.py       # Weather & operational advisory
│   │   │   ├── knowledge.py     # Technical knowledge & standards
│   │   │   ├── assistant.py     # Conversational site session models
│   │   │   └── report.py        # Executive audit report models
│   │   └── services/            # Domain services & AI abstraction
│   │       ├── ai_service.py    # Centralized Gemini & fallback orchestrator
│   │       ├── safety_service.py
│   │       ├── image_service.py
│   │       ├── crack_service.py
│   │       ├── planning_service.py
│   │       ├── valuation_service.py
│   │       ├── weather_service.py
│   │       ├── knowledge_service.py
│   │       └── report_service.py
│   ├── sample_images/           # Bundled inspection diagrams & photos
│   ├── uploads/                 # Local uploaded images directory
│   ├── test_backend.py          # Complete automated test suite
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── public/
│   │   └── sample_images/       # Preloaded site inspection samples
│   ├── src/
│   │   ├── components/          # Reusable UI widgets (Header, Sidebar, Dropzone, Badges)
│   │   ├── pages/               # 10 dedicated functional views
│   │   ├── services/            # Typed API client
│   │   ├── types/               # TypeScript interfaces
│   │   ├── App.tsx              # Root dashboard shell
│   │   └── index.css            # Engineering responsive & print styles
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .env.example
├── docker-compose.yml
└── README.md
```

---

## 5. Core Modules

| Module | Purpose | Key Outputs |
| :--- | :--- | :--- |
| **Dashboard** | Command center overview | Project metrics, risk gauges, recent telemetry, immediate actions |
| **Site Safety** | Automated hazard detection | PPE compliance, fall risks, observed vs. likely vs. undetermined breakdown |
| **Image Analysis** | General scene parsing | Construction stage, material inventory, heavy plant, quality risks |
| **Crack Analysis** | Surface forensic screening | Crack type, approximate width, possible causes, inspection urgency, disclaimers |
| **Project Planning** | Master execution schedule | 8-phase WBS, task durations, worker sizing, CPM dependencies, JSON output |
| **Property Valuation** | Real estate appraisal band | Parametric valuation range, positive/negative drivers, confidence notes |
| **Daily Site Assistant** | Contextual site chatbot | Immediate pre-pour checks, scaffolding sign-offs, action checklists |
| **Weather Advisory** | Environmental governance | Concrete evaporation rates, crane wind limits, excavation stability |
| **Knowledge Base** | Engineering code query | IS 456, ACI 318, OSHA standards, recommended field practices |
| **Audit Reports** | Consolidated reporting | Formal printable site audit reports with PDF export capability |

---

## 6. Installation & Quickstart

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Clone & Set Up Backend

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file (or use Demo Mode without credentials)
cp ../.env.example .env
```

### 2. Configure Environment Variables (`backend/.env`)

```env
# Google Gemini API Key (optional for Demo Mode)
GOOGLE_API_KEY=your_gemini_api_key_here

# Gemini Model
GEMINI_MODEL=gemini-2.5-flash

# Optional OpenWeatherMap Key (leave empty for demo weather)
WEATHER_API_KEY=
```

### 3. Run Backend Server

```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend documentation and OpenAPI schema are accessible at:
`http://127.0.0.1:8000/docs`

### 4. Run Frontend Application

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start Vite development server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 7. Running via Docker

A `docker-compose.yml` is provided for containerized deployment:

```bash
# Build and run containers
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/docs`

---

## 8. Verification & Automated Testing

Run the end-to-end automated test suite:

```bash
cd backend
python test_backend.py
```

The test validates all 12 API endpoints, JSON contract schemas, database seed records, and mock generation routines.

---

## 9. Engineering Safeguards & Limitations

1. **Non-Destructive Testing Notice**: The platform's crack detection module is designed strictly as a visual screening aid. It does not replace core drilling, ultrasonic pulse velocity (UPV) testing, or signed certification by a licensed structural engineer.
2. **Dimension Estimates**: Without physical calibration targets or laser scales, all pixel-derived dimension estimates are reported with explicit uncertainty bands.
3. **Conservative Safety Policy**: In safety visual evaluations, risks are explicitly demarcated as *Observed*, *Likely*, or *Cannot Determine* to prevent hallucinated compliance sign-offs.

