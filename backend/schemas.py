from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- Event Schemas ---
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    event_type: str
    severity: str
    latitude: float
    longitude: float
    source: str
    location_name: Optional[str] = None
    confidence_score: Optional[float] = 0.5
    crowd_density: Optional[str] = None
    impact_analysis: Optional[str] = None
    map_symbol: Optional[str] = "📍"
    media_url: Optional[str] = None
    ai_summary: Optional[str] = None

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str # In a real app, hash this!

class User(UserBase):
    id: int
    preferences: Optional[str] = None

    class Config:
        from_attributes = True

# --- Prediction Schemas ---
class PredictionBase(BaseModel):
    event_type: str
    predicted_severity: str
    predicted_time: datetime
    confidence_score: float

class PredictionCreate(PredictionBase):
    pass

class Prediction(PredictionBase):
    id: int

    class Config:
        orm_mode = True
