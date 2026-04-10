from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from dotenv import load_dotenv
from database import engine, SessionLocal
import models
from routers import events, collection, notifications, predictions, navigation, users, chat, alerts
import os
import threading
import time
import asyncio
from datetime import datetime, timedelta
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

load_dotenv()

# --- SENTINEL BACKGROUND INTELLIGENCE (User Requested: 15 Min Interval) ---
def sentinel_intelligence_loop():
    """🛡️ SENTINEL: 15-Minute City-Wide Landmark Synchronizer
    Scans ALL 500+ Bengaluru landmarks using AI every 15 minutes.
    Data is stored in SQL for Admin, while User View filters for Freshness.
    """
    time.sleep(10) 
    while True:
        print(f"\n🔄 [{datetime.now().strftime('%H:%M:%S')}] SENTINEL DEEP SCAN: Cross-referencing 500+ Landmarks...")
        print(f"🚀 VANGUARD: Multi-Threaded Sweep across 100+ Incident Categories (Google/X/News)...")
        db = SessionLocal()
        try:
            from routers.collection import run_automated_fetch
            new_events = run_automated_fetch(db)
            print(f"✅ SENTINEL Deep Scan Complete. New incidents synced: {new_events}")
            
            # NOTE: We NO LONGER delete data here. 
            # Historic data is kept in SQL for the Admin Dashboard.
            # Freshness is handled at the API level for the User Dashboard.
            
        except Exception as e:
            print(f"❌ SENTINEL Deep Scan Error: {e}")
        finally:
            db.close()
        
        # 15-Minute Sync Interval (900 seconds)
        time.sleep(900)

# Initialize Database
models.Base.metadata.create_all(bind=engine)

# Launch Sentinel Thread
threading.Thread(target=sentinel_intelligence_loop, daemon=True).start()

app = FastAPI(
    title="CityPulse Smart City API Pro",
    description="Sentinel Deep Intelligence Engine — 15-Min City-Wide Scanning Hub.",
    version="3.5.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploads
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/api/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(events.router)
app.include_router(collection.router)
app.include_router(notifications.router)
app.include_router(alerts.router)
app.include_router(predictions.router)
app.include_router(navigation.router)
app.include_router(users.router)
app.include_router(chat.router)

@app.get("/api/admin/table-data/{table_name}")
def get_table_content(table_name: str):
    db = SessionLocal()
    valid_tables = [t.name for t in models.Base.metadata.sorted_tables]
    if table_name not in valid_tables:
        return {"error": "Invalid table or security restriction"}
    try:
        result = db.execute(text(f"SELECT * FROM {table_name} ORDER BY id DESC LIMIT 500"))
        rows = [dict(row._mapping) for row in result]
        for r in rows:
            if isinstance(r.get('timestamp'), datetime):
                r['timestamp'] = r['timestamp'].isoformat()
        return rows
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()

@app.get("/", response_class=HTMLResponse)
def root():
    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>CityPulse Pro API</title>
<style>
  body {{ font-family: system-ui; background: #0f172a; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }}
  .box {{ background: #1e293b; padding: 40px; border-radius: 20px; border: 1px solid #334155; text-align: center; max-width: 500px; }}
  h1 {{ color: #38bdf8; margin-bottom: 8px; }}
  p {{ color: #94a3b8; line-height: 1.6; }}
  .status {{ display: inline-flex; align-items: center; gap: 8px; background: rgba(34,197,94,0.1); color: #4ade80; padding: 6px 16px; border-radius: 999px; font-size: .8rem; font-weight: 700; margin-top: 20px; }}
  .dot {{ width: 8px; height: 8px; background: #4ade80; border-radius: 50%; animation: pulse 1s infinite; }}
  @keyframes pulse {{ 0% {{ opacity: 1; }} 50% {{ opacity: 0.3; }} 100% {{ opacity: 1; }} }}
</style>
</head>
<body>
<div class="box">
  <h1>🛡️ Sentinel Intelligence Hub</h1>
  <p>City-Wide 15-Minute Scan Active. <br/> Cross-referencing 500+ Bengaluru landmarks via Gemini AI.</p>
  <div class="status"><div class="dot"></div> SENTINEL ENGINE ONLINE</div>
  <div style="margin-top:24px; display:flex; gap:10px; justify-content:center;">
    <a href="/docs" style="color:#6366f1; text-decoration:none; font-weight:700;">API Docs</a>
    <span style="color:#334155;">|</span>
    <a href="http://localhost:5177" style="color:#6366f1; text-decoration:none; font-weight:700;">Dashboard</a>
  </div>
</div>
</body>
</html>
"""
