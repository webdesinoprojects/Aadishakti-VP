import * as Dialog from '@radix-ui/react-dialog';
import { CalendarDays, FileText, Send, X } from 'lucide-react';
import { useState } from 'react';
import VendorQuotationAttachment from './VendorQuotationAttachment';
import { getVendorRfqProgress } from '../utils/rfqProgress';

const formatDate = (value) => value ? new Date(value).toLocaleString() : 'Not specified';
const hasQuotation = (value) => Array.isArray(value) ? value.length > 0 : Boolean(value);

function Detail({ label, value }) {
  return <div><dt>{label}</dt><dd>{value ?? 'Not specified'}</dd></div>;
}

export default function VendorRfqDrawer({ assignment, busy, onClose, onSubmit }) {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const rfq = assignment.rfq || {};
  const quoted = hasQuotation(assignment.quotation);
  const progress = getVendorRfqProgress(assignment);
  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (file) data.append('document', file);
    onSubmit(assignment, data);
  };

  return <Dialog.Root open onOpenChange={(open) => !open && !busy && onClose()}>
    <Dialog.Portal>
      <Dialog.Overlay className="vendor-rfq-overlay" />
      <Dialog.Content className="vendor-rfq-drawer" aria-describedby="vendor-rfq-subtitle">
        <header className="vendor-rfq-drawer-header"><div><span>Vendor RFQ</span><Dialog.Title>{rfq.title || 'RFQ details'}</Dialog.Title><Dialog.Description id="vendor-rfq-subtitle">{rfq.rfq_reference || 'Assigned enquiry'}</Dialog.Description></div><Dialog.Close disabled={busy} aria-label="Close RFQ details"><X size={21} /></Dialog.Close></header>
        <div className="vendor-rfq-drawer-body">
          <section className="vendor-rfq-details">
            <div className="vendor-rfq-section-heading">
              <FileText size={19} />
              <div><h3>Enquiry details</h3><p>Information provided by Aadishakti for this RFQ.</p></div>
            </div>
            <div className="vendor-rfq-description">
              <strong>Description & requirements</strong>
              <p>{rfq.description || 'No additional requirements were provided.'}</p>
            </div>
            <dl className="vendor-rfq-meta">
              <Detail label="RFQ reference" value={rfq.rfq_reference} />
              <Detail label="Company" value={rfq.company_code || 'All companies'} />
              <Detail label="Product" value={rfq.product || 'Not specified'} />
              <Detail label="Quantity" value={rfq.quantity == null ? 'Not specified' : `${rfq.quantity} ${rfq.unit || ''}`.trim()} />
              <Detail label="Published" value={formatDate(rfq.created_at)} />
              <Detail label="Response due" value={formatDate(rfq.response_due_at)} />
              <Detail label="Progress" value={progress.label} />
            </dl>
          </section>
          {quoted ? <div className="vendor-rfq-submitted"><strong>Quotation {progress.label.toLowerCase()}</strong><p>You can review its status under My Quotations.</p></div> : <section className="vendor-rfq-quotation"><div className="vendor-rfq-section-heading"><CalendarDays size={19} /><div><h3>Submit quotation</h3><p>Enter your commercial offer for this RFQ.</p></div></div><form id="vendor-rfq-quote-form" onSubmit={submit}><div className="vendor-rfq-form-grid"><label><span>Unit price *</span><input name="unitPrice" type="number" min="0" step="0.01" required disabled={busy} placeholder="0.00" /></label><label><span>Tax rate %</span><input name="taxRate" type="number" min="0" step="0.01" disabled={busy} placeholder="0" /></label><label><span>Lead time (days)</span><input name="leadTimeDays" type="number" min="0" step="1" disabled={busy} placeholder="e.g. 14" /></label><label><span>Valid until</span><input name="validityDate" type="date" disabled={busy} /></label><label className="vendor-rfq-wide-field"><span>Remarks</span><textarea name="remarks" rows="4" disabled={busy} placeholder="Add terms or details for the buyer" /></label><div className="vendor-rfq-wide-field"><VendorQuotationAttachment file={file} onChange={(value) => { setFile(value); setFileError(''); }} onError={setFileError} disabled={busy} />{fileError && <p className="vendor-rfq-file-error" role="alert">{fileError}</p>}</div></div></form></section>}
        </div>
        <footer className="vendor-rfq-drawer-footer"><button type="button" onClick={onClose} disabled={busy}>Close</button>{!quoted && <button className="vendor-rfq-submit" type="submit" form="vendor-rfq-quote-form" disabled={busy}><Send size={17} /> {busy ? 'Submitting...' : 'Submit quotation'}</button>}</footer>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
