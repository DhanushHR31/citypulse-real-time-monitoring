from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from dotenv import load_dotenv
from database import engine, SessionLocal
import models
from routers import events, collection, notifications, predictions, navigation, users, chat
import os

load_dotenv()

from datetime import datetime, timedelta
from database import engine, SessionLocal
import models
from fastapi.staticfiles import StaticFiles

# --- AUTO CLEANUP: Remove units older than 24 hours for maximum freshness ---
def cleanup_old_events():
    db = SessionLocal()
    try:
        cutoff = datetime.utcnow() - timedelta(days=1)
        deleted = db.query(models.Event).filter(models.Event.timestamp < cutoff).delete()
        db.commit()
        print(f"✔️ Safety Pulse: Removed {deleted} expired incidents (older than 24h).")
    except Exception as e:
        print(f"❌ Cleanup Error: {e}")
    finally:
        db.close()

# Create all DB tables
models.Base.metadata.create_all(bind=engine)
cleanup_old_events()

app = FastAPI(
    title="CityPulse Smart City API",
    description="Backend for CityPulse — social event collection, AI analysis, navigation, predictions.",
    version="3.0.0",
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

# Serve uploads as static files
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/api/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(events.router)
app.include_router(collection.router)
app.include_router(notifications.router)
app.include_router(predictions.router)
app.include_router(navigation.router)
app.include_router(users.router)
app.include_router(chat.router)

from sqlalchemy import text

@app.get("/api/admin/table-data/{{table_name}}")
def get_table_content(table_name: str):
    db = SessionLocal()
    # Security: Verify table name exists in models
    valid_tables = [t.name for t in models.Base.metadata.sorted_tables]
    if table_name not in valid_tables:
        return {"error": "Invalid table or security restriction"}
    
    try:
        result = db.execute(text(f"SELECT * FROM {{table_name}} ORDER BY id DESC LIMIT 100"))
        rows = [dict(row._mapping) for row in result]
        return rows
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()

@app.get("/", response_class=HTMLResponse)
def root():
    db = SessionLocal()
    try:
        logs = db.query(models.UserLog).order_by(models.UserLog.timestamp.desc()).limit(10).all()
        log_rows = "".join([
            f'<div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:.82rem;">'
            f'<span style="color:#f1f5f9; font-weight:600;">{l.username}</span>'
            f'<span style="color:#6366f1; background:rgba(99,102,241,0.1); padding:2px 8px; border-radius:4px; font-size:.7rem;">{l.action}</span>'
            f'<span style="color:#64748b;">{l.timestamp.strftime("%Y-%m-%d %H:%M")}</span>'
            f'</div>' for l in logs
        ])
    except Exception as e:
        log_rows = f'<div style="color:#ef4444; padding:20px; text-align:center;">Failed to fetch logs: {str(e)}</div>'
    finally:
        db.close()

    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>CityPulse Smart City API</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet"/>
<style>
  *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ font-family: 'Inter', sans-serif; background: #0a0f1e; color: #e2e8f0; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }}
  .wrap {{ max-width: 860px; width: 100%; }}
  .hero {{ background: linear-gradient(135deg, #1e1b4b, #312e81, #1e40af); border-radius: 20px; padding: 48px 40px 36px; margin-bottom: 24px; position: relative; overflow: hidden; }}
  .hero::before {{ content:''; position:absolute; width:300px; height:300px; background:#6366f1; border-radius:50%; filter:blur(100px); opacity:0.2; top:-80px; right:-80px; }}
  .badge {{ display:inline-flex; align-items:center; gap:6px; background:rgba(34,197,94,0.15); border:1px solid rgba(34,197,94,0.4); color:#4ade80; font-size:.75rem; font-weight:700; padding:5px 14px; border-radius:999px; margin-bottom:18px; }}
  .badge span {{ width:7px; height:7px; background:#4ade80; border-radius:50%; animation: pulse 1.5s infinite; display:inline-block; }}
  @keyframes pulse {{ 0%,100%{{opacity:1;transform:scale(1)}} 50%{{opacity:.5;transform:scale(1.3)}} }}
  h1 {{ font-size: 2.4rem; font-weight: 800; line-height:1.2; margin-bottom: 10px; }}
  h1 span {{ background: linear-gradient(90deg, #a78bfa, #60a5fa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }}
  .sub {{ color: rgba(255,255,255,.6); font-size:.95rem; line-height:1.6; margin-bottom:28px; }}
  .btns {{ display:flex; gap:12px; flex-wrap:wrap; }}
  .btn {{ padding:12px 24px; border-radius:10px; text-decoration:none; font-weight:700; font-size:.9rem; transition:all .2s; display:inline-flex; align-items:center; gap:8px; cursor:pointer; border:none; }}
  .btn-primary {{ background:#6366f1; color:#fff; box-shadow:0 4px 16px rgba(99,102,241,0.4); }}
  .btn-primary:hover {{ background:#4f46e5; transform:translateY(-2px); }}
  .btn-outline {{ background:rgba(255,255,255,.08); color:#e2e8f0; border:1px solid rgba(255,255,255,.2); }}
  .btn-outline:hover {{ background:rgba(255,255,255,.15); transform:translateY(-2px); }}
  .grid {{ display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:14px; margin-bottom:24px; }}
  .card {{ background:#111827; border:1px solid rgba(255,255,255,.08); border-radius:14px; padding:20px; transition:border-color .2s; }}
  .card:hover {{ border-color:rgba(99,102,241,.5); }}
  .card-icon {{ font-size:1.8rem; margin-bottom:10px; }}
  .endpoints {{ background:#111827; border:1px solid rgba(255,255,255,.08); border-radius:14px; padding:24px; }}
  .ep-title {{ font-size:1rem; font-weight:700; margin-bottom:16px; display:flex; align-items:center; gap:8px; }}
  .ep-row {{ display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid rgba(255,255,255,.05); font-size:.82rem; }}
  .method {{ padding:3px 9px; border-radius:5px; font-weight:700; font-size:.7rem; min-width:46px; text-align:center; }}
  .get {{ background:rgba(34,197,94,.15); color:#4ade80; }}
  .post {{ background:rgba(99,102,241,.15); color:#a78bfa; }}
  .ep-path {{ color:#60a5fa; font-family:monospace; }}
  .ep-info {{ color:#64748b; margin-left:auto; }}
  .panel {{ display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:90%; max-width:800px; background:#0f172a; border:1px solid #334155; border-radius:24px; padding:40px; box-shadow:0 30px 60px rgba(0,0,0,.9); z-index:1000; max-height:85vh; overflow-y:auto; border: 1px solid rgba(99,102,241,0.3); }}
  .overlay {{ display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,.85); backdrop-filter:blur(8px); z-index:999; }}
  .stack-grid {{ display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin:20px 0 40px; }}
  .stack-card {{ background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:16px; }}
  .stack-label {{ font-size:.65rem; color:#94a3b8; text-transform:uppercase; font-weight:800; letter-spacing:1px; margin-bottom:8px; }}
  .stack-val {{ font-size:1rem; font-weight:700; color:#fff; }}
</style>
</head>
<body>
<div class="wrap">
  <div class="hero">
    <div class="badge"><span></span> LIVE &mdash; v3.0.0</div>
    <h1>CityPulse <span>Smart City API</span></h1>
    <p class="sub">AI-powered social media monitoring, real-time event analysis, safe route navigation, and predictive city intelligence for Bengaluru.</p>
    <div class="btns">
      <a href="/docs" class="btn btn-primary">&#128218; Swagger Docs</a>
      <a href="/redoc" class="btn btn-outline">&#128196; ReDoc</a>
      <a href="http://localhost:5175" class="btn btn-outline">&#129517; Main App</a>
      <button onclick="togglePanel()" class="btn btn-outline">&#128295; Admin</button>
    </div>
  </div>

  <div id="overlay" class="overlay" onclick="togglePanel()"></div>
  <div id="adminPanel" class="panel">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px;">
      <h2 style="font-size:1.8rem; font-weight:900; background:linear-gradient(90deg, #6366f1, #a78bfa); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">🔐 Internal Admin Intelligence</h2>
      <button onclick="togglePanel()" style="background:rgba(255,255,255,0.05); border:none; color:#94a3b8; cursor:pointer; width:36px; height:36px; border-radius:50%; font-size:1.5rem; display:flex; align-items:center; justify-content:center;">&times;</button>
    </div>

    <h3 style="font-size:.9rem; font-weight:800; color:#60a5fa; margin-bottom:16px; display:flex; align-items:center; gap:8px;">🛠️ PROJECT TECHNOLOGY STACK</h3>
    <div class="stack-grid">
      <div class="stack-card"><div class="stack-label">Frontend</div><div class="stack-val">React 18 + Vite</div></div>
      <div class="stack-card"><div class="stack-label">Backend</div><div class="stack-val">FastAPI + Python</div></div>
      <div class="stack-card"><div class="stack-label">Database</div><div class="stack-val">SQLite (local)</div></div>
      <div class="stack-card"><div class="stack-label">AI Intelligence</div><div class="stack-val">Gemini AI Pro</div></div>
      <div class="stack-card"><div class="stack-label">Geospatial</div><div class="stack-val">OSRM + Leaflet</div></div>
      <div class="stack-card"><div class="stack-label">State Management</div><div class="stack-val">React Hooks</div></div>
    </div>

    <h3 style="font-size:.9rem; font-weight:800; color:#60a5fa; margin-bottom:16px; display:flex; align-items:center; gap:8px;">📋 LATEST LOGIN PERSISTENCE (DB)</h3>
    <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.05); border-radius:16px; padding:20px;">
      <div style="display:flex; justify-content:space-between; padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); margin-bottom:8px; font-size:.7rem; color:#64748b; font-weight:800; text-transform:uppercase;">
        <span>User / Identity</span>
        <span>Action</span>
        <span>Timestamp</span>
      </div>
      {log_rows}
    </div>
  </div>

  <div class="grid">
    <div class="card"><div class="card-icon">&#128225;</div><div style="font-size:.95rem; font-weight:700; margin-bottom:4px; color:#f1f5f9;">Social Collection</div><div style="font-size:.78rem; color:#64748b; line-height:1.5;">6-Phase pipeline: Twitter, Instagram, Google News, AI (Gemini) analysis.</div></div>
    <div class="card"><div class="card-icon">&#128506;&#65039;</div><div style="font-size:.95rem; font-weight:700; margin-bottom:4px; color:#f1f5f9;">Smart Navigation</div><div style="font-size:.78rem; color:#64748b; line-height:1.5;">Hazard scoring via live traffic and incident data feeds.</div></div>
    <div class="card"><div class="card-icon">&#129302;</div><div style="font-size:.95rem; font-weight:700; margin-bottom:4px; color:#f1f5f9;">AI Predictions</div><div style="font-size:.78rem; color:#64748b; line-height:1.5;">Gemini AI classifies severity and city impact radius.</div></div>
    <div class="card"><div class="card-icon">&#128100;</div><div style="font-size:.95rem; font-weight:700; margin-bottom:4px; color:#f1f5f9;">User Auth</div><div style="font-size:.78rem; color:#64748b; line-height:1.5;">Secure registration with session-based audit logging.</div></div>
  </div>

  <div class="endpoints">
    <div class="ep-title">&#9889; Core API Endpoints</div>
    <div class="ep-row"><span class="method get">GET</span><span class="ep-path">/events/</span><span class="ep-info">List all city events</span></div>
    <div class="ep-row"><span class="method post">POST</span><span class="ep-path">/collection/fetch-all</span><span class="ep-info">Run AI social workflow</span></div>
    <div class="ep-row"><span class="method get">GET</span><span class="ep-path">/users/logs</span><span class="ep-info">Fetch system audit logs</span></div>
  </div>

  <div style="text-align:center; margin-top:32px; font-size:.8rem; color:#475569;">CityPulse Platform &middot; Bengaluru, 2026 &middot; Backend Powered by FastAPI</div>
</div>
<script>
function togglePanel() {{
  const p = document.getElementById('adminPanel');
  const o = document.getElementById('overlay');
  const show = p.style.display === 'block';
  p.style.display = show ? 'none' : 'block';
  o.style.display = show ? 'none' : 'block';
}}
</script>
</body>
</html>
"""
