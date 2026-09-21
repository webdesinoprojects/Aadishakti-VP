import { useCallback, useEffect, useState } from 'react';
import { Clock3, Eye, FileCheck2, LoaderCircle, Send } from 'lucide-react';
import PortalDocumentDrawer from './PortalDocumentDrawer';
import PortalFileDropzone from './PortalFileDropzone';
import PortalToast from './PortalToast';
import './portal-workspaces.css';

const statusClass = (status = '') => `portal-status portal-status--${status.toLowerCase().replaceAll('_', '-')}`;

export default function PortalReceiptsWorkspace({ api, role = 'vendor' }) {
  const [items, setItems] = useState([]);
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const cardClass = role === 'vendor' ? 'vendor-panel' : 'customer-card';
  const tableClass = role === 'vendor' ? 'vendor-table' : 'customer-table';
  const buttonClass = role === 'vendor' ? 'vendor-btn-outline' : 'customer-btn-outline';
  const dismissToast = useCallback(() => setToast(null), []);
  const closePreview = useCallback(() => setPreviewItem(null), []);
  const notify = (type, message) => setToast({ type, message, id: Date.now() });

  const load = useCallback(async (showError = true) => {
    try { setItems(await api.getReceipts()); }
    catch (error) {
      if (showError) notify('error', error.response?.data?.error || 'Unable to load receipt history.');
    } finally { setLoading(false); }
  }, [api]);
  useEffect(() => { load(); }, [load]);

  const submit = async (event) => {
    event.preventDefault();
    if (!reference.trim()) return notify('error', 'Enter a payment or invoice reference.');
    if (!files.length) return notify('error', 'Select a receipt or payment proof file.');

    const formData = new FormData();
    formData.append('paymentReference', reference.trim());
    if (amount !== '') formData.append('amount', amount);
    formData.append('document', files[0]);
    setSubmitting(true);
    try {
      const created = await api.submitReceipt(formData);
      if (created?.id) setItems((current) => [created, ...current]);
      setReference('');
      setAmount('');
      setFiles([]);
      notify('success', 'Payment proof submitted for Aadishakti verification.');
      await load(false);
    } catch (error) {
      notify('error', error.response?.data?.error || 'Receipt upload failed. Please try again.');
    } finally { setSubmitting(false); }
  };

  return (
    <section className="portal-receipts-shell" aria-label="Receipt and payment proof upload">
      <PortalToast toast={toast} onDismiss={dismissToast} />
      <PortalDocumentDrawer item={previewItem} role={role} kind="receipt" onClose={closePreview} />

      <section className={`${cardClass} portal-upload-card`}>
        <div className="portal-card-heading">
          <span><FileCheck2 size={22} /></span>
          <div><h2>Upload payment proof</h2><p>Submit a receipt for Aadishakti to verify. This does not change CIS payment records.</p></div>
        </div>
        <form className="portal-receipt-form" onSubmit={submit}>
          <div className="portal-receipt-fields">
            <label className="portal-quarter-field">
              <span className="portal-field-label">Payment reference *</span>
              <input value={reference} onChange={(event) => setReference(event.target.value)} disabled={submitting} required placeholder="Payment or invoice reference" />
              <small>Enter the reference shown on the payment proof.</small>
            </label>
            <label className="portal-quarter-field">
              <span className="portal-field-label">Amount</span>
              <input value={amount} onChange={(event) => setAmount(event.target.value)} disabled={submitting} type="number" min="0" step="0.01" placeholder="0.00" />
              <small>Optional; enter the amount shown on the receipt.</small>
            </label>
          </div>
          <PortalFileDropzone files={files} onChange={setFiles} onError={(message) => notify('error', message)} disabled={submitting} label="Receipt or payment proof *" dropLabel="Drop your payment proof here" fileKind="payment proof" maxFiles={1} accept=".pdf,.jpg,.jpeg,.png,.webp" formatHint="PDF or image" />
          <div className="portal-upload-actions">
            <span>{files.length ? files[0].name : 'No file selected'}</span>
            <button className={`${buttonClass} portal-submit-button`} disabled={submitting || !reference.trim() || !files.length}>
              {submitting ? <><LoaderCircle className="portal-spin" size={18} /> Uploading...</> : <><Send size={17} /> Submit payment proof</>}
            </button>
          </div>
        </form>
      </section>

      <section className={`${cardClass} portal-history-card`}>
        <div className="portal-history-heading"><div><h2>Payment proof history</h2><p>Track your uploaded receipts and Aadishakti verification status.</p></div><span>{items.length} total</span></div>
        <div className="portal-table-scroll">
          <table className={tableClass}>
            <thead><tr><th>Payment reference</th><th>Amount</th><th>Proof file</th><th>Submitted</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.payment_reference}</strong></td>
                  <td>{item.amount ?? 'Not supplied'}</td>
                  <td><span className="portal-history-file"><FileCheck2 size={17} />{item.media?.name || 'Payment proof'}</span></td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td><span className={statusClass(item.status)}>{item.status}</span></td>
                  <td>{item.media?.url ? <button className="portal-view-file" type="button" onClick={() => setPreviewItem(item)}><Eye size={15} /> View proof</button> : 'Processing'}</td>
                </tr>
              ))}
              {!loading && !items.length && <tr><td colSpan="6"><div className="portal-empty-state"><Clock3 size={28} /><strong>No payment proofs submitted yet</strong><span>Your uploaded receipts and review status will appear here.</span></div></td></tr>}
              {loading && <tr><td colSpan="6"><div className="portal-empty-state"><LoaderCircle className="portal-spin" size={26} /><span>Loading payment proof history...</span></div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
