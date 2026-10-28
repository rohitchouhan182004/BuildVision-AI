from app.schemas.valuation import ValuationRequest, ValuationResult

def generate_mock_valuation(req: ValuationRequest) -> ValuationResult:
    # Parametric base rates based on Indian metropolitan/tier-2 construction & realty indices
    base_rate_per_sqft = 6500.0
    
    # Location adjustments
    loc_lower = req.location.lower()
    if "pune" in loc_lower or "mumbai" in loc_lower:
        base_rate_per_sqft = 9200.0
    elif "bhopal" in loc_lower:
        base_rate_per_sqft = 5200.0
    elif "indore" in loc_lower:
        base_rate_per_sqft = 6200.0
    elif "delhi" in loc_lower or "bangalore" in loc_lower:
        base_rate_per_sqft = 10500.0
        
    # Quality multiplier
    qual_mult = 1.0
    if "premium" in req.construction_quality.lower() or "luxury" in req.construction_quality.lower():
        qual_mult = 1.25
    elif "economy" in req.construction_quality.lower() or "standard" in req.construction_quality.lower():
        qual_mult = 0.90
        
    # Age depreciation (approx 1.5% per year)
    depreciation = max(0.60, 1.0 - (req.age_years * 0.015))
    
    # Amenities premium
    amenity_bonus = 1.0 + (len(req.amenities) * 0.02)
    
    effective_rate = base_rate_per_sqft * qual_mult * depreciation * amenity_bonus
    min_rate = round(effective_rate * 0.90, -2)
    max_rate = round(effective_rate * 1.15, -2)
    median_rate = round(effective_rate, -2)
    
    est_min = round((min_rate * req.area_sqft) / 100000.0, 2) * 100000
    est_max = round((max_rate * req.area_sqft) / 100000.0, 2) * 100000
    est_median = round((median_rate * req.area_sqft) / 100000.0, 2) * 100000
    
    # Formatting Indian currency string (Crores/Lakhs)
    def fmt_inr(val):
        if val >= 10000000:
            return f"₹{val/10000000:.2f} Cr"
        return f"₹{val/100000:.2f} Lakh"

    return ValuationResult(
        estimated_value_min=est_min,
        estimated_value_max=est_max,
        estimated_value_median=est_median,
        currency="INR (₹)",
        price_per_sqft_range=f"₹{int(min_rate):,} - ₹{int(max_rate):,} per sq.ft",
        key_factors=[
            f"Super built-up area of {req.area_sqft:,.0f} sq.ft with {req.number_of_rooms} bedrooms on floor {req.number_of_floors}",
            f"Parametric locality baseline for '{req.location}'",
            f"Building age index: {req.age_years} years ({depreciation*100:.1f}% remaining structural asset index)",
            f"Structural construction classification: {req.construction_quality}"
        ],
        positive_factors=[
            f"Proximity to high-value infrastructure ({', '.join(req.nearby_facilities[:3]) if req.nearby_facilities else 'developed arterial transit'})",
            f"Modern amenity bundle: {', '.join(req.amenities[:4]) if req.amenities else 'Standard utilities'}",
            f"Maintained physical condition assessed as '{req.current_condition}'"
        ],
        negative_factors=[
            f"Market liquidity exposure in broader {req.location} submarket",
            "Property transfer stamp duty and registration friction (typically 6-8%)",
            "Potential variation between carpet area and super-built-up area definitions"
        ],
        confidence="Moderate (Indicative range: ±10% margin of visual and algorithmic estimation)",
        explanation=(
            f"Based on comparable market trends and structural replacement metrics in {req.location}, "
            f"the asset is estimated in the valuation band of {fmt_inr(est_min)} to {fmt_inr(est_max)} "
            f"(midpoint approx {fmt_inr(est_median)}). The premium construction quality and presence of "
            f"amenities like {', '.join(req.amenities[:3])} provide solid downside protection."
        ),
        disclaimer="Visual and parametric indication only. AI valuation is not a certified appraiser's guarantee or bank-certified mortgage appraisal. Physical structural audit and title-deed legal verification by a qualified advocate are required before financial transactions."
    )

