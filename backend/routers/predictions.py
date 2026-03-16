from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
from ..services import prediction

router = APIRouter(
    prefix="/predict",
    tags=["predict"],
)

class PredictionRequest(BaseModel):
    event_type: str
    timestamp: datetime = datetime.now()

@router.post("/severity")
def predict_severity(request: PredictionRequest):
    """
    Predicts the severity of an event at a specific time.
    """
    result = prediction.predict_event_severity(request.event_type, request.timestamp)
    return {
        "event_type": request.event_type,
        "timestamp": request.timestamp,
        "prediction": result
    }
