from app.schemas.knowledge import KnowledgeQuery, KnowledgeResult

def answer_mock_knowledge(req: KnowledgeQuery) -> KnowledgeResult:
    q = req.query.lower()
    
    if "concrete" in q and ("crack" in q or "cure" in q or "pour" in q or "strength" in q):
        return KnowledgeResult(
            question=req.query,
            category="Concrete Technology & Quality",
            answer="Concrete curing is the process of maintaining satisfactory moisture content and temperature during its early stages (typically minimum 7 to 14 days) so that hydration of cement can proceed and design compressive strength and durability develop without plastic shrinkage or thermal cracking.",
            key_points=[
                "Hydration reaction requires continuous ambient relative humidity above 80% at the surface",
                "Compressive strength gains approx 65-70% by day 7 and achieves design target (e.g. M25/M30) by day 28",
                "Improper curing can diminish final compressive strength by up to 35% and drastically escalate surface permeability",
                "Water-cement (w/c) ratio should be strictly controlled (typically 0.40 - 0.45 for reinforced concrete)"
            ],
            recommended_practice="For slabs, use continuous ponding with small mud bunds or saturated wet hessian cloth covered with 100-micron polyethylene sheeting. For vertical columns and shear walls, wrap with wet burlap or spray certified membrane-forming curing compounds immediately upon formwork striking.",
            safety_note="Wear alkali-resistant nitrile gloves and eye goggles when handling wet cement mixes. Wet concrete has a pH around 12-13 and can cause severe chemical skin burns and dermatitis.",
            standard_references=["IS 456:2000 (Plain and Reinforced Concrete - Code of Practice)", "ACI 308R (Guide to External Curing of Concrete)", "ASTM C309"],
            disclaimer="General engineering guidance only. Field implementation must follow project structural drawings and local building codes."
        )
    elif "scaffold" in q or "fall" in q or "height" in q:
        return KnowledgeResult(
            question=req.query,
            category="Site Safety & Fall Protection",
            answer="Working at height (generally any work above 1.8 meters / 6 feet in construction) represents the leading cause of fatal construction injuries globally. Scaffolding must be erected by competent riggers, adequately braced, anchored, and inspected prior to each work shift.",
            key_points=[
                "Standard guardrail systems require a top rail at 42 inches (±3 inches), a mid rail at 21 inches, and a 4-inch toe-board",
                "Full body harnesses (EN 361 / ANSI Z359) with dual shock-absorbing lanyards are mandatory for work near open perimeters",
                "Scaffold base plates and sole boards are required on soil or compacted gravel to prevent differential settlement",
                "Scaffold tags (Green = Safe to use, Yellow = Specific restrictions, Red = Do Not Use) must be prominently displayed at ladders"
            ],
            recommended_practice="Implement a mandatory '100% Tie-Off' policy above 2 meters. Inspect wire ropes, lifelines, and scaffolding couplers weekly. Never overload scaffolding decks beyond their designated duty rating (Light: 1.5 kN/m², Medium: 2.0 kN/m², Heavy: 3.0 kN/m²).",
            safety_note="Do not erect, alter, or dismantle scaffolding in sustained winds exceeding 38 km/h or during thunderstorms. Always inspect for overhead electrical lines (maintain minimum 3-meter clearance).",
            standard_references=["OSHA 1926 Subpart L (Scaffolds)", "IS 4014 (Code of Practice for Steel Tubular Scaffolding)", "EN 12811"],
            disclaimer="General engineering guidance only. Field implementation must follow project structural drawings and local building codes."
        )
    elif "rebar" in q or "steel" in q or "cover" in q:
        return KnowledgeResult(
            question=req.query,
            category="Reinforcement & Structural Detailing",
            answer="Reinforcing steel (TMT - Thermo-Mechanically Treated bars) provides tensile resistance to complement concrete's compressive strength. Maintaining the specified concrete cover is vital to shield reinforcement from atmospheric carbonation, chloride ingress, and fire exposure.",
            key_points=[
                "Minimum nominal cover as per IS 456: Footings = 50mm, Columns = 40mm, Beams = 25mm, Slabs = 20mm (adjusted for severe coastal exposure)",
                "Cover blocks must possess equivalent or superior compressive strength compared to the surrounding concrete mix (avoid wooden/debris wedges)",
                "Lap lengths for tension bars must strictly adhere to design specs (typically 40d to 50d where d is bar diameter)",
                "Binding wire clippings must be tucked away from concrete faces to prevent rust stains and moisture capillary paths"
            ],
            recommended_practice="Use factory-made high-density concrete cover blocks with embedded tie wires spaced at 1-meter staggered intervals. Check column cages for plumb and spiral tie pitch before shutter closing.",
            safety_note="Exposed protruding vertical dowels must be fitted with certified mushroom-style rebar safety caps or heavy timber troughs to eliminate fatal impalement hazards.",
            standard_references=["IS 1786 (High Strength Deformed Steel Bars)", "IS 13920 (Ductile Detailing of Reinforced Concrete Structures)", "ACI 318"],
            disclaimer="General engineering guidance only. Field implementation must follow project structural drawings and local building codes."
        )
    else:
        return KnowledgeResult(
            question=req.query,
            category="General Construction Engineering",
            answer=f"Regarding '{req.query}': In professional construction management, adherence to quality control checklists, safe work method statements (SWMS), and calibrated material testing forms the bedrock of engineering integrity. Execution must always follow certified Good-For-Construction (GFC) engineering drawings.",
            key_points=[
                "Perform standard pre-pour and post-pour inspection checklists signed by Quality Assurance (QA) engineers",
                "Ensure statutory material mill test certificates (MTC) are filed for every consignment of cement, steel, and admixtures",
                "Verify calibration certificates for batching plants, digital weighbridges, and cube crushing testing machines (CTM)",
                "Document daily ambient weather, pouring start/finish timestamps, and slump test results in the official site register"
            ],
            recommended_practice="Maintain a rigorous 3-tier inspection protocol: Subcontractor Foreman -> Site Quality Engineer -> Client/Third-Party Inspector sign-off before releasing holds.",
            safety_note="Ensure all site personnel hold valid safety inductions, and daily Tool Box Talks (TBT) address task-specific hazards before commencing work.",
            standard_references=["National Building Code (NBC) 2016", "IS Codes of Practice", "OSHA Safety Guidelines"],
            disclaimer="General engineering guidance only. Field implementation must follow project structural drawings and local building codes."
        )

