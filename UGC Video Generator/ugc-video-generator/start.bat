@echo off
setlocal enabledelayedexpansion

echo 🚀 UGC Video Generator - Quick Start
echo ======================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.9+
    exit /b 1
)

REM Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 16+
    exit /b 1
)

REM Check FFmpeg
ffmpeg -version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  FFmpeg not found. Download from https://ffmpeg.org/download.html
)

echo ✅ Dependencies OK
echo.

REM Setup Backend
echo 📦 Setting up backend...
cd backend

if not exist "venv" (
    python -m venv venv
)

call venv\Scripts\activate.bat
pip install -q -r requirements.txt
if not exist "assets\audio" mkdir assets\audio
if not exist "assets\images" mkdir assets\images
if not exist "assets\output" mkdir assets\output

echo ✅ Backend ready at http://localhost:8000
echo.

REM Start backend in new window
start "UGC Backend" cmd /k "cd backend && venv\Scripts\activate.bat && uvicorn main:app --reload"

cd ..

timeout /t 3 /nobreak

REM Setup Frontend
echo ⚡ Setting up frontend...
cd frontend

if not exist "node_modules" (
    npm install -q
)

echo ✅ Frontend ready at http://localhost:5173
echo.

REM Start frontend in new window
start "UGC Frontend" cmd /k "npm run dev"

cd ..

echo.
echo 🎉 All services launching!
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:8000
echo.
echo Close the terminal windows to stop services
echo.

pause
