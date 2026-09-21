import { useCallback, useEffect, useState } from 'react';
import { Clock3, Eye, FileCheck2, LoaderCircle, Send } from 'lucide-react';
import PortalDocumentDrawer from './PortalDocumentDrawer';
import PortalFileDropzone from './PortalFileDropzone';
import PortalToast from './PortalToast';
import './portal-workspaces.css';

const statusClass = (status = '') => `portal-status portal-status--${status.toLowerCase().replaceAll(' ', '-')}`;

export default function PortalReconciliationWorkspace({ api, role = 'vendor' }) {
  const [items, setItems] = useState([]);
  const [quarter, setQuarter] = useState('');
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
      const result = await api.getReconciliations();
      setItems(result.data || []);
    } catch (error) {
      if (showError) notify('error', error.response?.data?.error || 'Unable to load statement history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (event) => {
    event.preventDefault();
    if (!quarter.trim()) return notify('error', 'Enter the statement quarter before uploading.');
    if (!files.length) return notify('error', 'Select at least one statement file.');

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('quarter', quarter.trim());
      files.forEach((file) => formData.append('documents', file));
      const response = await api.submitReconciliation(formData);
      const uploaded = Array.isArray(response.data) ? response.data : response.data ? [response.data] : [];
      setItems((current) => [...uploaded, ...current.filter((item) => !uploaded.some((entry) => entry.id === item.id))]);
      setFiles([]);
      notify('success', `${uploaded.length || files.length} statement file${files.length === 1 ? '' : 's'} submitted for verification.`);
      await load({ showError: false });
    } catch (error) {
      notify('error', error.response?.data?.error || 'Statement upload failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="portal-reconciliation-shell">
      <PortalToast toast={toast} onDismiss={dismissToast} />
      <PortalDocumentDrawer item={previewItem} role={role} onClose={closePreview} />
      <section className={`${cardClass} portal-upload-card`}>
        <div className="portal-card-heading">
          <span><FileCheck2 size={22} /></span>
          <div><h2>Upload quarterly statements</h2><p>Submit one or several files together for Aadishakti verification.</p></div>
        </div>
        <form onSubmit={submit} className="portal-reconciliation-form">
          <label className="portal-quarter-field">
            <span className="portal-field-label">Statement quarter</span>
            <input value={quarter} onChange={(event) => setQuarter(event.target.value)} disabled={submitting} required placeholder="e.g. Q1 2026" autoComplete="off" />
            <small>Use the quarter shown on the statement.</small>
          </label>
          <PortalFileDropzone files={files} onChange={setFiles} onError={(message) => notify('error', message)} disabled={submitting} />
          <div className="portal-upload-actions">
            <span>{files.length ? `${files.length} selected` : 'No files selected'}</span>
            <button className={`${buttonClass} portal-submit-button`} disabled={submitting || !files.length || !quarter.trim()}>
              {submitting ? <><LoaderCircle className="portal-spin" size={18} /> Uploading...</> : <><Send size={17} /> Submit {files.length > 1 ? `${files.length} statements` : 'statement'}</>}
            </button>
          </div>
        </form>
      </section>

      <section className={`${cardClass} portal-history-card`}>
        <div className="portal-history-heading"><div><h2>Submission history</h2><p>Uploaded statements and their verification status.</p></div><span>{items.length} total</span></div>
        <div className="portal-table-scroll">
          <table className={tableClass}>
            <thead><tr><th>Quarter</th><th>Statement file</th><th>Status</th><th>Submitted</th><th>Action</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.quarter}</strong></td>
                  <td><span className="portal-history-file"><FileCheck2 size={17} />{item.originalName}</span></td>
                  <td>
                    <span className={statusClass(item.status)}>{item.status}</span>
                    {item.reviewNote && <span className="portal-review-message"><strong>Admin note:</strong> {item.reviewNote}</span>}
                  </td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>{item.documentUrl ? <button className="portal-view-file" type="button" onClick={() => setPreviewItem(item)}><Eye size={15} /> View file</button> : 'Processing'}</td>
                </tr>
              ))}
              {!loading && !items.length && <tr><td colSpan="5"><div className="portal-empty-state"><Clock3 size={28} /><strong>No statements submitted yet</strong><span>Your uploaded files and their review status will appear here.</span></div></td></tr>}
              {loading && <tr><td colSpan="5"><div className="portal-empty-state"><LoaderCircle className="portal-spin" size={26} /><span>Loading statement history...</span></div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
