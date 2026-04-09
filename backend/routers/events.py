from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas
from database import get_db
import shutil
import os
import uuid
from services.gemini import analyze_event_text
from services.firebase_service import push_incident_to_firebase
import json

router = APIRouter(
    prefix="/events",
    tags=["events"],
    responses={404: {"description": "Not found"}},
)

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/", response_model=schemas.Event)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    db_event = models.Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.post("/report-with-ai", response_model=schemas.Event)
async def report_with_ai(
    description: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    location_name: str = Form("Select Location"),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # 1. Handle File Upload (Image/Video)
    media_url = None
    if file:
        file_ext = os.path.splitext(file.filename)[1]
        file_name = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, file_name)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        media_url = f"/api/uploads/{file_name}"

    # 2. Call Gemini for Analysis
    # Gemini extracted: severity, event_type, map_symbol, summary, impact_analysis
    analysis = analyze_event_text(description)

    # 3. Create Event
    db_event = models.Event(
        title=analysis.get("summary", "User Report"),
        description=description,
        event_type=analysis.get("event_type", "Other"),
        severity=analysis.get("severity", "Medium"),
        latitude=latitude,
        longitude=longitude,
        location_name=location_name,
        source="Citizen Report",
        map_symbol=analysis.get("map_symbol", "📍"),
        media_url=media_url,
        ai_summary=json.dumps(analysis),
        impact_analysis=analysis.get("impact_analysis", "No significant impact.")
    )
    
    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    # Sync to Firebase cloud storage
    firebase_payload = {
        "id": db_event.id,
        "title": db_event.title,
        "event_type": db_event.event_type,
        "severity": db_event.severity,
        "latitude": db_event.latitude,
        "longitude": db_event.longitude,
        "location_name": db_event.location_name,
        "description": db_event.description,
        "source": db_event.source,
        "map_symbol": db_event.map_symbol,
        "media_url": db_event.media_url,
        "timestamp": db_event.timestamp.isoformat() if db_event.timestamp else None,
    }
    push_incident_to_firebase(firebase_payload)

    return db_event

@router.get("/", response_model=List[schemas.Event])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    events = db.query(models.Event).offset(skip).limit(limit).all()
    return events

@router.get("/{event_id}", response_model=schemas.Event)
def read_event(event_id: int, db: Session = Depends(get_db)):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event
