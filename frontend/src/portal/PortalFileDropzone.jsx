import { useRef, useState } from 'react';
import { FileText, UploadCloud, X } from 'lucide-react';

const MAX_BYTES = 10 * 1024 * 1024;
const defaultAccept = '.pdf,.xls,.xlsx,.doc,.docx,.jpg,.jpeg,.png,.webp';
const formatBytes = (bytes) => bytes < 1024 * 1024
  ? `${Math.max(1, Math.round(bytes / 1024))} KB`
  : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

export default function PortalFileDropzone({ files, onChange, onError, disabled = false, label = 'Statement files', dropLabel = 'Drop statement files here', fileKind = 'statement file', maxFiles = 5, accept = defaultAccept, formatHint = 'PDF, Excel, Word or image' }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const extensions = new Set(accept.split(',').map((extension) => extension.trim().replace('.', '').toLowerCase()));

  const addFiles = (incoming) => {
    const candidates = Array.from(incoming || []);
    if (candidates.length > maxFiles) return onError(`You can upload ${maxFiles === 1 ? 'one file' : `up to ${maxFiles} files`} at once.`);
    const rejectedType = candidates.find((file) => !extensions.has(file.name.split('.').pop()?.toLowerCase()));
    if (rejectedType) return onError(`${rejectedType.name} is not a supported ${fileKind}.`);
    const oversized = candidates.find((file) => file.size > MAX_BYTES);
    if (oversized) return onError(`${oversized.name} is larger than 10 MB.`);
    const unique = maxFiles === 1 ? [] : [...files];
    candidates.forEach((file) => {
      if (!unique.some((item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified)) unique.push(file);
    });
    if (unique.length > maxFiles) return onError(`You can upload up to ${maxFiles} files at once.`);
    onChange(unique);
  };

  const openPicker = () => { if (!disabled) inputRef.current?.click(); };
  const removeFile = (index) => onChange(files.filter((_file, fileIndex) => fileIndex !== index));

  return (
    <div className="portal-upload-field">
      <span className="portal-field-label">{label}</span>
      <div
        className={`portal-dropzone ${dragging ? 'is-dragging' : ''} ${disabled ? 'is-disabled' : ''}`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={openPicker}
        onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPicker(); } }}
        onDragEnter={(event) => { event.preventDefault(); if (!disabled) setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => { event.preventDefault(); if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false); }}
        onDrop={(event) => { event.preventDefault(); setDragging(false); if (!disabled) addFiles(event.dataTransfer.files); }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={maxFiles > 1}
          hidden
          disabled={disabled}
          accept={accept}
          onChange={(event) => { addFiles(event.target.files); event.target.value = ''; }}
        />
        <span className="portal-dropzone-icon"><UploadCloud size={25} /></span>
        <div><strong>{dropLabel}</strong><span>or click to browse · {formatHint} · max 10 MB {maxFiles > 1 ? 'each' : ''}</span></div>
        <span className="portal-browse-button">Select {maxFiles === 1 ? 'file' : 'files'}</span>
      </div>
      {files.length > 0 && (
        <div className="portal-selected-files" aria-live="polite">
          <div className="portal-selected-summary"><strong>{files.length} file{files.length === 1 ? '' : 's'} ready</strong><span>{maxFiles === 1 ? 'One file at a time' : `Maximum ${maxFiles} files`}</span></div>
          {files.map((file, index) => (
            <div className="portal-file-chip" key={`${file.name}-${file.size}-${file.lastModified}`}>
              <FileText size={19} aria-hidden="true" />
              <div><strong>{file.name}</strong><span>{formatBytes(file.size)}</span></div>
              <button type="button" disabled={disabled} onClick={(event) => { event.stopPropagation(); removeFile(index); }} aria-label={`Remove ${file.name}`}><X size={17} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
