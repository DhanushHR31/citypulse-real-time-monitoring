from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    username = Column(String, unique=True, index=True, nullable=True)
    email = Column(String, unique=True, index=True)
    password = Column(String) # Hashed password
    role = Column(String, default="user") # admin or user
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=True)
    preferences = Column(String, nullable=True)

class IncidentReport(Base):
    __tablename__ = "incident_reports"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    event_type = Column(String)
    severity = Column(String)
    location_name = Column(String)
    description = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

class SafetyAlert(Base):
    __tablename__ = "safety_alerts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    severity = Column(String)
    message = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

class SocialMediaAlert(Base):
    __tablename__ = "social_alerts"
    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String)
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

class RoadConditionReport(Base):
    __tablename__ = "road_conditions"
    id = Column(Integer, primary_key=True, index=True)
    condition_type = Column(String)
    location = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class RouteAlert(Base):
    __tablename__ = "route_alerts"
    id = Column(Integer, primary_key=True, index=True)
    route_name = Column(String)
    issue = Column(String)

class TrendingTag(Base):
    __tablename__ = "trending_tags"
    id = Column(Integer, primary_key=True, index=True)
    tag_name = Column(String)
    mentions = Column(Integer)

class BangaloreCityAlert(Base):
    __tablename__ = "city_alerts"
    id = Column(Integer, primary_key=True, index=True)
    alert_text = Column(String)

class BangaloreTagMonitor(Base):
    __tablename__ = "tag_monitors"
    id = Column(Integer, primary_key=True, index=True)
    tag = Column(String)
    status = Column(String)

# Old legacy models to ensure nothing breaks in original backend
class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    event_type = Column(String)
    severity = Column(String) 
    latitude = Column(Float)
    longitude = Column(Float)
    source = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    location_name = Column(String, nullable=True)
    confidence_score = Column(Float, default=0.5)
    crowd_density = Column(String, default="Not Determined")
    impact_analysis = Column(Text, default="No significant route impact.")
    map_symbol = Column(String, nullable=True)

class Route(Base):
    __tablename__ = "routes"
    id = Column(Integer, primary_key=True, index=True)
    origin_lat = Column(Float)
    origin_lng = Column(Float)
    dest_lat = Column(Float)
    dest_lng = Column(Float)
    safe_route_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String)
    predicted_severity = Column(String)
    predicted_time = Column(DateTime)
    confidence_score = Column(Float)
