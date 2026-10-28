from typing import List, Optional
from pydantic import BaseModel

class ValuationRequest(BaseModel):
    property_type: str = "Residential Apartment"
    location: str = "Vijay Nagar, Indore"
    area_sqft: float = 1450.0
    number_of_floors: int = 4
    number_of_rooms: int = 3
    age_years: float = 2.0
    construction_quality: str = "Premium RCC"
    amenities: List[str] = ["Lift", "Power Backup", "Covered Parking", "Security"]
    nearby_facilities: List[str] = ["Metro Station", "Hospital", "School", "Supermarket"]
    current_condition: str = "Excellent"
    additional_notes: Optional[str] = "South-facing, marble flooring, high-grade fittings"

class ValuationResult(BaseModel):
    estimated_value_min: float
    estimated_value_max: float
    estimated_value_median: float
    currency: str = "INR (₹)"
    price_per_sqft_range: str
    key_factors: List[str] = []
    positive_factors: List[str] = []
    negative_factors: List[str] = []
    confidence: str
    explanation: str
    disclaimer: str = "Visual and parametric indication only. AI valuation is not a certified appraiser's guarantee or bank-certified mortgage appraisal."

