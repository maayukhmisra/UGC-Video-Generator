import { useRef, useState } from "react";
import { Upload, CheckCircle } from "lucide-react";
import { uploadImages } from "../api";

export default function UploadBox({ label, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  async function handleFiles(files) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const data = await uploadImages(Array.from(files));
      setUploaded(data.uploaded || []);
      if (onUploaded) onUploaded(data.uploaded);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div
      className={`upload-box ${dragging ? "dragging" : ""}`}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {uploading ? (
        <>
          <div className="upload-spinner" />
          <p>Uploading...</p>
        </>
      ) : uploaded.length > 0 ? (
        <>
          <CheckCircle size={24} color="#a855f7" />
          <p style={{ color: "#a855f7" }}>
            {uploaded.length} file{uploaded.length > 1 ? "s" : ""} uploaded
          </p>
          <p style={{ fontSize: "0.7rem", color: "#71717a" }}>Click to replace</p>
        </>
      ) : (
        <>
          <Upload size={24} />
          <p>Drag &amp; drop {label}</p>
          <p style={{ fontSize: "0.7rem", color: "#71717a" }}>or click to browse</p>
        </>
      )}
    </div>
  );
}
