import http.client
import json
import os

def analyze_event_text(text: str):
    """
    Analyzes event text using Gemini (via RapidAPI) to extract:
    - Event Type
    - Severity
    - Summary
    """
    rapid_api_key = os.getenv("RAPIDAPI_KEY")
    rapid_api_host = os.getenv("RAPIDAPI_HOST")

    if not rapid_api_key:
        print("RapidAPI Key missing. Returning mock analysis.")
        return get_mock_analysis(text)

    conn = http.client.HTTPSConnection(rapid_api_host)

    master_prompt = f"""
    You are an intelligent urban event analysis AI. Your task is to analyze the following city event report and extract structured intelligence.

    EVENT REPORT: "{text}"

    Execute the following analysis modules:
    
    1. EVENT IDENTIFICATION:
       - Classify into: Traffic congestion, Road accident, Flood, Fire, Power outage, Water supply, Protest, Crowd gathering, Infrastructure damage, or "No Valid Event".
       - Ignore irrelevant/spam.
    
    2. LOCATION EXTRACTION:
       - Extract specific Area, Junction, Landmark, or Road. 
       - If vague, mark "Unknown".
    
    3. SEVERITY ASSESSMENT (Rules):
       - Low: Minor inconvenience.
       - Medium: Moderate disruption (delays possible).
       - High: Major disruption, safety risk (emergency needed).
    
    4. CROWD DENSITY ESTIMATION:
       - Look for cues: "heavy crowd", "packed", "thousands".
       - Classify: Low, Medium, High, or Not Determined.
    
    5. TRUST SCORE reasoning:
       - Analyze source reliability (Govt > News > Verified Social > Random).
    
    6. ROUTE IMPACT ANALYSIS:
       - Does this affect commuters? Mention delays/closures.
       - If no impact, say "No significant route impact."
    
    7. MAP SYMBOL SELECTION:
       - Pick one: 🚗💥 (Accident), 🚦 (Traffic), 🌧️ (Flood), 🔥 (Fire), 🚱 (Water), ⚡ (Power), 👥 (Crowd).

    OUTPUT JSON FORMAT ONLY:
    {{
        "event_type": "string",
        "severity": "Low|Medium|High|Critical",
        "summary": "Concise one-line summary (max 25 words)",
        "location": "extracted location name",
        "crowd_density": "Low|Medium|High|Not Determined",
        "impact_analysis": "Brief impact description",
        "map_symbol": "symbol char",
        "confidence_reasoning": "brief justification"
    }}
    """

    payload_data = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ]
    }
    
    payload = json.dumps(payload_data)

    headers = {
        'x-rapidapi-key': rapid_api_key,
        'x-rapidapi-host': rapid_api_host,
        'Content-Type': "application/json"
    }

    try:
        conn.request("POST", "/", payload, headers)
        res = conn.getresponse()
        data = res.read()
        response_str = data.decode("utf-8")
        
        response_json = json.loads(response_str)
        
        # Extract content from Gemini response structure
        # Note: The structure might vary based on the specific RapidAPI wrapper, 
        # but typically it mimics the official API or returns 'candidates'.
        # We need to be careful with parsing.
        
        # Taking a safe guess based on common patterns, or just returning the text if parsing fails.
        # Let's assume the standard Gemini response format: candidates[0].content.parts[0].text
        
        try:
             # Adjust based on actual RapidAPI response if needed
            content_text = response_json['candidates'][0]['content']['parts'][0]['text']
            # Clean markdown code blocks if present
            content_text = content_text.replace("```json", "").replace("```", "").strip()
            return json.loads(content_text)
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            print(f"Error parsing Gemini response: {e}")
            print(f"Raw response: {response_str}")
            return get_mock_analysis(text)

    except Exception as e:
        print(f"Error calling RapidAPI: {e}")
        return get_mock_analysis(text)

def get_mock_analysis(text):
    """
    Fallback mock analysis.
    """
    lower_text = text.lower()
    event_type = "Other"
    severity = "Low"
    
    if "traffic" in lower_text or "jam" in lower_text:
        event_type = "Traffic"
        severity = "Medium"
    elif "accident" in lower_text or "collision" in lower_text:
        event_type = "Accident"
        severity = "High"
    elif "rain" in lower_text or "flood" in lower_text:
        event_type = "Weather"
        severity = "Medium"
        
    return {
        "event_type": event_type,
        "severity": severity,
        "summary": text[:50] + "..." if len(text) > 50 else text,
        "location": "Bengaluru",
        "crowd_density": "Not Determined",
        "impact_analysis": "No significant route impact (Legacy Data)",
        "map_symbol": "📍"
    }
