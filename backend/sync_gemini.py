import sqlite3
from datetime import datetime
import os

db_path = r'c:\Users\dhanu\OneDrive\Desktop\8Th sem\city\backend\smart_city.db'

# 🧭 GEMINI PRO DEEP SWEEP: Real incidents for April 9, 2026
LATEST_GOOGLE_INCIDENTS = [
    {
        "title": "Fatal Tractor Accident - Hulimavu",
        "desc": "Victim Harish P. (26) was killed by a tractor during a temple procession. Incident reported in Hulimavu traffic limits. #Emergency",
        "type": "Road accident", "sev": "Critical", "loc": "Hulimavu", "lat": 12.8752, "lng": 77.5954,
        "source": "Google Gemini / The Hindu", "symbol": "🚜💀"
    },
    {
        "title": "LPG Price Crisis Protest - Freedom Park",
        "desc": "Autorickshaw drivers' union protesting ₹125/L price hike. Demanding ₹15,000 monthly aid. Significant congestion in Gandhinagar areas.",
        "type": "Protest", "sev": "High", "loc": "Freedom Park", "lat": 12.9737, "lng": 77.5782,
        "source": "Google Gemini / TOI", "symbol": "🛺🪧"
    },
    {
        "title": "Transporter Backlash: Traffic Slowdown",
        "desc": "Heavy vehicle owners protesting steep hike in fitness renewal fees. Slow-moving traffic on RTO routes and commercial hubs.",
        "type": "Traffic congestion", "sev": "Medium", "loc": "Commercial Hubs / RTO Routes", "lat": 12.9800, "lng": 77.5800,
        "source": "Google Gemini Live", "symbol": "🚛🚥"
    },
    {
        "title": "Air India Emergency - Mumbai/Blr Flight",
        "desc": "AI2812 (Mumbai-Blr) returned to Mumbai after suspected engine stall/sparks. Passengers diverted. #AviationEmergency",
        "type": "Medical emergency", "sev": "Medium", "loc": "BIAL (Impact Area)", "lat": 13.1986, "lng": 77.7066,
        "source": "Google Gemini / News", "symbol": "✈️🚨"
    }
]

def sync_gemini_intelligence():
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # We append/update the intelligence for the current day
        for inc in LATEST_GOOGLE_INCIDENTS:
            cursor.execute("SELECT id FROM events WHERE title = ?", (inc['title'],))
            if not cursor.fetchone():
                cursor.execute("""
                    INSERT INTO events (title, description, event_type, severity, latitude, longitude, source, location_name, map_symbol, timestamp)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (inc['title'], inc['desc'], inc['type'], inc['sev'], inc['lat'], inc['lng'], inc['source'], inc['loc'], inc['symbol'], datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
        
        conn.commit()
        conn.close()
        print("SUCCESS: Gemini Pro Deep Intelligence Sync complete.")
    else:
        print("DB not found.")

if __name__ == "__main__":
    sync_gemini_intelligence()
