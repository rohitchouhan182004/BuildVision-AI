from datetime import datetime
from app.schemas.image_analysis import ImageAnalysisResult
from app.schemas.safety import ObservationBreakdown

def generate_mock_image_analysis(context: str = "") -> ImageAnalysisResult:
    return ImageAnalysisResult(
        scene_description="Active reinforced concrete (RCC) construction site during superstructure phase. A tower crane is partially visible swinging a concrete bucket toward the upper floor slab formwork. Workers are actively preparing rebar mats and installing electrical conduit conduits prior to inspection.",
        detected_objects=[
            "Tower crane boom",
            "Reinforced concrete columns",
            "Timber and steel shuttering plates",
            "Rebar mesh / tie wire",
            "PVC electrical conduits",
            "5 construction workers",
            "Concrete vibration poker",
            "Safety barricade tape"
        ],
        construction_stage="Superstructure / Slab Reinforcement & Pre-Pour Staging",
        visible_materials=[
            "Fe500D Grade TMT Reinforcement Steel",
            "Film-faced shuttering plywood & steel walers",
            "Heavy-duty adjustable steel prop props (Acro jacks)",
            "Rigid PVC electrical conduits and junction boxes",
            "Concrete spacer cover blocks (40mm)"
        ],
        equipment=[
            "Top-slewing tower crane",
            "High-frequency needle concrete vibrator",
            "Bar bending and cutting machine in staging yard",
            "Mobile diesel generator unit"
        ],
        workers_count_est="5 visible personnel (3 bar-benders, 1 electrician, 1 site foreman)",
        potential_issues=[
            "Congested rebar layout near beam-column node may impede aggregate flow during concrete pour",
            "Insufficient concrete spacer blocks visible along south slab overhang",
            "Minor debris and sawdust within formwork corners prior to air blow-down"
        ],
        recommendations=[
            "Conduct pre-pour slump test (target 120mm-150mm for pumped concrete) to avoid honeycombing",
            "Ensure minimum 40mm clear cover under all bottom bars using certified concrete cover blocks",
            "Use compressed air or industrial vacuum to flush out all binding wire clippings and sawdust from formwork base before pouring"
        ],
        confidence="High visual certainty (88%) on construction phase and materials; moderate on subsurface formwork anchoring.",
        observation_breakdown=ObservationBreakdown(
            observed=[
                "Fe500D TMT reinforcement cage aligned over floor deck",
                "Tower crane hoist positioned above east slab bay",
                "Formwork propping spaced at approximately 1.0m grid intervals"
            ],
            likely=[
                "Pour scheduled within next 12 to 24 hours based on conduit completion",
                "High ambient heat requiring retarding chemical admixtures"
            ],
            cannot_determine=[
                "Compressive design strength of the concrete mix (e.g. M30 vs M35)",
                "Exact rebar lap length dimensions without high-resolution scale reference"
            ]
        ),
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )

