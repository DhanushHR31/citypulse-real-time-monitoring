from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from .database import engine, Base
from . import models
from .routers import events, collection, notifications, predictions, navigation

# Load environment variables
load_dotenv()

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart City Event Monitoring System",
    description="API for collecting and analyzing city events for intelligent navigation.",
    version="1.0.0"
)

app.include_router(events.router)
app.include_router(collection.router)
app.include_router(notifications.router)
app.include_router(predictions.router)
app.include_router(navigation.router)

# CORS configuration to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify local file or domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles

# ... (routers included above)

# Mount Frontend - Place this AFTER API routers
# app.mount("/", StaticFiles(directory="../frontend", html=True), name="frontend")
# note: relative path from 'backend/' folder where main.py is run?
# We usually run from 'city/' via 'python -m uvicorn backend.main:app'
# So 'frontend' is 'frontend'.
# If running from 'city/', main is in 'backend.main'.
# os.getcwd() usually 'city/'.
# So directory="frontend" should work.

import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

# Removed old @app.get("/") as StaticFiles handles index.html at /

