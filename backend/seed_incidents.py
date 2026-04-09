import models
from database import SessionLocal, engine
from datetime import datetime, timedelta
import random

def seed_data():
    db = SessionLocal()
    models.Base.metadata.create_all(bind=engine)

    # 1. Create a Default Admin and Test User if missing
    admin = db.query(models.User).filter(models.User.email == "admin@citypulse.com").first()
    if not admin:
        admin = models.User(name="Admin Commissioner", email="admin@citypulse.com", role="admin", phone="+91 9988776655")
        db.add(admin)

    # 2. Add high-fidelity events in Bengaluru (using Event model)
    locations = [
        {"name": "M.G. Road", "lat": 12.9738, "lon": 77.6119},
        {"name": "Indiranagar", "lat": 12.9719, "lon": 77.6412},
        {"name": "Koramangala", "lat": 12.9279, "lon": 77.6271},
        {"name": "Jayanagar", "lat": 12.9250, "lon": 77.5938},
        {"name": "Majestic", "lat": 12.9767, "lon": 77.5713},
        {"name": "Silk Board Junction", "lat": 12.9176, "lon": 77.6247},
        {"name": "Whitefield", "lat": 12.9698, "lon": 77.7500},
        {"name": "Bannerghatta Road", "lat": 12.8950, "lon": 77.5980}
    ]

    event_types = ["Heavy Traffic", "Extreme Flooding", "Construction", "Accident", "Utility Outage", "Protest"]
    severities = ["low", "medium", "high", "critical"]
    symbols = ["🚗", "🌊", "🚧", "🚑", "⚡", "📢"]

    print("🌱 Generating 50 Dynamic Urban Incidents...")
    for _ in range(50):
        loc = random.choice(locations)
        idx = random.randint(0, len(event_types)-1)
        sev = random.choice(severities)
        
        evt = models.Event(
            title=f"{event_types[idx]} at {loc['name']}",
            description=f"Automated sensor detection: {event_types[idx]} in progress. Emergency services notified.",
            event_type=event_types[idx],
            severity=sev,
            latitude=loc['lat'] + (random.uniform(-0.02, 0.02)),
            longitude=loc['lon'] + (random.uniform(-0.02, 0.02)),
            location_name=loc['name'],
            source="Citizen Report" if random.random() > 0.5 else "AI Sensor",
            map_symbol=symbols[idx],
            confidence_score=random.uniform(0.7, 0.99),
            crowd_density="High" if sev == "critical" else "Medium",
            timestamp=datetime.utcnow() - timedelta(minutes=random.randint(5, 500))
        )
        db.add(evt)

    db.commit()
    db.close()
    print("✅ DATABASE SEEDED! Your Admin Dashboard is now LIVE with data.")

if __name__ == "__main__":
    seed_data()
