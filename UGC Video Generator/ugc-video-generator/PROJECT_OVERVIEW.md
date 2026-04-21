# 🎬 UGC Video Generator - Project Overview

## What This Project Does

The **UGC Video Generator** is a full-stack web application that automates the creation of UGC (User-Generated Content) style videos. It combines images, voice, and motion to produce polished short-form videos.

### Core Workflow
1. **Upload Images** → drag and drop product/actor photos
2. **Write Script** → compose a sales pitch or product description  
3. **Generate Voice** → Google Text-to-Speech converts script to audio
4. **Build Video** → images are stitched together with transitions
5. **Merge** → audio and video combined into final output
6. **Download** → download the ready-to-post video

---

## 🏗 Architecture

### Backend (FastAPI + Python)
- **Framework:** FastAPI (async, fast, auto-docs)
- **Video Processing:** MoviePy (image-to-video conversion)
- **Text-to-Speech:** gTTS (Google Text-to-Speech)
- **Server:** Uvicorn ASGI server
- **Endpoints:** 8 REST APIs for all operations

### Frontend (React + Vite)
- **Framework:** React 19 with hooks
- **Build Tool:** Vite (lightning-fast dev/build)
- **Router:** React Router v7 for navigation
- **Animation:** Framer Motion for smooth UI transitions
- **Icons:** Lucide React (36+ UI icons)
- **Styling:** Custom CSS with dark theme
- **State:** React hooks (useState)

### Networking
- **Frontend → Backend:** Vite proxy at `/api` → `http://localhost:8000`
- **CORS:** Enabled for localhost development
- **File Upload:** Multipart form-data for images
- **File Download:** HTTP streaming for video download

---

## ✨ Key Features (Fully Integrated)

### 🎨 User Interface
- **Dark theme** with purple/blue gradient accents
- **Responsive layout** (3-column grid on desktop, 1 column on mobile)
- **Smooth animations** using Framer Motion
- **Real-time feedback** (upload progress, generation status)
- **Live scene preview** (scenes detected as you type script)
- **Video preview** (inline player in Create tab)
- **Download link** (appears after video generation)

### 🔄 Backend Capabilities
- **Image Upload** → multipart form handling, auto-save to `assets/images/`
- **Script Splitting** → sentence detection, scene enumeration
- **TTS Generation** → gTTS conversion, MP3 output
- **Video Building** → MoviePy image sequencing (3 sec per image)
- **Audio Merging** → FFmpeg audio+video mux
- **File Streaming** → `/download` endpoint for video delivery
- **Status Tracking** → `/status` shows readiness of all assets
- **Error Handling** → meaningful error messages for each step

### 🎯 UI/UX Elements
- **4 navigation tabs:** Create, My Videos, Actors Library, Settings
- **Drag-and-drop upload** with visual feedback
- **Real-time character counter** for script
- **Emotion selection** (Excited, Professional, Friendly)
- **Language dropdown** (English, Hindi)
- **Video ratio buttons** (9:16 mobile, 16:9 desktop)
- **Toggle switches** (Watermark, HD quality)
- **Loading spinner** during generation
- **Error messages** displayed inline
- **Download button** appears after success

---

## 📊 Technical Stack Summary

| Layer    | Technology       | Purpose                        |
|----------|------------------|--------------------------------|
| Frontend | React 19         | UI components & state          |
| Build    | Vite             | Fast bundling & dev server     |
| Routing  | React Router v7  | Page navigation                |
| Animation| Framer Motion    | Smooth transitions             |
| Icons    | Lucide React     | SVG icon library               |
| Backend  | FastAPI          | REST API framework             |
| Server   | Uvicorn          | ASGI application server        |
| Video    | MoviePy          | Image→video conversion         |
| TTS      | gTTS             | Text→speech synthesis          |
| Encoding | FFmpeg           | Video codec handling           |
| Deploy   | Docker           | Containerization (optional)    |

---

## 🚀 Getting Started

### Quickest Way (Unix/Mac/Linux)
```bash
chmod +x start.sh
./start.sh
```

### Windows
```cmd
start.bat
```

### Manual Setup
```bash
# Terminal 1: Backend
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload

# Terminal 2: Frontend
cd frontend && npm install && npm run dev
```

### Docker (Single Command)
```bash
docker-compose up
```

**Then open:** http://localhost:5173

---

## 📁 Project Files

### Backend Files
- `main.py` — All endpoints (250 lines)
- `tts.py` — TTS wrapper (10 lines)
- `video.py` — Video builder (40 lines)
- `utils.py` — Text splitting (8 lines)
- `requirements.txt` — Dependencies
- `Dockerfile` — Container build
- `assets/` — Auto-created runtime folders

### Frontend Files
- `src/api.js` — API client (all fetch calls)
- `src/App.jsx` — Router & layout
- `src/index.css` — Styles (500+ lines, all vars)
- `src/pages/Create.jsx` — Main UI (220 lines, fully wired)
- `src/pages/Videos.jsx` — Video viewer
- `src/components/UploadBox.jsx` — Drag-drop uploader
- `src/components/Sidebar.jsx` — Navigation
- `vite.config.js` — Dev proxy config
- `package.json` — Dependencies
- `Dockerfile` — Container build

### Config Files
- `docker-compose.yml` — Multi-container orchestration
- `.gitignore` — Git exclusions
- `SETUP_GUIDE.md` — Detailed setup instructions
- `README.md` — Project overview
- `start.sh` / `start.bat` — One-command setup

---

## 🔗 API Endpoints Reference

All endpoints are at `http://localhost:8000`

```
GET    /              → Health check
GET    /status        → Assets readiness status
POST   /upload-images → Upload image files
POST   /split         → Split script into scenes
POST   /audio         → Generate TTS audio
GET    /video         → Build silent video
GET    /final         → Merge audio + video
GET    /download      → Download final video
```

---

## 🎯 Workflow Example

1. User arrives at **Create page**
2. User **drags images** into upload box
   - Request: `POST /upload-images` (multipart/form-data)
   - Backend: Saves to `assets/images/`
   - Frontend: Shows "✓ 3 files uploaded"
3. User **types script** (e.g., "This is amazing. Buy now. Limited time.")
   - Request: `POST /split` (as user types)
   - Backend: Splits by periods → ["This is amazing", "Buy now", "Limited time"]
   - Frontend: Displays 3 scene chips
4. User **clicks Generate Video**
   - Step 1: `POST /audio` → generates `assets/audio/voice.mp3`
   - Step 2: `GET /video` → generates `assets/output/video.mp4`
   - Step 3: `GET /final` → generates `assets/output/final.mp4`
   - Frontend: Shows progress, displays preview, enables download
5. User **clicks Download** or previews
   - Request: `GET /download`
   - Response: Streams `final.mp4` as `ugc_video.mp4`

---

## 🎨 Customization Points

### Colors (CSS Variables)
Edit `frontend/src/index.css` `:root {}`:
- `--bg-dark`, `--bg-card`, `--bg-input` (dark theme)
- `--accent-purple`, `--accent-blue` (primary colors)

### Video Duration
Edit `backend/video.py` line ~21:
```python
clip = ImageClip(path).with_duration(3)  # seconds per image
```

### Languages (TTS)
Edit `frontend/src/pages/Create.jsx` + `backend/main.py`:
```python
tts = gTTS(text=text, lang="es")  # ISO 639-1 codes
```

### API Port
Backend default: **8000**. Change in vite.config.js proxy and docker-compose.yml

---

## 📊 Performance Notes

- **Image upload:** ~1MB per image optimal
- **Video generation:** ~10-15 seconds for 5 images
- **Audio generation:** ~5 seconds per 100 words
- **Total pipeline:** ~30 seconds for typical video

---

## ✅ What's Integrated

✓ Full backend with all endpoints  
✓ Full frontend with all pages  
✓ File upload (real drag-and-drop)  
✓ Video generation pipeline  
✓ Download system  
✓ Error handling  
✓ Loading states  
✓ CORS configuration  
✓ Docker support  
✓ Setup scripts  
✓ Documentation  

---

## 🚧 Optional Enhancements (Not Included)

These features could be added later:
- User authentication & database
- Video editing (trim, effects, filters)
- Custom watermarks
- Multiple actor templates
- API rate limiting
- Video analytics
- Social media integration
- CDN for video delivery
- Payment system for premium features

---

## 📞 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| "No module named moviepy" | `pip install moviepy` |
| "FFmpeg not found" | Install FFmpeg (brew, apt-get, or download) |
| "Cannot GET /api/..." | Ensure backend runs on :8000, Vite proxy works |
| "Upload fails" | Check backend CORS, multipart handling |
| "Video takes forever" | Normal! Reduce image count or size |

---

## 📜 License & Attribution

- **FastAPI** — Apache 2.0
- **React** — MIT  
- **MoviePy** — MIT
- **gTTS** — MIT
- **Vite** — MIT
- **Framer Motion** — MIT

---

## 🎓 Learning Resources

### Backend
- FastAPI docs: https://fastapi.tiangolo.com
- MoviePy docs: https://zulko.github.io/moviepy

### Frontend
- React hooks: https://react.dev/reference/react
- Vite guide: https://vite.dev/guide
- Framer Motion: https://www.framer.com/motion

---

**Happy video generating! 🎬✨**
