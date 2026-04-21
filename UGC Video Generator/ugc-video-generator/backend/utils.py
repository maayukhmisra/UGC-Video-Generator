def split_text(text):
    parts = text.split(".")
    scenes = []
    for p in parts:
        p = p.strip()
        if p:
            scenes.append(p)
    return scenes
