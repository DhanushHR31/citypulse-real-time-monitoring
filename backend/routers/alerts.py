from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db

router = APIRouter(
    prefix="/alerts",
    tags=["alerts"],
)

@router.get("/", response_model=List[schemas.SafetyAlert])
def read_alerts(db: Session = Depends(get_db)):
    alerts = db.query(models.SafetyAlert).order_by(models.SafetyAlert.timestamp.desc()).limit(20).all()
    # If no alerts in DB, return some default ones (seeding)
    if not alerts:
        return [
            {
                "id": 1,
                "title": "Flash Flood Warning",
                "severity": "critical",
                "message": "Heavy rain expected in East Bengaluru. Avoid Bellandur Lake area.",
                "timestamp": "2026-04-10T12:00:00"
            }
        ]
    return alerts

@router.post("/", response_model=schemas.SafetyAlert)
def create_alert(alert: schemas.SafetyAlertCreate, db: Session = Depends(get_db)):
    db_alert = models.SafetyAlert(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert
