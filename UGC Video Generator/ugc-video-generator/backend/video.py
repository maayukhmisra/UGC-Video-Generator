import os
from moviepy import ImageClip, concatenate_videoclips, VideoFileClip, AudioFileClip

def make_video():
    img_folder = "assets/images"
    out_folder = "assets/output"
    os.makedirs(out_folder, exist_ok=True)

    if not os.path.exists(img_folder):
        return "no_images"

    files = sorted(os.listdir(img_folder))
    clips = []

    for f in files:
        if f.lower().endswith((".jpg", ".jpeg", ".png")):
            path = os.path.join(img_folder, f)
            clip = ImageClip(path).with_duration(3)
            clips.append(clip)

    if len(clips) == 0:
        return "no_images"

    video = concatenate_videoclips(clips, method="compose")
    video.write_videofile(os.path.join(out_folder, "video.mp4"), fps=24)
    return "ok"


def merge_audio():
    video_path = "assets/output/video.mp4"
    audio_path = "assets/audio/voice.mp3"

    if not os.path.exists(video_path) or not os.path.exists(audio_path):
        return "missing_files"

    vid = VideoFileClip(video_path)
    aud = AudioFileClip(audio_path)

    final = vid.with_audio(aud)
    final.write_videofile("assets/output/final.mp4", fps=24)
    return "ok"
