from fastapi import APIRouter
from pydantic import BaseModel
from ..services import navigation

router = APIRouter(
    prefix="/navigation",
    tags=["navigation"],
)

class RouteRequest(BaseModel):
    origin: str
    destination: str

@router.post("/route")
def calculate_route_proxy(request: RouteRequest):
    """
    Proxies routing request to backend service.
    """
    result = navigation.get_rapid_route(request.origin, request.destination)
    return result
