# UGC Video Generator

A full-stack app that generates UGC-style videos from images and a text script.  
**Backend:** FastAPI (Python) · **Frontend:** React + Vite

---

## Project Structure

```
ugc-video-generator/
├── backend/
│   ├── main.py          ← FastAPI app (CORS, all endpoints)
│   ├── tts.py           ← Google Text-to-Speech
│   ├── video.py         ← MoviePy video builder
│   ├── utils.py         ← Script splitter
│   ├── requirements.txt
│   └── assets/          ← Auto-created: audio/, images/, output/
└── frontend/
    ├── src/
    │   ├── api.js        ← All API calls in one place
    │   ├── pages/
    │   │   ├── Create.jsx   ← Main generation UI (fully wired)
    │   │   └── Videos.jsx   ← View & download generated video
    │   └── components/
    │       └── UploadBox.jsx ← Real drag-and-drop upload
    ├── vite.config.js    ← Proxy: /api → http://localhost:8000
    └── package.json
```

---

## Setup & Run

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Runs on http://localhost:8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## How It Works

1. **Upload Images** — drag & drop actor/product images in the Assets card.  
   They are sent to `POST /upload-images` and saved in `backend/assets/images/`.

2. **Write Script** — scenes are detected in real-time via `POST /split`.

3. **Click "Generate Video"** — three steps run in sequence:
   - `POST /audio` → gTTS converts the script to `assets/audio/voice.mp3`
   - `GET /video`  → MoviePy stitches images into `assets/output/video.mp4`
   - `GET /final`  → Audio + video merged into `assets/output/final.mp4`

4. **Preview & Download** — the final video plays inline; download via `GET /download`.

---

## API Endpoints

| Method | Path             | Description                          |
|--------|------------------|--------------------------------------|
| GET    | `/`              | Health check                         |
| GET    | `/status`        | Asset readiness flags                |
| POST   | `/upload-images` | Upload image files (multipart/form)  |
| POST   | `/split`         | Split script text into scenes        |
| POST   | `/audio`         | Generate TTS audio from text         |
| GET    | `/video`         | Build silent video from images       |
| GET    | `/final`         | Merge audio + video                  |
| GET    | `/download`      | Stream final.mp4 for download        |
