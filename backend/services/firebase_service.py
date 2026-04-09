import os

# --- LOCAL ONLY MODE: Firebase removed to ensure 100% stability ---
firebase_ready = False

def send_push_notification(title, body, token=None):
    """LOCAL SIMULATION: Prints safety alerts to the terminal console."""
    print("\n" + "🛡️"*20)
    print(f"📍 [LOCAL CITY ALERT]")
    print(f"📢 {title}")
    print(f"📄 {body}")
    print("🛡️"*20 + "\n")
    return True

def push_incident_to_firebase(payload):
    """LOCAL SIMULATION: Skips cloud sync, keeps data in local SQLite."""
    # print(f"☁️ [LOCAL SYNC] Incident cached: {payload.get('title')}")
    return True

def upload_incident_photo(file_path):
    """LOCAL STORAGE: Returns the local relative URL for images."""
    return f"/api/uploads/{os.path.basename(file_path)}"
