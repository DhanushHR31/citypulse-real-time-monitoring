from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    # Define simple preferences as a stored string for now (or JSON if needed)
    preferences = Column(String, nullable=True) 

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    event_type = Column(String)  # e.g., "Traffic", "Accident", "Fire"
    severity = Column(String)    # e.g., "Low", "Medium", "High", "Critical"
    latitude = Column(Float)
    longitude = Column(Float)
    source = Column(String)      # e.g., "News", "Twitter", "User"
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Store the location name explicitly if needed
    location_name = Column(String, nullable=True)
    
    # Phase 5: Event Validation
    confidence_score = Column(Float, default=0.5) # 0.0 to 1.0

    # Phase 6b: Enhanced AI Fields
    crowd_density = Column(String, default="Not Determined") # Low, Medium, High
    impact_analysis = Column(Text, default="No significant route impact.") # Route impact details
    map_symbol = Column(String, nullable=True) # e.g., 🚗💥

class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    origin_lat = Column(Float)
    origin_lng = Column(Float)
    dest_lat = Column(Float)
    dest_lng = Column(Float)
    safe_route_json = Column(Text) # Store the JSON of the route path
    created_at = Column(DateTime, default=datetime.utcnow)

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String)
    predicted_severity = Column(String)
    predicted_time = Column(DateTime)
    confidence_score = Column(Float)
