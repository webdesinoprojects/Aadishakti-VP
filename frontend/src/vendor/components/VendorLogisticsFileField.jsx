import { useRef, useState } from 'react';
import { FileText, UploadCloud, X } from 'lucide-react';

const maxBytes = 10 * 1024 * 1024;
const allowedExtensions = new Set(['jpg', 'jpeg', 'png', 'webp', 'pdf']);

const fileSize = (bytes) => bytes < 1024 * 1024
  ? `${Math.max(1, Math.round(bytes / 1024))} KB`
  : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export default function VendorLogisticsFileField({
  files,
  onChange,
  onError,
  multiple = false,
  label,
  hint,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const selectFiles = (incoming) => {
    const candidates = Array.from(incoming || []);
    if (!candidates.length) return;
    const invalid = candidates.find((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return !allowedExtensions.has(extension) || file.size > maxBytes;
    });
    if (invalid) {
      onError('Choose JPG, PNG, WebP or PDF files up to 10 MB each.');
      return;
    }
    const next = multiple ? [...files, ...candidates].slice(0, 3) : [candidates[0]];
    if (multiple && files.length + candidates.length > 3) onError('You can attach up to 3 stage proofs.');
    onChange(next);
  };

  const removeFile = (index) => onChange(files.filter((_, fileIndex) => fileIndex !== index));

  return <div className="vendor-logistics-upload">
    <input
      ref={inputRef}
      type="file"
      hidden
      disabled={disabled}
      multiple={multiple}
      accept=".jpg,.jpeg,.png,.webp,.pdf"
      onChange={(event) => {
        selectFiles(event.target.files);
        event.target.value = '';
      }}
    />
    <button
      type="button"
      className={`vendor-logistics-dropzone${dragging ? ' is-dragging' : ''}`}
      disabled={disabled}
      onClick={() => inputRef.current?.click()}
      onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        event.preventDefault();
        if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        selectFiles(event.dataTransfer.files);
      }}
    >
      <span className="vendor-logistics-upload-icon"><UploadCloud size={22} /></span>
      <span><strong>{label}</strong><small>{hint}</small></span>
    </button>
    {files.length > 0 && <div className="vendor-logistics-file-list">
      {files.map((file, index) => <div className="vendor-logistics-file" key={`${file.name}-${file.lastModified}`}>
        <FileText size={18} />
        <span><strong>{file.name}</strong><small>{fileSize(file.size)}</small></span>
        <button type="button" onClick={() => removeFile(index)} disabled={disabled} aria-label={`Remove ${file.name}`}><X size={17} /></button>
      </div>)}
    </div>}
  </div>;
}
