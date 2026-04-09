@echo off
title 🛡️ CityPulse - PRODUCTION MASTER RUNNER (v8.0)
color 0B
cls

echo.
echo  ==============================================================
echo   🏙️  CITYPULSE : BENGALURU URBAN INTELLIGENCE PLATFORM
echo   📍 PRODUCTION MODE - FIXED IP: 127.0.0.1
echo  ==============================================================
echo.

REM ── Step 1: Verify Dependencies ───────────────────────
echo  [1/5] Verifying System Dependencies...
cd /d "%~dp0backend"
call ..\.venv\Scripts\activate
pip install -r requirements.txt --quiet
pip install firebase-admin --quiet

REM ── Step 2: Auto-Create Demo Accounts ────────────────
echo  [2/5] Initializing SQLite Database & Demo Admin...
python -c "from database import SessionLocal; import models; import hashlib; db=SessionLocal(); email='admin@citypulse.gov'; pw_hash=hashlib.sha256('admin123'.encode()).hexdigest(); user=db.query(models.User).filter(models.User.email==email).first(); [db.add(models.User(name='Internal Admin', email=email, password=pw_hash, role='admin', phone='9999999999')) if not user else None]; db.commit(); print('✔️ Database Ready.')"

REM ── Step 3: Start Backend ────────────────────────────
echo  [3/5] Starting Backend @ http://127.0.0.1:8000
start "🛡️ Backend (API)" cmd /k "color 0B && echo BACKEND ACTIVE && python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

REM Wait for Backend to warm up
timeout /t 5 /nobreak >nul

REM ── Step 4: Start User Interface ──────────────────────
echo  [4/5] Starting Citizen App @ http://127.0.0.1:5177
cd /d "%~dp0react-ui"
start "📍 Citizen UI" cmd /k "color 0D && echo USER UI ACTIVE && npm run dev -- --host 127.0.0.1 --port 5177"

REM ── Step 5: Start Admin Dashboard ────────────────────
echo  [5/5] Starting Admin Control @ http://127.0.0.1:5171
cd /d "%~dp0admin-dashboard"
start "🔓 Admin UI" cmd /k "color 0E && echo ADMIN UI ACTIVE && npm run dev -- --host 127.0.0.1 --port 5171"

echo.
echo  ==============================================================
echo   ✅ PLATFORM SUCCESSFULY LAUNCHED
echo  ==============================================================
echo   Citizen Hub : http://127.0.0.1:5177
echo   Admin Panel : http://127.0.0.1:5171
echo   API Swagger : http://127.0.0.1:8000/docs
echo.
echo   LOGIN: admin@citypulse.gov / admin123
echo  ==============================================================
timeout /t 5 >nul
exit
