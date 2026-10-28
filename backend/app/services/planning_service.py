from app.schemas.planning import ProjectPlanRequest, ProjectPlanResult, PhaseItem, TaskItem

def generate_mock_project_plan(req: ProjectPlanRequest) -> ProjectPlanResult:
    phases = [
        PhaseItem(
            phase_number=1,
            phase_name="Planning & Statutory Approvals",
            duration_days=30,
            tasks=[
                TaskItem(name="Architectural and Structural Drawing Sign-off", duration_days=14, dependencies=[], workers_required=4, key_deliverable="Stamped GFC drawings"),
                TaskItem(name="Municipal Building Sanction & Fire NOC", duration_days=20, dependencies=["Architectural and Structural Drawing Sign-off"], workers_required=2, key_deliverable="Permits and sanctioned plans"),
                TaskItem(name="Geotechnical Subsoil Investigation", duration_days=7, dependencies=[], workers_required=3, key_deliverable="Soil bearing capacity report")
            ],
            milestones=["Permits Secured", "Soil Bearing Capacity Validated"],
            critical_checks=["NOC compliance", "Setback clearance verification"]
        ),
        PhaseItem(
            phase_number=2,
            phase_name="Site Preparation & Deep Excavation",
            duration_days=25,
            tasks=[
                TaskItem(name="Site Clearing and Temporary Boundary Fencing", duration_days=5, dependencies=["Municipal Building Sanction & Fire NOC"], workers_required=12, key_deliverable="Enclosed perimeter"),
                TaskItem(name="Bulk Excavation and Dewatering Wells", duration_days=15, dependencies=["Site Clearing and Temporary Boundary Fencing"], workers_required=8, key_deliverable="Foundation pit to target invert level"),
                TaskItem(name="Anti-Termite Soil Treatment & PCC Bedding (1:4:8)", duration_days=5, dependencies=["Bulk Excavation and Dewatering Wells"], workers_required=15, key_deliverable="100mm Plain Cement Concrete base")
            ],
            milestones=["Excavation Level Reached", "PCC Bedding Cured"],
            critical_checks=["Subsoil water table monitoring", "Slope stability of excavated banks"]
        ),
        PhaseItem(
            phase_number=3,
            phase_name="Substructure & Raft/Footing Foundation",
            duration_days=40,
            tasks=[
                TaskItem(name="Foundation Raft Rebar Fabrication & Placement", duration_days=15, dependencies=["Anti-Termite Soil Treatment & PCC Bedding (1:4:8)"], workers_required=25, key_deliverable="Reinforcement cage tied with cover blocks"),
                TaskItem(name="Raft Concrete Pouring (M30 Grade)", duration_days=3, dependencies=["Foundation Raft Rebar Fabrication & Placement"], workers_required=35, key_deliverable="Monolithic raft foundation casting"),
                TaskItem(name="Basement Retaining Walls & Waterproofing Membrane", duration_days=22, dependencies=["Raft Concrete Pouring (M30 Grade)"], workers_required=20, key_deliverable="Waterproofed retaining structure")
            ],
            milestones=["Substructure Completion", "Basement Waterproofing Sign-off"],
            critical_checks=["Pre-pour slump and temperature check", "Cube test sampling for 7 & 28 day strength"]
        ),
        PhaseItem(
            phase_number=4,
            phase_name="Superstructure RCC Framing",
            duration_days=75,
            tasks=[
                TaskItem(name="Column Shuttering and Concrete Casting", duration_days=25, dependencies=["Basement Retaining Walls & Waterproofing Membrane"], workers_required=22, key_deliverable="Vertical load-bearing columns"),
                TaskItem(name="Floor Slab Beam & Deck Shuttering", duration_days=25, dependencies=["Column Shuttering and Concrete Casting"], workers_required=28, key_deliverable="Certified formwork deck staging"),
                TaskItem(name="Floor Slab Rebar & Ready-Mix Pouring", duration_days=25, dependencies=["Floor Slab Beam & Deck Shuttering"], workers_required=32, key_deliverable="Finished cast slabs across floors")
            ],
            milestones=["Topping Out Superstructure", "Floor Deck Concrete Curing Completion"],
            critical_checks=["Formwork prop plumb check", "De-shuttering period adherence (min 14-21 days)"]
        ),
        PhaseItem(
            phase_number=5,
            phase_name="Masonry & Building Envelope",
            duration_days=45,
            tasks=[
                TaskItem(name="AAC Block Masonry / Brickwork Partition Walls", duration_days=25, dependencies=["Floor Slab Rebar & Ready-Mix Pouring"], workers_required=20, key_deliverable="Internal & external partition walls"),
                TaskItem(name="Window Frame Fixing and Door Sub-frames", duration_days=10, dependencies=["AAC Block Masonry / Brickwork Partition Walls"], workers_required=8, key_deliverable="Sub-frames secured with holdfasts"),
                TaskItem(name="External Double-Coat Cement Plastering", duration_days=20, dependencies=["AAC Block Masonry / Brickwork Partition Walls"], workers_required=16, key_deliverable="Weather-tight exterior plaster")
            ],
            milestones=["Envelope Watertight", "Masonry Handover to MEP"],
            critical_checks=["Mortar bond strength", "Plumb & diagonal squareness of block walls"]
        ),
        PhaseItem(
            phase_number=6,
            phase_name="MEP (Mechanical, Electrical & Plumbing)",
            duration_days=50,
            tasks=[
                TaskItem(name="Concealed Electrical Conduit Chasing & Wiring", duration_days=20, dependencies=["AAC Block Masonry / Brickwork Partition Walls"], workers_required=14, key_deliverable="Wired distribution switchboards"),
                TaskItem(name="Plumbing Water Supply & Drainage Piping", duration_days=20, dependencies=["AAC Block Masonry / Brickwork Partition Walls"], workers_required=12, key_deliverable="Hydro-tested pipe stacks"),
                TaskItem(name="Fire Suppression Sprinkler & Wet Riser Lines", duration_days=15, dependencies=["Plumbing Water Supply & Drainage Piping"], workers_required=10, key_deliverable="Certified fire riser manifold")
            ],
            milestones=["MEP Pressure Tests Cleared", "Concealed Lines Audited"],
            critical_checks=["Hydrostatic plumbing pressure test at 10 bar", "Electrical megger insulation resistance test"]
        ),
        PhaseItem(
            phase_number=7,
            phase_name="Finishes & Interior Fitouts",
            duration_days=60,
            tasks=[
                TaskItem(name="Vitrified Tile Flooring and Wall Cladding", duration_days=25, dependencies=["MEP Pressure Tests Cleared"], workers_required=18, key_deliverable="Evenly laid tiled flooring"),
                TaskItem(name="Internal Gypsum Plaster & Primer Paint", duration_days=20, dependencies=["Vitrified Tile Flooring and Wall Cladding"], workers_required=15, key_deliverable="Smooth primer-coated surfaces"),
                TaskItem(name="Sanitary Ware, CP Fittings & Electrical Switch Plates", duration_days=15, dependencies=["Internal Gypsum Plaster & Primer Paint"], workers_required=12, key_deliverable="Installed fixture set")
            ],
            milestones=["Interior Finishes Substantially Complete"],
            critical_checks=["Tile hollow tapping audit", "Water drainage slope in wet areas"]
        ),
        PhaseItem(
            phase_number=8,
            phase_name="Inspection, Commissioning & Handover",
            duration_days=20,
            tasks=[
                TaskItem(name="Elevator & Electrical Substation Commissioning", duration_days=8, dependencies=["Sanitary Ware, CP Fittings & Electrical Switch Plates"], workers_required=6, key_deliverable="Safety certificates and energization"),
                TaskItem(name="Snag List Identification & Rectification", duration_days=10, dependencies=["Elevator & Electrical Substation Commissioning"], workers_required=12, key_deliverable="Zero-defect sign-off"),
                TaskItem(name="Municipal Occupancy Certificate (OC) & Handover", duration_days=7, dependencies=["Snag List Identification & Rectification"], workers_required=3, key_deliverable="Official Occupancy Certificate")
            ],
            milestones=["Occupancy Certificate Granted", "Client Key Handover"],
            critical_checks=["Emergency generator auto-switch test", "Fire alarm sensor simulation"]
        )
    ]
    
    total_days = sum(p.duration_days for p in phases)
    
    summary = (
        f"Master Construction Schedule for '{req.project_name}' ({req.project_type}) in {req.location}.\n"
        f"Total estimated timeline is {total_days} working days spanning 8 key sequential phases. "
        f"The critical path traverses Foundation Raft -> Superstructure Concrete Framing -> MEP Rough-ins -> Commissioning. "
        f"Allocated labor pool of {req.number_of_workers} workers is optimal for staggered parallel MEP and finish works."
    )
    
    return ProjectPlanResult(
        project_name=req.project_name,
        estimated_total_duration_days=total_days,
        phases=phases,
        dependencies=[
            "Soil investigation report precedes foundation raft dimensioning",
            "Excavation completion triggers anti-termite and PCC bedding",
            "Basement retaining wall waterproofing test required before backfilling",
            "Slab de-shuttering dependent on 14-day 70% cube test result",
            "Plumbing pressure test must pass prior to closing tile wall claddings"
        ],
        suggested_timeline=f"Start: {req.start_date} | Target Handover: {req.target_completion_date} (approx. {total_days // 30} months)",
        resource_requirements=[
            "Tower crane (40m jib) & passenger-material hoist",
            f"Daily workforce: {req.number_of_workers} operatives (specialized bar-benders, masons, electricians, plumbers)",
            "Ready-Mix Concrete batching supply contract (M30/M35 grade)",
            "Standby diesel generator (125 kVA) for uninterrupted concrete placement",
            "Optical levelling instruments and calibrated total station"
        ],
        risk_factors=[
            "Monsoon rainfall delays during subsoil excavation and raft concreting",
            "High daytime temperatures causing flash setting in mass concrete",
            "Supply chain lead times for high-grade transformer and elevator equipment",
            "Municipal sanction delays for statutory power energization"
        ],
        milestones=[
            "Phase 1: Permits and NOCs Approved",
            "Phase 3: Substructure / Raft Casting Completed",
            "Phase 4: Topping Out Structural RCC Frame",
            "Phase 6: MEP Hydrostatic Pressure Test Passed",
            "Phase 8: Occupancy Certificate & Final Handover"
        ],
        recommendations=[
            "Establish a 10-day weather buffer prior to excavation phase to avoid trench collapse",
            "Utilize fly-ash blended OPC 53 cement for mass raft foundation to curtail thermal heat of hydration",
            "Enforce daily digital site logs and weekly lookahead schedules to track critical path items"
        ],
        human_readable_summary=summary
    )

