import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../components/Card";
import Toggle from "../components/Toggle";
import UploadBox from "../components/UploadBox";
import {
  splitScript,
  generateAudio,
  buildVideo,
  mergeFinal,
  downloadUrl,
} from "../api";

const STEPS = [
  { id: "audio",  label: "Generating voice…" },
  { id: "video",  label: "Building video from images…" },
  { id: "final",  label: "Merging audio & video…" },
  { id: "done",   label: "Done!" },
];

export default function Create() {
  const [script, setScript]     = useState("");
  const [emotion, setEmotion]   = useState("Excited");
  const [language, setLanguage] = useState("English");
  const [watermark, setWatermark] = useState(true);
  const [hd, setHd]             = useState(true);
  const [ratio, setRatio]       = useState("9:16");

  const [scenes, setScenes]     = useState([]);
  const [step, setStep]         = useState(null);   // null | step id
  const [error, setError]       = useState("");
  const [videoReady, setVideoReady] = useState(false);
  const [imagesUploaded, setImagesUploaded] = useState(false);

  // ── Preview scenes while typing ───────────────────────────────────────────
  async function handleScriptChange(val) {
    setScript(val);
    if (val.trim().length > 10) {
      const data = await splitScript(val).catch(() => null);
      if (data?.scenes) setScenes(data.scenes);
    } else {
      setScenes([]);
    }
  }

  // ── Main generation pipeline ──────────────────────────────────────────────
  async function generate() {
    setError("");
    setVideoReady(false);

    if (!script.trim()) {
      setError("Please write a script first.");
      return;
    }
    if (!imagesUploaded) {
      setError("Please upload at least one image first.");
      return;
    }

    try {
      // 1. TTS
      setStep("audio");
      const audioRes = await generateAudio(script);
      if (audioRes.error) throw new Error(audioRes.error);

      // 2. Video from images
      setStep("video");
      const videoRes = await buildVideo();
      if (videoRes.error) throw new Error(videoRes.error);

      // 3. Merge
      setStep("final");
      const finalRes = await mergeFinal();
      if (finalRes.error) throw new Error(finalRes.error);

      setStep("done");
      setVideoReady(true);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setStep(null);
    }
  }

  const isGenerating = step !== null && step !== "done";
  const currentStepLabel = STEPS.find((s) => s.id === step)?.label ?? "";

  return (
    <div className="dashboard-grid">
      {/* ── Assets ──────────────────────────────────────────────────────── */}
      <Card title="Assets">
        <UploadBox
          label="Actor / Product Image(s)"
          onUploaded={(files) => setImagesUploaded(files.length > 0)}
        />
        {imagesUploaded && (
          <p className="upload-success">✓ Images ready for video generation</p>
        )}
      </Card>

      {/* ── AI Configuration ─────────────────────────────────────────────── */}
      <Card title="AI Configuration">
        <textarea
          value={script}
          onChange={(e) => handleScriptChange(e.target.value)}
          className="input-field"
          placeholder="Write your script here. Each sentence becomes a scene."
          rows={5}
        />
        <p className="char-count">{script.length} characters</p>

        {scenes.length > 0 && (
          <div className="scenes-preview">
            <p className="scenes-label">Scenes detected: {scenes.length}</p>
            {scenes.map((s, i) => (
              <div key={i} className="scene-chip">
                <span className="scene-number">{i + 1}</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}

        <div className="input-group">
          <select
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            className="input-field"
          >
            <option>Excited</option>
            <option>Professional</option>
            <option>Friendly</option>
          </select>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field"
          >
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>

        <div className="controls-row">
          <Toggle label="Watermark" state={watermark} setState={setWatermark} />
          <Toggle label="HD" state={hd} setState={setHd} />
        </div>

        <div className="ratio-container">
          <button
            onClick={() => setRatio("9:16")}
            className={`ratio-btn ${ratio === "9:16" ? "active" : ""}`}
          >
            9:16
          </button>
          <button
            onClick={() => setRatio("16:9")}
            className={`ratio-btn ${ratio === "16:9" ? "active" : ""}`}
          >
            16:9
          </button>
        </div>
      </Card>

      {/* ── Preview & Generate ───────────────────────────────────────────── */}
      <Card title="Preview">
        <div className="preview-container">
          <AnimatePresence mode="wait">
            {videoReady ? (
              <motion.div
                key="video"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="preview-video-wrapper"
              >
                <video
                  src={downloadUrl}
                  controls
                  className="preview-video"
                  style={{ width: "100%", borderRadius: "0.5rem", maxHeight: 320 }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="preview-box"
                style={{ width: ratio === "9:16" ? 180 : 280, height: ratio === "9:16" ? 320 : 180 }}
              >
                {isGenerating ? (
                  <div className="gen-status">
                    <div className="upload-spinner" />
                    <p>{currentStepLabel}</p>
                  </div>
                ) : (
                  "No Preview"
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {error && <p className="error-msg">{error}</p>}

          <div className="btn-row">
            <motion.button
              whileHover={{ scale: isGenerating ? 1 : 1.05 }}
              onClick={generate}
              className="btn-primary"
              disabled={isGenerating}
              style={{ opacity: isGenerating ? 0.6 : 1 }}
            >
              {isGenerating ? "Generating…" : "Generate Video"}
            </motion.button>

            {videoReady && (
              <motion.a
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                href={downloadUrl}
                download="ugc_video.mp4"
                className="btn-secondary"
              >
                ⬇ Download
              </motion.a>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
