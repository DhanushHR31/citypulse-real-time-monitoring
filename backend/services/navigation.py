import requests
import os
import json

def get_coordinates(address):
    """
    Uses OpenStreetMap (Nominatim) to geocode an address to lat/lon.
    Free, no API key required.
    """
    try:
        url = "https://nominatim.openstreetmap.org/search"
        headers = {'User-Agent': 'SmartCityApp/1.0'}
        params = {
            'q': address,
            'format': 'json',
            'limit': 1
        }
        res = requests.get(url, params=params, headers=headers)
        if res.status_code == 200:
            data = res.json()
            if data:
                return float(data[0]['lon']), float(data[0]['lat'])
    except Exception as e:
        print(f"Geocoding error: {e}")
    return None, None

def get_rapid_route(start_text, end_text):
    """
    Uses OSRM Public API for Turn-by-Turn Navigation.
    Free, Open Source, and provides text instructions (steps).
    """
    
    # 1. Geocode
    start_lon, start_lat = get_coordinates(start_text)
    end_lon, end_lat = get_coordinates(end_text)
    
    if not start_lat or not end_lat:
        return {"error": "Could not geocode one or both locations."}

    # 2. Call OSRM Public API
    # Format: /route/v1/driving/{lon},{lat};{lon},{lat}?steps=true&geometries=geojson
    base_url = "http://router.project-osrm.org/route/v1/driving"
    coords = f"{start_lon},{start_lat};{end_lon},{end_lat}"
    
    try:
        url = f"{base_url}/{coords}?steps=true&geometries=geojson&overview=full"
        response = requests.get(url, headers={'User-Agent': 'SmartCityNav/1.0'})
        
        if response.status_code == 200:
            data = response.json()
            
            # OSRM structure: { "routes": [ { "geometry": {...}, "legs": [ { "steps": [...] } ] } ] }
            return {
                "status": "success",
                "data": data, # Return full OSRM data including steps
                "start": [start_lat, start_lon],
                "end": [end_lat, end_lon]
            }
        else:
            return {"error": f"OSRM Error: {response.status_code}"}
            
    except Exception as e:
        return {"error": str(e)}
