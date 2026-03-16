from fastapi import APIRouter
from pydantic import BaseModel
from services import notifications

router = APIRouter(
    prefix="/notifications",
    tags=["notifications"],
)

class NotificationRequest(BaseModel):
    title: str
    body: str
    topic: str = "all-users"

@router.post("/send")
def trigger_notification(payload: NotificationRequest):
    """
    Manually trigger a notification (for testing or admin purposes).
    """
    response = notifications.send_topic_notification(
        topic=payload.topic,
        title=payload.title,
        body=payload.body
    )
    return {"status": "success", "response": response}
