import requests
import os
import random
import csv
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor

# Load entire taxonomy for targeted sweeping
def load_incident_taxonomy():
    types = []
    try:
        # Resolve path relative to project root (parent of /backend)
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        # Search in backend or project root
        path_options = [
            os.path.join(base_dir, "incidents_types.csv"),
            os.path.join(os.path.dirname(base_dir), "incidents_types.csv"),
            "incidents_types.csv"
        ]
        
        path = ""
        for p in path_options:
            if os.path.exists(p):
                path = p
                break
        
        if path:
            with open(path, mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    types.append(row['IncidentType'])
    except: pass
    return types if types else ["Traffic congestion", "Road accident", "Power cut", "Fire accident"]

def load_locations():
    """Load all 500+ locations from colleges.csv for targeted scanning"""
    locs = []
    try:
        import csv
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        path_options = [
            os.path.join(base_dir, "colleges.csv"),
            os.path.join(os.path.dirname(base_dir), "colleges.csv"),
            "colleges.csv"
        ]
        
        path = ""
        for p in path_options:
            if os.path.exists(p):
                path = p
                break
                
        if path:
            with open(path, mode='r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    name = row.get('Name') or row.get('\ufeffName')
                    if name: locs.append(name)
    except: pass
    return locs if locs else ["Majestic", "Silk Board", "MG Road"]

def fetch_rss_single(query):
    """
    ⚡ REFINED WORKER: 
    Strictly searches for incidents in last 12 hours.
    """
    # Using 'when:12h' and 'after:YYYY-MM-DD' for extreme freshness
    today_date = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
    url = f"https://news.google.com/rss/search?q={query.replace(' ', '+')}+bengaluru+after:{today_date}+when:12h"
    try:
        response = requests.get(url, timeout=7)
        if response.status_code == 200:
            root = ET.fromstring(response.content)
            items = []
            for item in root.findall('./channel/item')[:3]:
                title = item.find('title').text
                # Filter out old or irrelevant non-Bengaluru results via simple keyword check
                if "Bengaluru" in title or "Bangalore" in title or any(kw in title.lower() for kw in ["traffic", "accident", "lockdown", "fire"]):
                   items.append(title)
            return items
    except: pass
    return []

def get_all_realtime_data():
    """
    🚀 VANGUARD LIVE-ONLY CRAWLER
    No simulation fallbacks. Only returns real incidents found on Google/X.
    """
    taxonomy = load_incident_taxonomy()
    locations = load_locations()
    
    # Pick 20 types to scan deeply this cycle
    today_targets = random.sample(taxonomy, min(25, len(taxonomy)))
    print(f"🛰️ SENTINEL High-Frequency Sweep: {len(today_targets)} categories...")

    raw_signals = []
    
    # Parallel Sweeping
    with ThreadPoolExecutor(max_workers=15) as executor:
        results = list(executor.map(fetch_rss_single, today_targets))
        for res in results:
            raw_signals.extend(res)

    # Filter for unique signals
    unique_signals = list(set(raw_signals))
    if not unique_signals:
        print("📭 No live incidents detected in the last 12 hours.")
        return []

    print(f"🧠 AI Synthesis (Gemini): Processing {len(unique_signals)} LIVE signals...")
    return gemini_batch_resolve(unique_signals, locations)

def gemini_batch_resolve(signals, locations):
    """Resolve raw headlines to structured events using AI"""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key: return []

    chunk = "\n".join([f"- {s}" for s in signals[:30]])
    loc_context = ", ".join(random.sample(locations, min(50, len(locations))))

    prompt = f"""
    You are the SENTINEL Urban AI for Bengaluru. 
    Analyze these CURRENT headlines/signals and extract REAL, CONFIRMED incidents (TODAY only).
    
    SIGNALS:
    {chunk}
    
    LANDMARK CONTEXT: {loc_context}
    
    CRITICAL INSTRUCTIONS:
    1. ONLY include incidents that clearly occurred in the last 24 hours.
    2. IGNORE general news, sports, or politics unless it causes major crowds/protests.
    3. Identify the EXACT neighborhood (e.g., Koramangala, Silk Board).
    4. Return valid JSON list of objects:
    [{{ "title": "Real Alert Title", "description": "Professional Summary", "location": "Precise Area", "severity": "High/Med/Low", "type": "Type", "source": "Google/Social Feed" }}]
    
    If no REAL incidents exist, return an empty list [].
    """
    
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        response = requests.post(url, json=payload, timeout=20)
        if response.status_code == 200:
            import json
            raw = response.json()['candidates'][0]['content']['parts'][0]['text']
            clean = raw.replace("```json", "").replace("```", "").strip()
            return json.loads(clean)
    except Exception as e:
        print(f"Gemini Batch Resolving Error: {e}")
    return []

def analyze_with_gemini(text):
    """Standard analysis fallback"""
    from services.gemini import analyze_event_text
    return analyze_event_text(text)

def fetch_gnews_official(query):
    # Keep for backward compatibility
    return []
