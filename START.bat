@echo off
title CityPulse - Smart City Monitor
color 0A

echo.
echo  ============================================
echo   CityPulse Smart City Monitor v3.0
echo   Bengaluru Safety Intelligence Platform
echo  ============================================
echo.

REM ── Check Python ──────────────────────────────
python --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Python not found. Install from https://python.org
    pause & exit /b 1
)

REM ── Check Node ────────────────────────────────
node --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js not found. Install from https://nodejs.org
    pause & exit /b 1
)

echo  [1/4] Installing Python dependencies...
cd /d "%~dp0"
pip install -r requirements.txt -q
echo       Done.

echo  [2/4] Installing React dependencies...
cd /d "%~dp0react-ui"
if not exist "node_modules" (
    npm install --legacy-peer-deps -q
)
echo       Done.

echo  [3/4] Starting FastAPI Backend on port 8000...
cd /d "%~dp0"
start "CityPulse Backend" cmd /k "color 0B && echo  Backend running at http://127.0.0.1:8000 && echo  API Docs at http://127.0.0.1:8000/docs && echo. && python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak >nul

echo  [4/4] Starting React Frontend on port 5173...
cd /d "%~dp0react-ui"
start "CityPulse Frontend" cmd /k "color 0D && echo  Frontend running at http://localhost:5173 && echo. && npm run dev"

REM Wait 4 seconds then open browser
timeout /t 4 /nobreak >nul

echo.
echo  ============================================
echo   Both servers are starting...
echo.
echo   Frontend :  http://localhost:5173
echo   Backend  :  http://localhost:8000
echo   API Docs :  http://localhost:8000/docs
echo  ============================================
echo.

start http://localhost:5173
echo  Browser opening...
echo  Press any key to close this launcher.
pause >nul
