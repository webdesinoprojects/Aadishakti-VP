import { useEffect, useState } from 'react';
import VendorPageHeader from '../components/VendorPageHeader';
import vendorApi from '../../services/vendorApi';

export default function RFQsPage() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const load = async () => { try { setItems(await vendorApi.getRfqs()); } catch (error) { setMessage(error.response?.data?.error || 'Unable to load RFQs.'); } };
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const submit = async (event) => {
    event.preventDefault();
    try { await vendorApi.submitQuotation(selected.id, new FormData(event.currentTarget)); setSelected(null); setMessage('Quotation submitted.'); await load(); }
    catch (error) { setMessage(error.response?.data?.error || 'Quotation submission failed.'); }
  };
  return <div className="vendor-page"><VendorPageHeader title="RFQs & Enquiries" subtitle="Review assigned RFQs and submit commercial quotations." />
    {message && <p style={{ marginBottom: '16px' }}>{message}</p>}
    <div className="vendor-panel"><table className="vendor-table"><thead><tr><th>RFQ</th><th>Title</th><th>Product</th><th>Due</th><th>Status</th><th>Action</th></tr></thead><tbody>
      {items.map((item) => <tr key={item.id}><td>{item.rfq?.rfq_reference}</td><td>{item.rfq?.title}</td><td>{item.rfq?.product || '-'}</td><td>{item.rfq?.response_due_at ? new Date(item.rfq.response_due_at).toLocaleDateString() : '-'}</td><td>{item.status}</td><td><button className="vendor-btn-outline" disabled={Boolean(item.quotation?.length)} onClick={() => setSelected(item)}>Submit Quote</button></td></tr>)}
      {!items.length && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No RFQs are assigned to this account.</td></tr>}
    </tbody></table></div>
    {selected && <div className="vendor-drawer-overlay open" onClick={() => setSelected(null)}><div className="vendor-drawer" onClick={(event) => event.stopPropagation()} style={{ padding: '30px' }}><h2>Submit Quotation</h2><p>{selected.rfq?.title}</p><form onSubmit={submit} className="vendor-quote-form" style={{ display: 'grid', gap: '14px' }}>
      <label>Unit Price<input name="unitPrice" type="number" min="0" step="0.01" required style={{ width: '100%', padding: '10px' }} /></label><label>Tax Rate %<input name="taxRate" type="number" min="0" step="0.01" style={{ width: '100%', padding: '10px' }} /></label><label>Lead Time (days)<input name="leadTimeDays" type="number" min="0" style={{ width: '100%', padding: '10px' }} /></label><label>Validity Date<input name="validityDate" type="date" style={{ width: '100%', padding: '10px' }} /></label><label>Remarks<textarea name="remarks" rows="3" style={{ width: '100%', padding: '10px' }} /></label><label>Attachment<input name="document" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" /></label><button className="vendor-btn-outline">Submit</button>
    </form></div></div>}
  </div>;
}
