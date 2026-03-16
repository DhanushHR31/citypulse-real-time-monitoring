from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from database import engine
import models
from routers import events, collection, notifications, predictions, navigation, users
load_dotenv()

# Create all DB tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CityPulse Smart City API",
    description="Backend for CityPulse — social event collection, AI analysis, navigation, predictions.",
    version="3.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Allow React dev server (port 5173) and any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events.router)
app.include_router(collection.router)
app.include_router(notifications.router)
app.include_router(predictions.router)
app.include_router(navigation.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {
        "app": "CityPulse Smart City API",
        "version": "3.0.0",
        "frontend": "http://localhost:5173",
        "docs": "http://localhost:8000/docs"
    }

