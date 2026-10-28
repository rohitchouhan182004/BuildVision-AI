from datetime import datetime
from app.schemas.crack import CrackAnalysisResult

def generate_mock_crack_analysis(context: str = "") -> CrackAnalysisResult:
    return CrackAnalysisResult(
        crack_detected=True,
        severity="MEDIUM",
        type="Diagonal Shear / Differential Settlement Crack in Reinforced Concrete Wall",
        location="Mid-height spanning diagonally across concrete panel near corner opening",
        estimated_width="Approx 1.5mm - 2.8mm (Visual estimate without calibrated scale; measurement subject to distortion)",
        length_estimate="Approx 60cm - 80cm visible trace",
        possible_causes=[
            "Localized foundation subgrade settlement or poor compaction beneath footing",
            "Thermal expansion / contraction stresses combined with drying shrinkage",
            "High shear concentration around unreinforced masonry/concrete corner cutouts",
            "Excessive curing moisture loss during early hydration period"
        ],
        recommendation="Install dual-axis optical tell-tale crack monitoring gauges to record movement over a 30-day period. Do not cover or plaster over crack. Arrange non-destructive UPV (ultrasonic pulse velocity) testing or core extraction under guidance of a licensed structural engineer.",
        inspection_required=True,
        urgency="Elevated - Professional structural engineering inspection recommended within 48 to 72 hours",
        disclaimer="Visual indication only. Professional structural inspection is recommended. Photographic analysis cannot determine subsurface rebar corrosion or load-bearing integrity.",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )

