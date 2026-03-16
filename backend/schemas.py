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

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True

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
        orm_mode = True

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
