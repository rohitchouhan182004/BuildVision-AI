from typing import List, Optional
from pydantic import BaseModel

class WeatherCurrent(BaseModel):
    temperature_c: float
    condition: str
    humidity_percent: int
    wind_speed_kmh: float
    precipitation_probability: int
    uv_index: int

class WeatherDayForecast(BaseModel):
    date: str
    condition: str
    temp_high: float
    temp_low: float
    rain_chance: int
    wind_kmh: float

class WeatherAdvisoryRequest(BaseModel):
    location: str = "Indore, MP"
    days_ahead: int = 5

class WeatherAdvisoryResult(BaseModel):
    location: str
    weather_risk: str
    risk_summary: str
    current: WeatherCurrent
    forecast: List[WeatherDayForecast] = []
    concrete_work_advisory: str
    crane_elevated_work_advisory: str
    excavation_groundwork_advisory: str
    worker_safety_advisory: str
    actionable_recommendations: List[str] = []

