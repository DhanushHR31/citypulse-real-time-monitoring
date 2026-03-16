import requests
import os
import random
from datetime import datetime
from services import gemini

def analyze_with_gemini(text):
    return gemini.analyze_event_text(text)

def get_mock_news():
    """Fallback mock data"""
    return [
        {
            "title": "Major traffic jam reported near Silk Board Junction",
            "description": "Commuters facing 2 hour delays due to signal failure.",
            "url": "#",
            "source": {"name": "Mock News"},
            "publishedAt": datetime.utcnow().isoformat()
        },
        {
            "title": "Unexpected rain causes waterlogging in Koramangala",
            "description": "Several streets flooded, avoid 80ft road.",
            "url": "#",
            "source": {"name": "Mock News"},
            "publishedAt": datetime.utcnow().isoformat()
        }
    ]

def fetch_rapidapi_data(host_env, key_env, endpoint, params, source_name):
    """Generic helper for RapidAPI calls"""
    api_key = os.getenv(key_env)
    api_host = os.getenv(host_env)
    
    if not api_key or not api_host:
        print(f"Missing keys for {source_name}")
        return []

    url = f"https://{api_host}{endpoint}"
    headers = {
        "x-rapidapi-key": api_key,
        "x-rapidapi-host": api_host
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error fetching {source_name}: {response.status_code} - {response.text}")
            return []
    except Exception as e:
        print(f"Exception fetching {source_name}: {e}")
        return []

def fetch_google_news(query="Bengaluru"):
    """RapidAPI Google News"""
    data = fetch_rapidapi_data("RAPIDAPI_GNEWS_HOST", "RAPIDAPI_GNEWS_KEY", "/search", {"keyword": query, "lr": "en-IN"}, "Google News")
    if not data: return get_mock_news() # Fallback

    # Parse standard response from 'google-news13'
    articles = data.get("items", []) or data.get("articles", [])
    normalized = []
    for item in articles:
        normalized.append({
            "title": item.get("title"),
            "description": item.get("snippet") or item.get("title"),
            "url": item.get("newsUrl") or item.get("url"),
            "source": {"name": "Google News"},
            "publishedAt": item.get("time") or datetime.utcnow().isoformat()
        })
    return normalized

def fetch_twitter_data(query="Bengaluru"):
    """RapidAPI Twitter (X) - via twitter-data1.p.rapidapi.com"""
    # User snippet suggested /v1.1/Tweets/. usually for specific IDs.
    # For monitoring, we need Search. Most of these APIs mirror official endpoints.
    # Trying /Search for monitoring.
    
    # Endpoint derived from user snippet host logic
    endpoint = "/Search/" 
    params = {"q": query, "count": "10"}
    
    data = fetch_rapidapi_data("RAPIDAPI_TWITTER_HOST", "RAPIDAPI_GNEWS_KEY", endpoint, params, "Twitter")
    
    # Adapt to response structure (which varies by wrapper)
    # twitter-data1 usually returns: { "statuses": [...] } or similar
    normalized = []
    
    try:
        results = data.get("statuses", []) if isinstance(data, dict) else []
        if not results and isinstance(data, list): results = data # Handle list response

        for item in results:
            normalized.append({
                "text": item.get("text") or item.get("full_text") or "No content",
                "user": item.get("user", {}).get("screen_name", "Unknown"),
                "url": f"https://twitter.com/i/web/status/{item.get('id_str')}",
                "source": "Twitter",
                "timestamp": item.get("created_at") or datetime.utcnow().isoformat()
            })
    except Exception as e:
        print(f"Error parsing Twitter response: {e}")

    # If empty (API limit or wrong pattern), return mock
    if not normalized:
        return [{
            "text": f"Traffic alert in {query} via Twitter (Mock Fallback)", 
            "user": "BlrCityPolice", 
            "source": "Twitter", 
            "timestamp": datetime.utcnow().isoformat()
        }]
    return normalized

def fetch_instagram_data(query="Bengaluru"):
    """RapidAPI Instagram - via instagram-api-fast-reliable-data-scraper.p.rapidapi.com"""
    # User provided snippet for: instagram-api-fast-reliable-data-scraper
    # Switching to a likely Hashtag search endpoint for this API wrapper.
    # Common pattern: /hashtag/media or /hashtag_medias_top
    
    endpoint = "/hashtag_medias_top" 
    params = {"hashtag": query.replace(" ", "")}
    
    data = fetch_rapidapi_data("RAPIDAPI_INSTAGRAM_HOST", "RAPIDAPI_GNEWS_KEY", endpoint, params, "Instagram")
    
    normalized = []
    # Adapt to likely response structure
    try:
        # Many scrapers return { "data": { "hashtag": { "edge_hashtag_to_media": { "edges": [...] } } } }
        # Or just a list of items. logic needs to be robust.
        posts = []
        if isinstance(data, list): 
            posts = data
        elif isinstance(data, dict):
             # Try generic traversing
             posts = data.get("medias", []) or data.get("data", [])
    
        for item in posts:
            node = item.get("node", item) # Sometimes wrapped in 'node'
            normalized.append({
                "image": node.get("display_url") or node.get("thumbnail_src"),
                "caption": node.get("edge_media_to_caption", {}).get("edges", [{}])[0].get("node", {}).get("text", "No caption"),
                "user": "InstagramUser", # Often hidden in simple scrapers
                "source": "Instagram",
                "timestamp": datetime.utcnow().isoformat()
            })
    except Exception as e:
        print(f"Error parsing Instagram response: {e}")
        
    if not normalized:
         # Fallback if specific API structure mismatch
         return [{
            "image": "https://via.placeholder.com/150",
            "caption": f"Recent updates on #{query} (Mock Fallback)",
            "user": "InstaUser",
            "source": "Instagram",
            "timestamp": datetime.utcnow().isoformat()
        }]
        
    return normalized

def fetch_threads_data(query="Bengaluru"):
    """RapidAPI Threads"""
    data = fetch_rapidapi_data("RAPIDAPI_THREADS_HOST", "RAPIDAPI_GNEWS_KEY", "/search", {"query": query}, "Threads")
    
    normalized = []
    results = data.get("results", []) if isinstance(data, dict) else []
    
    for item in results:
        normalized.append({
            "text": item.get("caption") or item.get("text") or "Threads post",
            "user": item.get("user", {}).get("username", "user"),
            "source": "Threads",
            "timestamp": datetime.utcnow().isoformat()
        })

    return normalized
