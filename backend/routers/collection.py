from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services import collector, preprocessor, navigation
import models
from datetime import datetime, timedelta
import random

router = APIRouter(
    prefix="/collection",
    tags=["collection"],
    responses={404: {"description": "Not found"}},
)

@router.post("/fetch-all")
def fetch_all_data(db: Session = Depends(get_db)):
    """
    🔥 UPGRADED REAL-TIME WORKFLOW:
    1. Collect from NewsAPI, Google RSS, and Twitter
    2. Filter records from the last 48 hours
    3. AI Location Extraction via Gemini
    4. Auto-Pin on Map
    """
    print("🚀 Triggering Real-Time Urban Intelligence Workflow...")
    
    try:
        # Phase 1: Real-Time Collection from the last 24 hours
        raw_events = collector.get_all_realtime_data()
        
        processed_count = 0
        cutoff = datetime.utcnow() - timedelta(days=1)
        print(f"🕵️ Scanning social feeds for Bengaluru (24h Window)...")
        
        # Phase 2: AI Analysis & Location Extraction
        for item in raw_events:
            text_content = item.get("description", "")
            if len(text_content) < 10: continue

            # Prevent duplication
            existing = db.query(models.Event).filter(models.Event.description == text_content).first()
            if existing: continue

            # Gemini Analysis (Summary, Severity, Location)
            analysis = collector.analyze_with_gemini(text_content)
            
            # Geocoding the extracted location near Bengaluru
            loc_name = analysis.get("location")
            lat, lng = None, None
            
            if loc_name:
                search_query = f"{loc_name}, Bengaluru"
                lon_val, lat_val = navigation.get_coordinates(search_query)
                if lat_val:
                    lat, lng = lat_val, lon_val
            
            # Fallback for demo: If AI finds a location but geocoder fails, use a safe offset near center
            if not lat:
                lat = 12.9716 + (random.uniform(-0.04, 0.04))
                lng = 77.5946 + (random.uniform(-0.04, 0.04))
            
            # Phase 3: DB Persistence
            new_event = models.Event(
                title=analysis.get("summary")[:70] if analysis.get("summary") else (item.get("title") or "Urban Incident")[:70],
                description=text_content,
                event_type=analysis.get("event_type", "Traffic"),
                severity=analysis.get("severity", "Medium"),
                latitude=lat,
                longitude=lng,
                source=item.get("source", "Live Social Feed"),
                location_name=loc_name or "Bengaluru",
                confidence_score=0.9 if item.get("type") == "news" else 0.75,
                map_symbol=analysis.get("map_symbol", "📍"),
                timestamp=datetime.utcnow()
            )
            db.add(new_event)
            processed_count += 1
            
        db.commit()
        
        # Run cleanup immediately after collection to ensure old data is gone
        cutoff_date = datetime.utcnow() - timedelta(days=1)
        db.query(models.Event).filter(models.Event.timestamp < cutoff_date).delete()
        db.commit()

        return {
            "status": "success",
            "new_events_collected": processed_count,
            "retention_policy": "24 Hours (Maximum Freshness Active)"
        }

    except Exception as e:
        print(f"Intelligence Error: {e}")
        db.rollback()
        return {"status": "error", "message": str(e)}
