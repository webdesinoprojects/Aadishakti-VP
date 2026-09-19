import { useEffect, useState } from 'react';

export default function PortalReconciliationWorkspace({ api, role = 'vendor' }) {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const isVendor = role === 'vendor';
  const cardClass = isVendor ? 'vendor-panel' : 'customer-card';
  const tableClass = isVendor ? 'vendor-table' : 'customer-table';
  const buttonClass = isVendor ? 'vendor-btn-outline' : 'customer-btn-outline';
  const load = async () => {
    try { const result = await api.getReconciliations(); setItems(result.data || []); }
    catch (error) { setMessage(error.response?.data?.error || 'Unable to load statements.'); }
  };
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.submitReconciliation(new FormData(event.currentTarget));
      event.currentTarget.reset();
      setMessage('Statement submitted for verification.');
      await load();
    } catch (error) { setMessage(error.response?.data?.error || 'Statement upload failed.'); }
  };
  return (
    <>
      <div className={cardClass} style={{ padding: '20px', marginBottom: '20px' }}>
        <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '12px', alignItems: 'end' }}>
          <label>Quarter<input name="quarter" required placeholder="Q1 2026" style={{ width: '100%', padding: '10px', marginTop: '6px' }} /></label>
          <label>Statement File<input name="document" type="file" required accept=".pdf,.xls,.xlsx,.doc,.docx,.jpg,.png" style={{ width: '100%', padding: '8px', marginTop: '6px' }} /></label>
          <button className={buttonClass}>Submit Statement</button>
        </form>
        {message && <p style={{ margin: '12px 0 0' }}>{message}</p>}
      </div>
      <div className={cardClass} style={{ padding: 0 }}><table className={tableClass}>
        <thead><tr><th>Quarter</th><th>File</th><th>Status</th><th>Submitted</th></tr></thead>
        <tbody>{items.map((item) => <tr key={item.id}><td>{item.quarter}</td><td>{item.documentUrl ? <a href={item.documentUrl} target="_blank" rel="noreferrer">{item.originalName}</a> : item.originalName}</td><td>{item.status}</td><td>{new Date(item.createdAt).toLocaleDateString()}</td></tr>)}{!items.length && <tr><td colSpan="4" style={{ textAlign: 'center' }}>No statements submitted yet.</td></tr>}</tbody>
      </table></div>
    </>
  );
}
