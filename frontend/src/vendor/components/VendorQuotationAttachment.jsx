import { useRef, useState } from 'react';
import { FileText, UploadCloud, X } from 'lucide-react';

const allowedExtensions = new Set(['pdf', 'doc', 'docx', 'xls', 'xlsx']);
const maxBytes = 10 * 1024 * 1024;

export default function VendorQuotationAttachment({ file, onChange, onError, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const selectFile = (candidate) => {
    if (!candidate) return;
    const extension = candidate.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.has(extension)) return onError('Choose a PDF, Word, or Excel document.');
    if (candidate.size > maxBytes) return onError('The attachment must be 10 MB or smaller.');
    onChange(candidate);
  };

  return <div className="vendor-rfq-attachment">
    <span className="vendor-rfq-field-label">Quotation attachment <small>(optional)</small></span>
    <input ref={inputRef} type="file" hidden disabled={disabled} accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(event) => { selectFile(event.target.files?.[0]); event.target.value = ''; }} />
    {file ? <div className="vendor-rfq-attached-file"><FileText size={20} /><span><strong>{file.name}</strong><small>{(file.size / 1024 / 1024).toFixed(2)} MB</small></span><button type="button" disabled={disabled} onClick={() => onChange(null)} aria-label={`Remove ${file.name}`}><X size={18} /></button></div>
      : <button type="button" disabled={disabled} className={dragging ? 'vendor-rfq-dropzone is-dragging' : 'vendor-rfq-dropzone'} onClick={() => inputRef.current?.click()} onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { event.preventDefault(); if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false); }} onDrop={(event) => { event.preventDefault(); setDragging(false); selectFile(event.dataTransfer.files?.[0]); }}><UploadCloud size={22} /><span><strong>Drop a quotation file here</strong><small>or click to browse · PDF, Word, Excel · max 10 MB</small></span></button>}
  </div>;
}
