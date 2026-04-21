#!/bin/bash

echo "🚀 UGC Video Generator - Quick Start"
echo "======================================"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.9+"
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+"
    exit 1
fi

# Check FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  FFmpeg not found. Install with: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)"
fi

echo "✅ Dependencies OK"
echo ""

# Setup Backend
echo "📦 Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt
mkdir -p assets/audio assets/images assets/output

echo "✅ Backend ready at http://localhost:8000"
echo ""

# Start backend in background
uvicorn main:app --reload &
BACKEND_PID=$!

cd ..

# Setup Frontend
echo "⚡ Setting up frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    npm install -q
fi

echo "✅ Frontend ready at http://localhost:5173"
echo ""

# Start frontend
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "🎉 All services running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for user to stop
wait
