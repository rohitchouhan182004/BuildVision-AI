import random
from typing import Dict, Any, List
from datetime import datetime
from app.schemas.safety import SafetyAnalysisResult, SeverityLevel, ObservationStatus, HazardItem, ObservationBreakdown

def generate_mock_safety_analysis(context: str = "") -> SafetyAnalysisResult:
    # Context-aware mock scenarios for realistic construction site evaluations
    scenarios = [
        {
            "overall_risk": SeverityLevel.HIGH,
            "risk_score": 79,
            "summary": "Multiple safety protocol violations observed: 3 workers missing hardhats near operating tower crane load path, and unbarricaded floor edge on the upper deck.",
            "hazards": [
                HazardItem(
                    type="Missing PPE (Hardhat / Head Protection)",
                    severity=SeverityLevel.HIGH,
                    status=ObservationStatus.OBSERVED,
                    location_in_scene="Zone B, near ground hoist",
                    description="Two personnel observed without approved safety helmets directly beneath active overhead staging.",
                    recommendation="Mandate instant work halt for unequipped personnel; enforce EN 397 / ANSI Z89.1 certified head protection before re-entry."
                ),
                HazardItem(
                    type="Fall Hazard / Unprotected Slab Edge",
                    severity=SeverityLevel.CRITICAL,
                    status=ObservationStatus.OBSERVED,
                    location_in_scene="Elevated perimeter slab (upper left)",
                    description="Open slab perimeter over 3 meters height without top rail, mid rail, or toe-board barrier.",
                    recommendation="Install rigid perimeter guardrails and safety debris netting immediately. Disallow work within 2m perimeter without tied-off harness."
                ),
                HazardItem(
                    type="Proximity to Heavy Machinery",
                    severity=SeverityLevel.MEDIUM,
                    status=ObservationStatus.LIKELY,
                    location_in_scene="Excavator swing radius (center right)",
                    description="Pedestrian worker positioned within the 5-meter blind-spot radius of rotating backhoe.",
                    recommendation="Establish physical demarcation cones and appoint a dedicated banksman/signalperson."
                ),
                HazardItem(
                    type="Electrical Cable Submersion Risk",
                    severity=SeverityLevel.MEDIUM,
                    status=ObservationStatus.CANNOT_DETERMINE,
                    location_in_scene="Ground water puddle near distribution board",
                    description="Temporary power cables routed through damp standing water; insulation integrity cannot be verified from image distance.",
                    recommendation="Elevate temporary distribution cables on S-hooks and verify GFCI/ELCB trip sensitivity."
                )
            ],
            "observation_breakdown": ObservationBreakdown(
                observed=[
                    "2 workers lacking hardhats under suspended load trajectory",
                    "Unprotected slab perimeter edge lacking 42-inch guardrail system",
                    "Excavator operating in proximity to ground crew"
                ],
                likely=[
                    "High noise exposure exceeding 85 dBA near generator without visible hearing protection",
                    "Tripping hazard across loose hydraulic hoses"
                ],
                cannot_determine=[
                    "Load capacity rating of temporary shoring jacks",
                    "Electrical grounding/insulation status of damp cables",
                    "Worker certification for operating heavy plant"
                ]
            ),
            "recommended_actions": [
                "Issue immediate stop-work notice for Zone B perimeter until guardrails are certified",
                "Supply and verify ANSI certified helmets for all workers and site supervisors",
                "Appoint certified spotters for heavy earthmoving equipment zones",
                "Conduct a 15-minute morning toolbox talk on overhead load awareness"
            ],
            "ppe_compliance_rate": "68%"
        },
        {
            "overall_risk": SeverityLevel.MEDIUM,
            "risk_score": 48,
            "summary": "Moderate site safety conditions. High-visibility vests and helmets worn by majority of staff; housekeeping and rebar capping require immediate rectification.",
            "hazards": [
                HazardItem(
                    type="Uncapped Protruding Rebar",
                    severity=SeverityLevel.HIGH,
                    status=ObservationStatus.OBSERVED,
                    location_in_scene="Column starter bars on ground slab",
                    description="Vertical rebar dowels exposed without OSHA-compliant mushroom impalement caps.",
                    recommendation="Fit certified steel-reinforced rebar caps or wooden trough covers immediately to eliminate impalement hazard."
                ),
                HazardItem(
                    type="Poor Housekeeping / Scrap Accumulation",
                    severity=SeverityLevel.MEDIUM,
                    status=ObservationStatus.OBSERVED,
                    location_in_scene="Access stairwell entry",
                    description="Discarded timber formwork pieces with protruding nails lying along primary egress corridor.",
                    recommendation="Deploy site cleanup crew to de-nail and stack timber neatly in designated waste skips."
                ),
                HazardItem(
                    type="Incomplete Scaffolding Bracing",
                    severity=SeverityLevel.MEDIUM,
                    status=ObservationStatus.LIKELY,
                    location_in_scene="Facade scaffold bay 3",
                    description="Diagonal cross-bracing appears omitted in third bay; scaffold tag not clearly legible.",
                    recommendation="Have certified scaffolding inspector verify green tag compliance and tighten base jacks."
                )
            ],
            "observation_breakdown": ObservationBreakdown(
                observed=[
                    "Uncapped exposed rebar dowels along pedestrian path",
                    "Formwork timber scrap with protruding nails on walkway",
                    "PPE vests and hardhats worn by 8 out of 9 visible workers"
                ],
                likely=[
                    "Slip hazard near cement mixing slurry runoff",
                    "Scaffolding inspection tag missing on east bay"
                ],
                cannot_determine=[
                    "Air quality or silica dust concentration levels",
                    "Fire extinguisher inspection validity in staging shed"
                ]
            ),
            "recommended_actions": [
                "Install protective orange rebar caps on all column starter bars",
                "Execute 30-minute 5S housekeeping drive along all walkways",
                "Inspect and sign off scaffolding green tags before afternoon shift"
            ],
            "ppe_compliance_rate": "89%"
        }
    ]
    chosen_data = random.choice(scenarios)
    return SafetyAnalysisResult(**chosen_data, timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
