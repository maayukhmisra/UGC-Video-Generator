from gtts import gTTS
import os

def make_tts(text):
    folder = "assets/audio"
    os.makedirs(folder, exist_ok=True)

    file_path = os.path.join(folder, "voice.mp3")
    tts = gTTS(text=text, lang="en")
    tts.save(file_path)

    return file_path
