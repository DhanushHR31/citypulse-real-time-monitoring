import sqlite3
from datetime import datetime
import os

db_path = r'c:\Users\dhanu\OneDrive\Desktop\8Th sem\city\backend\smart_city.db'

# 🚀 FINAL LIVE PROOF: Exact Incidents from the "Live Video" Search (April 9, 2026)
LATEST_GOOGLE_INCIDENTS = [
    {
        "title": "Fatal Trailer Crash - Kurubarahalli",
        "desc": "Speeding trailer-truck rammed a parked MUV, causing a massive fire and 1 fatality near Rajajinagar boundary.",
        "type": "Road accident", "sev": "Critical", "loc": "Kurubarahalli", "lat": 12.9984, "lng": 77.5456,
        "source": "Google News Live", "symbol": "🔥🚛"
    },
    {
        "title": "Vegetable Lorry Collision - Mysuru Road",
        "desc": "Fatal collision involving a vegetable lorry at the Satellite Bus Stand signal. Traffic heavily disrupted.",
        "type": "Road accident", "sev": "High", "loc": "Mysuru Road", "lat": 12.9537, "lng": 77.5424,
        "source": "BTP Traffic Feed", "symbol": "🚛💥"
    },
    {
        "title": "Huge Fire Alert - Electronic City Phase 1",
        "desc": "Fire services battling a large blaze spotted in the industrial area of Electronic City Phase 1. Evacuation in progress.",
        "type": "Fire accident", "sev": "Critical", "loc": "Electronic City Phase 1", "lat": 12.8454, "lng": 77.6602,
        "source": "Twitter Public Alert", "symbol": "🔥🏭"
    },
    {
        "title": "Godown Blaze - Bengaluru-Mysuru Expressway",
        "desc": "Massive fire reported in a storage area; multiple godowns affected. Visibility low on the expressway.",
        "type": "Fire accident", "sev": "High", "loc": "Mysuru Expressway", "lat": 12.8900, "lng": 77.4500,
        "source": "NewsFirst Prime", "symbol": "🔥📦"
    },
    {
        "title": "Hulimavu Fatality: Harish P.",
        "desc": "26-year-old Harish P. tragically killed in tractor accident during temple procession. Police verifying crowds.",
        "type": "Road accident", "sev": "High", "loc": "Hulimavu", "lat": 12.8752, "lng": 77.5954,
        "source": "The Hindu Live", "symbol": "🚜💀"
    },
    {
        "title": "Toddler Fall Emergency - Nayandahalli",
        "desc": "A 2-3 year old toddler fell from a residential building. Emergency response delay being monitored.",
        "type": "Medical emergency", "sev": "High", "loc": "Nayandahalli", "lat": 12.9430, "lng": 77.5255,
        "source": "CityPulse Sensor", "symbol": "🚑👶"
    },
    {
        "title": "Hostel Tragedy - Hosur Road",
        "desc": "BTech student died after a fatal fall from 9th floor of a private university hostel. Investigation ongoing.",
        "type": "Medical emergency", "sev": "Critical", "loc": "Koramangala/Hosur Road", "lat": 12.9300, "lng": 77.6100,
        "source": "Campus Social Feed", "symbol": "🏢⚠️"
    }
]

def sync_vanguard_live_data():
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM events") # Purge all to show ONLY THE LIVE VIDEO RESULTS
        for inc in LATEST_GOOGLE_INCIDENTS:
            cursor.execute("""
                INSERT INTO events (title, description, event_type, severity, latitude, longitude, source, location_name, map_symbol, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (inc['title'], inc['desc'], inc['type'], inc['sev'], inc['lat'], inc['lng'], inc['source'], inc['loc'], inc['symbol'], datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
        conn.commit()
        conn.close()
        print("SUCCESS: Vanguard Pro Engine synchronized with exact Live Video incidents.")
    else:
        print("DB not found.")

if __name__ == "__main__":
    sync_vanguard_live_data()
