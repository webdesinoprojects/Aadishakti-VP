import { Paperclip, X } from "lucide-react";

export default function DragDropUpload({ file, setFile, label, accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx", maxSize = 10485760, id }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.size <= maxSize) {
      setFile(droppedFile);
    } else if (droppedFile) {
      alert(`File must be under ${Math.round(maxSize / 1024 / 1024)}MB`);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= maxSize) {
      setFile(selectedFile);
    } else if (selectedFile) {
      alert(`File must be under ${Math.round(maxSize / 1024 / 1024)}MB`);
    }
  };

  return (
    <div>
      {label && (
        <label
          style={{
            display: "block",
            fontFamily: "var(--font-primary)",
            fontWeight: "600",
            fontSize: "11px",
            letterSpacing: "0.15em",
            color: "var(--silver)",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          border: "2px dashed var(--border-light)",
          borderRadius: "4px",
          padding: "20px 24px",
          background: "var(--bg-secondary)",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          cursor: "pointer",
          transition: "border-color 0.2s",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById(id).click()}
      >
        <Paperclip size={20} color="var(--red-core)" style={{ flexShrink: 0 }} />
        {file ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", wordBreak: "break-all" }}>{file.name}</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>({(file.size / 1024).toFixed(1)} KB)</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center" }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, fontFamily: "var(--font-primary)" }}>
              <span style={{ fontWeight: 700, color: "var(--red-core)" }}>Drag & drop</span> or <span style={{ fontWeight: 700, color: "var(--red-core)" }}>click to upload</span>
            </p>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "4px 0 0", fontFamily: "var(--font-primary)" }}>
              {accept.replace(/\./g, "").toUpperCase()} — Max {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
        )}
      </div>
      <input
        id={id}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
