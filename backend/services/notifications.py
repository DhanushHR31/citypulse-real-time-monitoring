import os
# from firebase_admin import messaging, credentials, initialize_app

# Global flag or check for firebase app initialization
firebase_app = None

def initialize_firebase():
    global firebase_app
    # Placeholder for real initialization
    # cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
    # if cred_path and os.path.exists(cred_path):
    #     cred = credentials.Certificate(cred_path)
    #     firebase_app = initialize_app(cred)
    pass

def send_notification(token: str, title: str, body: str, data: dict = None):
    """
    Sends a push notification to a specific device token.
    Falls back to print/log if Firebase is not configured.
    """
    if firebase_app:
        # Real sending logic
        # message = messaging.Message(
        #     notification=messaging.Notification(title=title, body=body),
        #     data=data,
        #     token=token,
        # )
        # response = messaging.send(message)
        # return response
        pass
    else:
        print(f"[MOCK NOTIFICATION] To: {token} | Title: {title} | Body: {body} | Data: {data}")
        return "mock-message-id"

def send_topic_notification(topic: str, title: str, body: str, data: dict = None):
    """
    Sends to a topic (e.g., 'all_users', 'traffic_alerts').
    """
    if firebase_app:
        # message = messaging.Message(
        #     notification=messaging.Notification(title=title, body=body),
        #     data=data,
        #     topic=topic,
        # )
        # response = messaging.send(message)
        # return response
        pass
    else:
        print(f"[MOCK TOPIC NOTIFICATION] To: {topic} | Title: {title} | Body: {body}")
        return "mock-topic-message-id"
