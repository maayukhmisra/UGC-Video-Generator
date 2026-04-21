# UGC Video Generator — Complete Setup Guide

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.9+
- Node.js 16+
- FFmpeg (for video processing)

### Step 1: Install FFmpeg

**macOS (Homebrew):**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get install ffmpeg
```

**Windows (Chocolatey):**
```bash
choco install ffmpeg
```

Or download from: https://ffmpeg.org/download.html

---

### Step 2: Setup Backend

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run backend
uvicorn main:app --reload
```

✅ Backend running at: **http://localhost:8000**

Test health: `curl http://localhost:8000/`

---

### Step 3: Setup Frontend

In a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

Open **http://localhost:5173** in your browser!

---

## 📦 Using Docker (One Command)

```bash
docker-compose up
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173

Stop: `docker-compose down`

---

## 🎯 Usage Workflow

1. **Go to Create tab** → drag & drop images in "Assets"
2. **Write your script** → scenes auto-detect as you type
3. **Select emotion, language, aspect ratio** → customize look
4. **Click "Generate Video"** → sits back, wait ~30 seconds
5. **Preview video** → download when ready!

---

## 🔧 Backend API Reference

### `/status` (GET)
Returns readiness of audio, video, and final.mp4

```bash
curl http://localhost:8000/status
```

### `/upload-images` (POST)
Upload image files (multipart/form-data)

```bash
curl -F "files=@image1.jpg" -F "files=@image2.jpg" http://localhost:8000/upload-images
```

### `/split` (POST)
Split script into scenes

```bash
curl -X POST http://localhost:8000/split \
  -H "Content-Type: application/json" \
  -d '{"text":"This is scene one. This is scene two."}'
```

### `/audio` (POST)
Generate TTS from text

```bash
curl -X POST http://localhost:8000/audio \
  -H "Content-Type: application/json" \
  -d '{"text":"Your script here"}'
```

### `/video` (GET)
Build video from uploaded images

```bash
curl http://localhost:8000/video
```

### `/final` (GET)
Merge audio + video

```bash
curl http://localhost:8000/final
```

### `/download` (GET)
Stream final video file

```bash
curl http://localhost:8000/download -o video.mp4
```

---

## 📂 File Structure Overview

```
ugc-video-generator/
├── backend/
│   ├── main.py              # FastAPI app (all endpoints)
│   ├── tts.py               # Google Text-to-Speech wrapper
│   ├── video.py             # MoviePy video builder
│   ├── utils.py             # Text splitting utility
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile           # Docker build config
│   └── assets/              # Auto-created during runtime
│       ├── audio/           # Generated MP3 files
│       ├── images/          # Uploaded images
│       └── output/          # Generated videos
│
├── frontend/
│   ├── src/
│   │   ├── api.js           # API client (all fetch calls)
│   │   ├── App.jsx          # Router & layout
│   │   ├── index.css        # Global styles (dark theme)
│   │   ├── pages/
│   │   │   ├── Create.jsx   # Main generation interface
│   │   │   ├── Videos.jsx   # View generated videos
│   │   │   ├── Actors.jsx   # Placeholder
│   │   │   └── Settings.jsx # Placeholder
│   │   └── components/
│   │       ├── Sidebar.jsx  # Navigation
│   │       ├── Card.jsx     # Reusable card component
│   │       ├── Toggle.jsx   # Toggle switches
│   │       └── UploadBox.jsx# Drag-drop uploader (wired)
│   ├── vite.config.js       # Dev proxy config
│   ├── package.json         # NPM dependencies
│   ├── Dockerfile           # Docker build config
│   └── index.html           # Entry point
│
├── docker-compose.yml       # One-command Docker setup
└── README.md                # Project overview
```

---

## 🛠 Troubleshooting

### "MoviePy error: imageio video write..."
→ Make sure FFmpeg is installed and in PATH

### "Connection refused" / Backend not responding
→ Ensure backend runs on port 8000. Check: `lsof -i :8000`

### "Failed to fetch /api/upload-images"
→ Backend CORS might be blocking. Check vite.config.js proxy is set correctly.

### "No images found" error
→ Upload images first in the Assets card before generating video.

### Large video taking too long
→ Reduce image count or use smaller images. Each image duration is 3 seconds by default.

---

## 🎨 Customization

### Change video duration per image
Edit `backend/video.py`, line ~21:
```python
clip = ImageClip(path).with_duration(3)  # Change 3 to desired seconds
```

### Add more languages
Edit `frontend/src/pages/Create.jsx`, add to language dropdown:
```jsx
<option>Spanish</option>
<option>French</option>
```

Then update backend TTS if needed:
```python
tts = gTTS(text=text, lang="es")  # "es" for Spanish
```

### Customize styling
Edit `frontend/src/index.css` — all colors/spacing use CSS variables in `:root {}`

---

## 📝 Environment Variables (Optional)

Create `.env` file in project root if needed for production:

```
VITE_API_URL=http://localhost:8000
REACT_APP_API_BASE=http://localhost:8000
```

---

## 🚀 Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
# Creates dist/ folder → deploy to any static host (Vercel, Netlify, etc.)
```

### Deploy Backend
Use Gunicorn + Nginx, or Docker:
```bash
docker build -t ugc-backend ./backend
docker run -p 8000:8000 ugc-backend
```

---

## 📞 Support

- **Backend errors?** Check terminal where `uvicorn` is running
- **Frontend errors?** Open browser DevTools (F12) → Console tab
- **Video generation fails?** Check backend `/status` endpoint

---

## 📜 License

MIT License — feel free to use and modify!
