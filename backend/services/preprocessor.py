import re
import math

# Approximate center of Bengaluru
BLR_CENTER_LAT = 12.9716
BLR_CENTER_LNG = 77.5946

def clean_text(text: str) -> str:
    """
    Removes special characters, URLs, and extra spaces.
    """
    if not text:
        return ""
    # Remove URLs
    text = re.sub(r'http\S+', '', text)
    # Remove special chars (keep basic punctuation)
    text = re.sub(r'[^\w\s.,!?]', '', text)
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def remove_duplicates(events_list):
    """
    Simple de-duplication based on title similarity or exact match.
    """
    seen = set()
    unique_events = []
    
    for event in events_list:
        # Create a unique key from title (normalized)
        key = clean_text(event.get('title', '') or event.get('text', '')).lower()
        if key not in seen:
            seen.add(key)
            unique_events.append(event)
            
    return unique_events

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) * math.sin(dlat / 2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dlon / 2) * math.sin(dlon / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def filter_by_location(events_list, radius_km=25):
    """
    Filters events that have coordinates within the radius of Bengaluru.
    Note: Many raw events won't have coords yet (preprocessing step usually comes before Geocoding).
    So this might handle cases where coords are already present or skip if not.
    """
    filtered = []
    for event in events_list:
        lat = event.get('latitude') or event.get('lat')
        lng = event.get('longitude') or event.get('lon') or event.get('lng')
        
        if lat and lng:
            dist = haversine_distance(BLR_CENTER_LAT, BLR_CENTER_LNG, float(lat), float(lng))
            if dist <= radius_km:
                filtered.append(event)
        else:
            # If no coords, we assume it needs to be geocoded or processed later.
            # Ideally, we key off "Bengaluru" in text if coords are missing.
            text = (event.get('title', '') + " " + event.get('description', '')).lower()
            if 'bengaluru' in text or 'bangalore' in text:
                filtered.append(event)
                
    return filtered
