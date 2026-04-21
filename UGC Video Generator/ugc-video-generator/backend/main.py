from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import shutil
import os

import tts
import utils
import video

app = FastAPI()

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Data(BaseModel):
    text: str

# ─── Health ───────────────────────────────────────────────────────────────────
@app.get("/")
def home():
    return {"msg": "Server running"}

# ─── Split script into scenes ─────────────────────────────────────────────────
@app.post("/split")
def split(data: Data):
    result = utils.split_text(data.text)
    return {"scenes": result}

# ─── Upload images ────────────────────────────────────────────────────────────
@app.post("/upload-images")
async def upload_images(files: list[UploadFile] = File(...)):
    img_folder = "assets/images"
    os.makedirs(img_folder, exist_ok=True)

    # Clear existing images before uploading new ones
    for f in os.listdir(img_folder):
        os.remove(os.path.join(img_folder, f))

    saved = []
    for file in files:
        dest = os.path.join(img_folder, file.filename)
        with open(dest, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        saved.append(file.filename)

    return {"uploaded": saved}

# ─── Generate TTS audio ───────────────────────────────────────────────────────
@app.post("/audio")
def make_audio(data: Data):
    path = tts.make_tts(data.text)
    return {"audio": path}

# ─── Build silent video from images ──────────────────────────────────────────
@app.get("/video")
def make_video():
    result = video.make_video()
    if result == "no_images":
        return {"error": "No images found. Please upload images first."}
    return {"msg": "Video created"}

# ─── Merge audio + video into final output ────────────────────────────────────
@app.get("/final")
def final_video():
    result = video.merge_audio()
    if result == "missing_files":
        return {"error": "Missing video or audio file."}
    return {"msg": "Final video ready"}

# ─── Download final video ─────────────────────────────────────────────────────
@app.get("/download")
def download():
    path = "assets/output/final.mp4"
    if not os.path.exists(path):
        return {"error": "Final video not found. Generate it first."}
    return FileResponse(path, media_type="video/mp4", filename="ugc_video.mp4")

# ─── Check status of generated assets ────────────────────────────────────────
@app.get("/status")
def status():
    return {
        "has_images": len([
            f for f in os.listdir("assets/images")
            if f.endswith((".jpg", ".jpeg", ".png"))
        ]) > 0 if os.path.exists("assets/images") else False,
        "has_audio":  os.path.exists("assets/audio/voice.mp3"),
        "has_video":  os.path.exists("assets/output/video.mp4"),
        "has_final":  os.path.exists("assets/output/final.mp4"),
    }
