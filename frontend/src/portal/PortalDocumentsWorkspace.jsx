import { useCallback, useEffect, useState } from 'react';
import { Eye, FileCheck2, FolderClock, LoaderCircle, Send } from 'lucide-react';
import PortalDocumentDrawer from './PortalDocumentDrawer';
import PortalFileDropzone from './PortalFileDropzone';
import PortalToast from './PortalToast';
import './portal-workspaces.css';

const statusClass = (status = '') => `portal-status portal-status--${status.toLowerCase().replaceAll(' ', '-').replaceAll('_', '-')}`;

export default function PortalDocumentsWorkspace({ api, role = 'vendor' }) {
  const [items, setItems] = useState([]);
  const [documentType, setDocumentType] = useState('');
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const isVendor = role === 'vendor';
  const cardClass = isVendor ? 'vendor-panel' : 'customer-card';
  const tableClass = isVendor ? 'vendor-table' : 'customer-table';
  const buttonClass = isVendor ? 'vendor-btn-outline' : 'customer-btn-outline';
  const dismissToast = useCallback(() => setToast(null), []);
  const closePreview = useCallback(() => setPreviewItem(null), []);
  const notify = (type, message) => setToast({ type, message, id: Date.now() });

  const load = async ({ showError = true } = {}) => {
    try {
      setItems(await api.getDocuments());
    } catch (error) {
      if (showError) notify('error', error.response?.data?.error || 'Unable to load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (event) => {
    event.preventDefault();
    if (!documentType.trim()) return notify('error', 'Enter a document type.');
    if (!files.length) return notify('error', 'Select at least one document.');
    if (files.length === 1 && !title.trim()) return notify('error', 'Enter a document title.');

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('documentType', documentType.trim());
      data.append('title', title.trim());
      files.forEach((file) => data.append('documents', file));
      const created = await api.submitDocument(data);
      const uploaded = Array.isArray(created) ? created : created ? [created] : [];
      setItems((current) => [...uploaded, ...current.filter((item) => !uploaded.some((entry) => entry.id === item.id))]);
      setFiles([]);
      setDocumentType('');
      setTitle('');
      notify('success', `${uploaded.length || files.length} document${files.length === 1 ? '' : 's'} submitted for review.`);
      await load({ showError: false });
    } catch (error) {
      notify('error', error.response?.data?.error || 'Document upload failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="portal-documents-shell">
      <PortalToast toast={toast} onDismiss={dismissToast} />
      <PortalDocumentDrawer item={previewItem} role={role} kind="document" onClose={closePreview} />

      <section className={`${cardClass} portal-upload-card`}>
        <div className="portal-card-heading">
          <span><FileCheck2 size={22} /></span>
          <div><h2>Upload documents</h2><p>Add one or several files for Aadishakti review and approval.</p></div>
        </div>
        <form className="portal-document-form" onSubmit={submit}>
          <div className="portal-document-fields">
            <label className="portal-quarter-field">
              <span className="portal-field-label">Document type</span>
              <input value={documentType} onChange={(event) => setDocumentType(event.target.value)} disabled={submitting} required placeholder="GST, MSME, certificate..." />
            </label>
            <label className="portal-quarter-field">
              <span className="portal-field-label">Document title</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} disabled={submitting} required={files.length <= 1} placeholder={files.length > 1 ? 'File names will be used' : 'Enter a clear document title'} />
              <small>{files.length > 1 ? 'Each selected file will use its file name as the title.' : 'Use a name that will be easy to identify later.'}</small>
            </label>
          </div>
          <PortalFileDropzone files={files} onChange={setFiles} onError={(message) => notify('error', message)} disabled={submitting} label="Document files" dropLabel="Drop documents here" fileKind="document" />
          <div className="portal-upload-actions">
            <span>{files.length ? `${files.length} selected` : 'No files selected'}</span>
            <button className={`${buttonClass} portal-submit-button`} disabled={submitting || !files.length || !documentType.trim() || (files.length === 1 && !title.trim())}>
              {submitting ? <><LoaderCircle className="portal-spin" size={18} /> Uploading...</> : <><Send size={17} /> Submit {files.length > 1 ? `${files.length} documents` : 'document'}</>}
            </button>
          </div>
        </form>
      </section>

      <section className={`${cardClass} portal-history-card`}>
        <div className="portal-history-heading"><div><h2>Document history</h2><p>Your submitted files and Aadishakti review status.</p></div><span>{items.length} total</span></div>
        <div className="portal-table-scroll">
          <table className={tableClass}>
            <thead><tr><th>Title</th><th>Type</th><th>Uploaded</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td><span className="portal-history-file"><FileCheck2 size={17} /><strong>{item.title}</strong></span></td>
                  <td>{item.document_type}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td><span className={statusClass(item.status)}>{item.status}</span>{item.review_note && <span className="portal-review-message"><strong>Admin note:</strong> {item.review_note}</span>}</td>
                  <td>{item.media?.url ? <button className="portal-view-file" type="button" onClick={() => setPreviewItem(item)}><Eye size={15} /> View file</button> : 'Processing'}</td>
                </tr>
              ))}
              {!loading && !items.length && <tr><td colSpan="5"><div className="portal-empty-state"><FolderClock size={28} /><strong>No documents submitted yet</strong><span>Your uploads and review status will appear here.</span></div></td></tr>}
              {loading && <tr><td colSpan="5"><div className="portal-empty-state"><LoaderCircle className="portal-spin" size={26} /><span>Loading document history...</span></div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
