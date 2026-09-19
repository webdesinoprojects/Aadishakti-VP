import { useEffect, useState } from 'react';

export default function PortalDocumentsWorkspace({ api, role = 'vendor' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const isVendor = role === 'vendor';
  const cardClass = isVendor ? 'vendor-panel' : 'customer-card';
  const tableClass = isVendor ? 'vendor-table' : 'customer-table';
  const buttonClass = isVendor ? 'vendor-btn-outline' : 'customer-btn-outline';

  const load = async () => {
    try { setItems(await api.getDocuments()); setMessage(''); }
    catch (error) { setMessage(error.response?.data?.error || 'Unable to load documents.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData(event.currentTarget);
      await api.submitDocument(data);
      event.currentTarget.reset();
      setMessage('Document submitted for review.');
      await load();
    } catch (error) { setMessage(error.response?.data?.error || 'Document upload failed.'); }
    finally { setSubmitting(false); }
  };

  return (
    <>
      <div className={cardClass} style={{ padding: '20px', marginBottom: '20px' }}>
        <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.5fr auto', gap: '12px', alignItems: 'end' }}>
          <label>Document Type<input name="documentType" required placeholder="GST, MSME, certificate..." style={{ width: '100%', padding: '10px', marginTop: '6px' }} /></label>
          <label>Title<input name="title" required placeholder="Document title" style={{ width: '100%', padding: '10px', marginTop: '6px' }} /></label>
          <label>File<input name="document" type="file" required accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" style={{ width: '100%', padding: '8px', marginTop: '6px' }} /></label>
          <button className={buttonClass} disabled={submitting}>{submitting ? 'Uploading...' : 'Upload'}</button>
        </form>
        {message && <p style={{ margin: '12px 0 0', color: 'var(--text-secondary)' }}>{message}</p>}
      </div>
      <div className={cardClass} style={{ padding: 0 }}>
        <table className={tableClass}>
          <thead><tr><th>Title</th><th>Type</th><th>Uploaded</th><th>Status</th><th>File</th></tr></thead>
          <tbody>
            {items.map((item) => <tr key={item.id}><td>{item.title}</td><td>{item.document_type}</td><td>{new Date(item.created_at).toLocaleDateString()}</td><td>{item.status}</td><td>{item.media?.url ? <a href={item.media.url} target="_blank" rel="noreferrer">View</a> : '-'}</td></tr>)}
            {!loading && items.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No documents submitted yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
