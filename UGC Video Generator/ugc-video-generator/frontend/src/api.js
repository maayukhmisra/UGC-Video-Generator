const BASE = "/api";

// ── Check server status ────────────────────────────────────────────────────
export async function getStatus() {
  const res = await fetch(`${BASE}/status`);
  return res.json();
}

// ── Upload images to backend ───────────────────────────────────────────────
export async function uploadImages(files) {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }
  const res = await fetch(`${BASE}/upload-images`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

// ── Split script into scenes ───────────────────────────────────────────────
export async function splitScript(text) {
  const res = await fetch(`${BASE}/split`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
}

// ── Generate TTS audio ─────────────────────────────────────────────────────
export async function generateAudio(text) {
  const res = await fetch(`${BASE}/audio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
}

// ── Build silent video from images ─────────────────────────────────────────
export async function buildVideo() {
  const res = await fetch(`${BASE}/video`);
  return res.json();
}

// ── Merge audio + video ────────────────────────────────────────────────────
export async function mergeFinal() {
  const res = await fetch(`${BASE}/final`);
  return res.json();
}

// ── Download URL (used directly in <video> src or <a> href) ────────────────
export const downloadUrl = `${BASE}/download`;
