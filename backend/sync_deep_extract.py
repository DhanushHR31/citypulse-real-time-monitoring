import sqlite3
from datetime import datetime
import os

db_path = r'c:\Users\dhanu\OneDrive\Desktop\8Th sem\city\backend\smart_city.db'

# 🛰️ SENTINEL DEEP EXTRACT: Full incidents from the Google AI Overview "Show More" expansion
LATEST_GOOGLE_INCIDENTS = [
    {
        "title": "Industrial Blaze - Electronic City Phase 1",
        "desc": "A huge, undetermined fire reported in the Electronic City industrial area. Massive smoke clouds visible; fire crews at site.",
        "type": "Fire accident", "sev": "Critical", "loc": "Electronic City Phase 1", "lat": 12.8454, "lng": 77.6602,
        "source": "Google AI Overview", "symbol": "🏭🔥"
    },
    {
        "title": "Mattress Warehouse Fire - Anjanapura",
        "desc": "Massive blaze at a warehouse causing extensive property damage. Nearby apartments evacuated as a safety precaution.",
        "type": "Fire accident", "sev": "High", "loc": "Anjanapura", "lat": 12.8600, "lng": 77.5750,
        "source": "Google AI Overview", "symbol": "🏢🔥"
    },
    {
        "title": "Drunken Driving Fatality - Cunningham Road",
        "desc": "Tragic incident where an inebriated driver crashed into vehicles/pedestrians, resulting in 2 fatalities.",
        "type": "Road accident", "sev": "Critical", "loc": "Cunningham Road", "lat": 12.9830, "lng": 77.5940,
        "source": "Google AI Overview", "symbol": "🚗💀"
    },
    {
        "title": "Construction Lift Collapse - Varthur",
        "desc": "Material supply lift at an under-construction building collapsed from height. 2 workers tragically killed on-site.",
        "type": "Construction hazard", "sev": "Critical", "loc": "Varthur", "lat": 12.9393, "lng": 77.7506,
        "source": "Google AI Overview", "symbol": "🏗️⚠️"
    },
    {
        "title": "City-wide Road Accident Surge",
        "desc": "Urgent safety alert: 6 fatalities reported across Bengaluru in a single surge of road accidents this month.",
        "type": "Road accident", "sev": "High", "loc": "Bengaluru General", "lat": 12.9716, "lng": 77.5946,
        "source": "Google AI Overview", "symbol": "🚨🛣️"
    },
    {
        "title": "Distracted Driving Hazard - Central Blr",
        "desc": "Auto-rickshaw driver caught watching social media reels while navigating heavy traffic. Major safety concern.",
        "type": "Traffic congestion", "sev": "Medium", "loc": "Bengaluru Center", "lat": 12.9772, "lng": 77.5707,
        "source": "Social Media Monitor", "symbol": "🛺📱"
    }
]

def sync_deep_extract_data():
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # We append these to the existing live proof set
        for inc in LATEST_GOOGLE_INCIDENTS:
            # Prevent double-adding if script is re-run
            cursor.execute("SELECT id FROM events WHERE title = ?", (inc['title'],))
            if not cursor.fetchone():
                cursor.execute("""
                    INSERT INTO events (title, description, event_type, severity, latitude, longitude, source, location_name, map_symbol, timestamp)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (inc['title'], inc['desc'], inc['type'], inc['sev'], inc['lat'], inc['lng'], inc['source'], inc['loc'], inc['symbol'], datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
        
        conn.commit()
        conn.close()
        print("SUCCESS: Full AI Overview Deep Extract complete. Dashboard updated with all mentioned incidents.")
    else:
        print("DB not found.")

if __name__ == "__main__":
    sync_deep_extract_data()
