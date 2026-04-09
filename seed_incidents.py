import random
import datetime
import requests
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# 36 Event Types Meta
EVENT_CATEGORIES = {
    "Emergency": ["Road Accident", "Fire Accident", "Building Collapse", "Gas Leak", "Medical Emergency", "Explosion", "Landslide", "Electrocution"],
    "Traffic": ["Traffic Congestion", "Road Block", "Flyover Closure", "Metro Delay", "Signal Failure", "Vehicle Breakdown"],
    "Weather": ["Heavy Rain", "Flooding", "Waterlogging", "Storm", "Heatwave", "Cyclone Alert"],
    "Civic": ["Water Shortage", "Power Cut", "Road Repair", "Drainage Overflow", "BBMP Maintenance", "Garbage Strike"],
    "Public": ["Festival", "Religious Gathering", "Political Rally", "Protest", "Marathon", "Concert"],
    "Crowd": ["High Crowd Density", "Stampede Risk", "Overcrowded Mall", "Queue Congestion"]
}

EVENT_ICONS = {
    "Road Accident": "🚗💥", "Fire Accident": "🔥", "Building Collapse": "🏚️", "Gas Leak": "☣️", "Medical Emergency": "🚑", "Explosion": "💥", "Landslide": "🪨", "Electrocution": "⚡",
    "Traffic Congestion": "🚦", "Road Block": "⛔", "Flyover Closure": "🌉", "Metro Delay": "🚇", "Signal Failure": "🚥", "Vehicle Breakdown": "🚘",
    "Heavy Rain": "🌧️", "Flooding": "🌊", "Waterlogging": "💧", "Storm": "⛈️", "Heatwave": "🌡️", "Cyclone Alert": "🌀",
    "Water Shortage": "🚱", "Power Cut": "🔌", "Road Repair": "🛠️", "Drainage Overflow": "🚽", "BBMP Maintenance": "🏗️", "Garbage Strike": "🗑️",
    "Festival": "🎉", "Religious Gathering": "🛕", "Political Rally": "📢", "Protest": "✊", "Marathon": "🏃", "Concert": "🎶",
    "High Crowd Density": "👥", "Stampede Risk": "⚠️", "Overcrowded Mall": "🏬", "Queue Congestion": "🧍"
}

BENGALURU_LOCATIONS = [
    "MG Road", "Brigade Road", "Shivajinagar", "Majestic", "Cubbon Park", "Indiranagar", "Koramangala", "HSR Layout",
    "BTM Layout", "Jayanagar", "JP Nagar", "Banashankari", "Malleshwaram", "Rajajinagar", "Vijayanagar", "Yeshwanthpur",
    "Hebbal", "Yelahanka", "Whitefield", "Marathahalli", "Bellandur", "Sarjapur Road", "Electronic City", "Silk Board",
    "EcoSpace", "Manyata Tech Park", "Peenya", "Kengeri", "Nagarbhavi", "Basavanagudi", "Frazer Town", "Kalyan Nagar"
]

def seed_data(count=250):
    db: Session = SessionLocal()
    
    # Clear existing if needed? No, let's just add to total.
    # db.query(models.Event).delete()
    
    print(f"Seeding {count} high-fidelity urban incidents...")
    
    for i in range(count):
        cat = random.choice(list(EVENT_CATEGORIES.keys()))
        e_type = random.choice(EVENT_CATEGORIES[cat])
        loc_name = random.choice(BENGALURU_LOCATIONS)
        
        # Random coords within Bengaluru spread (refined)
        lat = 12.85 + (random.random() * 0.18)
        lng = 77.45 + (random.random() * 0.25)
        
        sev = random.choice(["Critical", "High", "Medium", "Low"])
        if cat == "Emergency": sev = random.choice(["Critical", "High"])
        
        source = random.choice(["Google News", "Twitter", "Instagram", "Public Citizen", "BBMP Official", "Police Alert"])
        
        desc = f"Observed {e_type} at {loc_name}. "
        if cat == "Traffic": desc += "Heavy congestion reported. Use alternative routes."
        elif cat == "Weather": desc += "Severe impact on low-lying areas. Stay indoors."
        elif cat == "Emergency": desc += "Emergency services (Ambulance/Fire) are on site. Caution advised."
        else: desc += "Situation is being monitored by local authorities."

        new_event = models.Event(
            title=f"{e_type} in {loc_name}",
            description=desc,
            event_type=e_type,
            severity=sev,
            latitude=lat,
            longitude=lng,
            source=source,
            location_name=loc_name,
            confidence_score=random.uniform(0.6, 0.99),
            crowd_density=random.choice(["Low", "Medium", "High"]),
            impact_analysis=f"Significant disruption to {loc_name} commuters.",
            map_symbol=EVENT_ICONS.get(e_type, "📍"),
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(hours=random.randint(0, 48))
        )
        db.add(new_event)
        
    db.commit()
    print("Seeding complete! 250+ incidents now live.")
    db.close()

if __name__ == "__main__":
    seed_data(250)
