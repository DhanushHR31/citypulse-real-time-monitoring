import os

# --- LOCAL SERVICE: Firebase removed for 100% demo stability ---

def send_notification(token: str, title: str, body: str, data: dict = None):
    """
    LOCAL SIMULATION: Sends safety intelligence to the backend logs.
    """
    print(f"\n📢 [CITIZEN ALERT] To: {token}")
    print(f"   ► {title}: {body}")
    return {"status": "success", "id": "local-id-123", "destination": token}

def send_topic_notification(topic: str, title: str, body: str, data: dict = None):
    """
    LOCAL SIMULATION: Broadcasts city-wide alerts to all monitoring nodes.
    """
    print(f"\n🏙️ [CITY BROADCAST] Topic: {topic}")
    print(f"   ► {title}: {body}")
    return {"status": "success", "id": "local-topic-123", "topic": topic}
