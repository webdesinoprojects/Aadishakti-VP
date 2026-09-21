import { useCallback, useEffect, useState } from 'react';
import { Eye, FileQuestion } from 'lucide-react';
import VendorPageHeader from '../components/VendorPageHeader';
import VendorRfqDrawer from '../components/VendorRfqDrawer';
import vendorApi from '../../services/vendorApi';
import { getVendorRfqProgress } from '../utils/rfqProgress';
import useVendorWorkflowRefresh from '../utils/useVendorWorkflowRefresh';
import './rfqs.css';

export default function RFQsPage() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { setItems(await vendorApi.getRfqs()); }
    catch (requestError) { setMessage({ type: 'error', text: requestError.response?.data?.error || 'Unable to load RFQs.' }); }
  }, []);
  useEffect(() => { load(); }, [load]);
  useVendorWorkflowRefresh(load);

  const submit = async (assignment, formData) => {
    setBusy(true);
    try {
      await vendorApi.submitQuotation(assignment.id, formData);
      setSelected(null);
      setMessage({ type: 'success', text: 'Quotation submitted successfully. You can track it under My Quotations.' });
      await load();
    } catch (requestError) {
      setMessage({ type: 'error', text: requestError.response?.data?.error || 'Quotation submission failed.' });
    } finally { setBusy(false); }
  };

  return <div className="vendor-page vendor-rfq-page">
    <VendorPageHeader title="RFQs & Enquiries" subtitle="Review assigned RFQs and submit commercial quotations." />
    {message && <div className={`vendor-rfq-alert vendor-rfq-alert--${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}><span>{message.text}</span><button type="button" onClick={() => setMessage(null)} aria-label="Dismiss notification">×</button></div>}
    <section className="vendor-panel vendor-rfq-register"><div className="vendor-rfq-register-heading"><div><h2>Assigned RFQs</h2><p>Open an enquiry to see its full scope and submit your offer.</p></div><span>{items.length} total</span></div><div className="vendor-rfq-table-shell"><table className="vendor-table"><thead><tr><th>RFQ</th><th>Title</th><th>Product</th><th>Quantity</th><th>Response due</th><th>Progress</th><th>Action</th></tr></thead><tbody>
      {items.map((item) => {
        const progress = getVendorRfqProgress(item);
        return <tr key={item.id} className="vendor-rfq-row" tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && setSelected(item)} onClick={() => setSelected(item)}><td><strong>{item.rfq?.rfq_reference || '—'}</strong></td><td>{item.rfq?.title || 'Untitled RFQ'}</td><td>{item.rfq?.product || '—'}</td><td>{item.rfq?.quantity == null ? '—' : `${item.rfq.quantity} ${item.rfq.unit || ''}`.trim()}</td><td>{item.rfq?.response_due_at ? new Date(item.rfq.response_due_at).toLocaleDateString() : '—'}</td><td><span className={`vendor-rfq-status vendor-rfq-status--${progress.status}`}>{progress.label}</span></td><td><button type="button" className="vendor-btn-outline" onClick={(event) => { event.stopPropagation(); setSelected(item); }}><Eye size={15} /> View details</button></td></tr>;
      })}
      {!items.length && <tr><td colSpan="7"><div className="vendor-rfq-empty"><FileQuestion size={28} /><strong>No RFQs assigned yet</strong><span>Enquiries sent to your vendor account will appear here.</span></div></td></tr>}
    </tbody></table></div></section>
    {selected && <VendorRfqDrawer key={selected.id} assignment={items.find((item) => item.id === selected.id) || selected} busy={busy} onClose={() => setSelected(null)} onSubmit={submit} />}
  </div>;
}
