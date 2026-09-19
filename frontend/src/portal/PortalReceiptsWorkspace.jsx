import { useEffect, useState } from 'react';

export default function PortalReceiptsWorkspace({ api, role = 'vendor' }) {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const isVendor = role === 'vendor';
  const cardClass = isVendor ? 'vendor-panel' : 'customer-card';
  const tableClass = isVendor ? 'vendor-table' : 'customer-table';
  const buttonClass = isVendor ? 'vendor-btn-outline' : 'customer-btn-outline';
  const load = async () => {
    try { setItems(await api.getReceipts()); }
    catch (error) { setMessage(error.response?.data?.error || 'Unable to load submitted receipts.'); }
  };
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.submitReceipt(new FormData(event.currentTarget));
      event.currentTarget.reset();
      setMessage('Receipt submitted for verification.');
      await load();
    } catch (error) { setMessage(error.response?.data?.error || 'Receipt upload failed.'); }
  };
  return <section style={{ marginTop: '28px' }}>
    <h2 style={{ fontSize: '18px', marginBottom: '6px' }}>Receipt / Payment Proof Upload</h2>
    <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>These uploads are stored by Aadishakti and are separate from CIS payment records.</p>
    <div className={cardClass} style={{ padding: '20px', marginBottom: '16px' }}><form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr auto', gap: '12px', alignItems: 'end' }}>
      <label>Payment Reference<input name="paymentReference" required placeholder="Payment / invoice reference" style={{ width: '100%', padding: '10px', marginTop: '6px' }} /></label>
      <label>Amount<input name="amount" type="number" min="0" step="0.01" style={{ width: '100%', padding: '10px', marginTop: '6px' }} /></label>
      <label>Receipt File<input name="document" type="file" required accept=".pdf,.jpg,.jpeg,.png,.webp" style={{ width: '100%', padding: '8px', marginTop: '6px' }} /></label>
      <button className={buttonClass}>Upload Receipt</button>
    </form>{message && <p style={{ marginTop: '12px' }}>{message}</p>}</div>
    <div className={cardClass} style={{ padding: 0 }}><table className={tableClass}><thead><tr><th>Reference</th><th>Amount</th><th>Submitted</th><th>Status</th><th>File</th></tr></thead><tbody>
      {items.map((item) => <tr key={item.id}><td>{item.payment_reference}</td><td>{item.amount ?? '-'}</td><td>{new Date(item.created_at).toLocaleDateString()}</td><td>{item.status}</td><td>{item.media?.url ? <a href={item.media.url} target="_blank" rel="noreferrer">View</a> : '-'}</td></tr>)}
      {!items.length && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No receipts submitted yet.</td></tr>}
    </tbody></table></div>
  </section>;
}
