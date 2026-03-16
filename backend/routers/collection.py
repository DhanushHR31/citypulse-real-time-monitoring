from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..services import collector, preprocessor, navigation
from .. import models
from datetime import datetime
import random

router = APIRouter(
    prefix="/collection",
    tags=["collection"],
    responses={404: {"description": "Not found"}},
)

# ... (keep news/social triggers same)

@router.post("/fetch-all")
def fetch_all_data(db: Session = Depends(get_db)):
    """
    Triggers full Social Media Workflow:
    1. Collection
    2. Preprocessing (Clean/Dedup)
    3. AI Analysis (Gemini)
    4. Location Extraction & Geo-Filtering
    5. DB Storage
    """
    print("Executing Social Media Workflow...")
    
    try:
        # Phase 1: Collection
        news_items = collector.fetch_google_news("Bengaluru traffic accident")
        tweets = collector.fetch_twitter_data("Bengaluru Traffic")
        insta_posts = collector.fetch_instagram_data("BengaluruTraffic")
        
        raw_events = news_items + tweets + insta_posts
        
        # Phase 2: Preprocessing
        # Clean text
        for item in raw_events:
            text = item.get("description") or item.get("text") or item.get("caption") or ""
            item["clean_text"] = preprocessor.clean_text(text)
            
        # Deduplicate
        unique_events = preprocessor.remove_duplicates(raw_events)
        
        processed_events = []
        
        # Phase 4: AI Analysis
        for item in unique_events:
            text_content = item.get("clean_text", "")
            if len(text_content) < 5: continue

            # Gemini Analysis
            analysis = collector.analyze_with_gemini(text_content)
            
            # Phase 3: Location Extraction & Geo-Filtering
            lat, lng = item.get("lat"), item.get("lng")
            
            # If no coords, try to geocode the AI-extracted location
            if not lat and analysis.get("location"):
                # Append "Bengaluru" to context to improve accuracy
                search_query = f"{analysis['location']}, Bengaluru"
                lon_val, lat_val = navigation.get_coordinates(search_query)
                if lat_val:
                    lat, lng = lat_val, lon_val
            
            # If still no coords, skip (or use mock for demo durability)
            if not lat:
                # For demo purposes, we fallback to random BLR location 
                # so the user sees *something* on the map for "General" alerts
                lat = 12.9716 + (random.uniform(-0.05, 0.05))
                lng = 77.5946 + (random.uniform(-0.05, 0.05))
            
            # Filter by Radius (25km)
            # We construct a temp object to check distance
            temp_event = {"lat": lat, "lng": lng}
            if not preprocessor.filter_by_location([temp_event], radius_km=25):
                print(f"Skipping event outside radius: {analysis.get('location')}")
                continue

            # DB Check
            existing = db.query(models.Event).filter(models.Event.description == text_content).first()
            if existing: continue

            # Calculate Confidence Score (Phase 5)
            c_score = 0.5 # Default Social
            src_lower = item.get("source", "").lower()
            txt_lower = text_content.lower()
            
            if "google news" in src_lower or "news" in src_lower:
                c_score = 0.8
            elif "police" in src_lower or "police" in txt_lower or "bbmp" in txt_lower:
                c_score = 0.95 # High trust for Govt/Official
            elif "verified" in item.get("user", "").lower():
                c_score = 0.7
            
            # Save
            new_event = models.Event(
                title=item.get("title") or analysis.get("summary")[:50] or "Event",
                description=text_content,
                event_type=analysis.get("event_type", "General"),
                severity=analysis.get("severity", "Low"),
                latitude=lat,
                longitude=lng,
                source=item.get("source", "Unknown"),
                location_name=analysis.get("location"),
                confidence_score=c_score,
                crowd_density=analysis.get("crowd_density", "Not Determined"),
                impact_analysis=analysis.get("impact_analysis", "No Data"),
                map_symbol=analysis.get("map_symbol", "📍"),
                timestamp=datetime.utcnow()
            )
            db.add(new_event)
            
            item["severity"] = new_event.severity
            item["event_type"] = new_event.event_type
            item["lat"] = new_event.latitude
            item["lng"] = new_event.longitude
            item["confidence"] = c_score
            processed_events.append(item)
            
        db.commit()
        
        return {
            "status": "success",
            "count": len(processed_events),
            "data": {
                "news": [e for e in processed_events if e.get('source') == 'Google News'],
                "social": [e for e in processed_events if e.get('source') != 'Google News']
            }
        }

    except Exception as e:
        print(f"Workflow Error: {e}")
        db.rollback()
        return {
            "status": "partial_error",
            "error": str(e),
            "data": { "news": [], "social": [] }
        }
