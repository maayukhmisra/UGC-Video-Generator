import { useEffect, useState } from "react";
import { Film, Download } from "lucide-react";
import { getStatus, downloadUrl } from "../api";

export default function Videos() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getStatus()
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  if (!status) {
    return <p className="page-placeholder">Checking for videos…</p>;
  }

  if (!status.has_final) {
    return (
      <div className="page-placeholder">
        <Film size={40} style={{ color: "#3f3f46", marginBottom: "1rem" }} />
        <p>No videos yet. Head to <strong>Create</strong> to generate one.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ color: "#a855f7", marginBottom: "1.5rem", fontWeight: 600 }}>
        My Videos
      </h2>

      <div className="video-card">
        <video
          src={downloadUrl}
          controls
          style={{ width: "100%", borderRadius: "0.5rem", background: "#000" }}
        />
        <div className="video-card-footer">
          <span style={{ color: "#a1a1aa", fontSize: "0.875rem" }}>ugc_video.mp4</span>
          <a href={downloadUrl} download="ugc_video.mp4" className="btn-secondary">
            <Download size={14} />
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
