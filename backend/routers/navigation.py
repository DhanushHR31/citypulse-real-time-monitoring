from fastapi import APIRouter, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from database import get_db
from datetime import datetime
import models, urllib.request, json

from services import navigation
from services.email_service import send_ride_start_email, send_hazard_alert_email

router = APIRouter(prefix="/navigation", tags=["navigation"])


# ── Pydantic models ──────────────────────────────────────────────
class RouteRequest(BaseModel):
    origin: str
    destination: str

class HazardDetail(BaseModel):
    title: str
    sev: str

class StartRideRequest(BaseModel):
    email: str
    origin: str
    destination: str
    distance_km: float
    duration_min: int
    safety_score: int
    route_label: Optional[str] = "Safest Route"
    hazards: List[HazardDetail] = []
    lat_origin: Optional[float] = None
    lng_origin: Optional[float] = None
    lat_dest: Optional[float] = None
    lng_dest: Optional[float] = None

class HazardAlertRequest(BaseModel):
    email: str
    hazard_title: str
    hazard_sev: str
    destination: str


# ── Weather helper (wttr.in — no API key needed) ─────────────────
def _get_bengaluru_weather() -> dict:
    try:
        url = "https://wttr.in/Bengaluru?format=j1"
        req = urllib.request.Request(url, headers={"User-Agent": "CityPulse/1.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())
        cc   = data["current_condition"][0]
        desc = cc["weatherDesc"][0]["value"]
        # Pick weather icon based on description
        icon_map = {
            "Sunny": "☀️", "Clear": "🌙", "Partly": "⛅", "Cloudy": "☁️",
            "Overcast": "☁️", "Mist": "🌫️", "Fog": "🌫️", "Rain": "🌧️",
            "Drizzle": "🌦️", "Thunder": "⛈️", "Snow": "❄️", "Blizzard": "🌨️",
        }
        icon = next((v for k, v in icon_map.items() if k.lower() in desc.lower()), "🌤️")
        return {
            "temp_c": cc.get("temp_C", "--"),
            "feels_like_c": cc.get("FeelsLikeC", "--"),
            "humidity": cc.get("humidity", "--"),
            "wind_kmph": cc.get("windspeedKmph", "--"),
            "desc": desc,
            "icon": icon,
        }
    except Exception as e:
        print(f"[WEATHER] Failed to fetch: {e}")
        return {}


# ── Endpoints ────────────────────────────────────────────────────
@router.post("/route")
def calculate_route_proxy(request: RouteRequest):
    result = navigation.get_rapid_route(request.origin, request.destination)
    return result


@router.post("/start-ride")
async def start_ride(req: StartRideRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Called when user taps 'Start Ride'.
    1. Fetches live weather for Bengaluru
    2. Sends rich email (route + incidents + weather)
    3. Stores ride session to Firebase
    """
    # Fetch weather synchronously (fast, 5s timeout)
    weather = _get_bengaluru_weather()

    route_info = {
        "origin":       req.origin,
        "destination":  req.destination,
        "distance_km":  round(req.distance_km, 1),
        "duration_min": req.duration_min,
        "safety_score": req.safety_score,
        "route_label":  req.route_label,
        "hazards":      [h.dict() for h in req.hazards],
        "weather":      weather,
    }

    # Email in background (non-blocking)
    background_tasks.add_task(send_ride_start_email, req.email, route_info)

    # Log locally instead of Firebase
    print(f"📍 [NAV SESSION] User {req.email} started ride to {req.destination}")

    return {
        "status":  "ok",
        "message": f"Ride started. Email sent to {req.email}",
        "weather": weather,
    }


@router.post("/hazard-alert")
async def hazard_alert(req: HazardAlertRequest, background_tasks: BackgroundTasks):
    """Sends an immediate hazard email when an incident is detected during a live ride."""
    hazard_info = {"title": req.hazard_title, "sev": req.hazard_sev}
    route_info  = {"destination": req.destination}
    background_tasks.add_task(send_hazard_alert_email, req.email, hazard_info, route_info)
    return {"status": "ok", "message": f"Hazard alert email queued for {req.email}"}
