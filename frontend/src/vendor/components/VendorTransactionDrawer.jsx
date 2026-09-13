import { X } from 'lucide-react';
import {
  useVendorGrpo,
  useVendorCreditNote,
  useVendorDebitNote,
  useVendorInvoice,
  useVendorPayment,
  useVendorPurchaseOrder,
} from '../hooks/useVendorApi';
import { formatVendorAmount, formatVendorDate, formatVendorValue, UNKNOWN_CURRENCY_NOTE } from '../utils/vendorFormatters';
import VendorDataState from './VendorDataState';

const titleFor = (type) => ({
  purchaseOrder: 'Purchase Order Summary',
  invoice: 'AP Invoice Summary',
  creditNote: 'AP Credit Note Summary',
  debitNote: 'AP Debit Note Summary',
  grpo: 'GRPO Summary',
  payment: 'Outgoing Payment Summary',
}[type] || 'Document Summary');

export default function VendorTransactionDrawer({ type, docEntry, onClose }) {
  const purchaseOrder = useVendorPurchaseOrder(type === 'purchaseOrder' ? docEntry : null);
  const invoice = useVendorInvoice(type === 'invoice' ? docEntry : null);
  const creditNote = useVendorCreditNote(type === 'creditNote' ? docEntry : null);
  const debitNote = useVendorDebitNote(type === 'debitNote' ? docEntry : null);
  const grpo = useVendorGrpo(type === 'grpo' ? docEntry : null);
  const payment = useVendorPayment(type === 'payment' ? docEntry : null);
  const state = type === 'purchaseOrder'
    ? purchaseOrder
    : type === 'invoice'
      ? invoice
      : type === 'creditNote'
        ? creditNote
        : type === 'debitNote' ? debitNote : type === 'grpo' ? grpo : payment;
  if (!docEntry) return null;

  const record = state.data;
  const total = type === 'payment' ? record?.totalPaymentAmount : record?.amount;

  return (
    <div className="vendor-drawer-overlay open" onClick={onClose}>
      <div className="vendor-drawer open" onClick={(event) => event.stopPropagation()}>
        <button className="vendor-drawer-close" onClick={onClose} aria-label="Close summary"><X size={20} /></button>
        <div className="vendor-drawer-content">
          <div className="vendor-drawer-header">
            <h2>{titleFor(type)}</h2>
            <span className="vendor-drawer-subtitle">CIS exposes header summaries only.</span>
          </div>
          <div className="vendor-drawer-body">
            <VendorDataState loading={state.loading} error={state.error} />
            {record && (
              <>
                <div className="vendor-rfq-detail-card">
                  <div className="vendor-rfq-detail-row"><span className="vendor-rfq-detail-label">Document Number</span><span className="vendor-rfq-detail-value">{formatVendorValue(record.number)}</span></div>
                  <div className="vendor-rfq-detail-row"><span className="vendor-rfq-detail-label">Document Date</span><span className="vendor-rfq-detail-value">{formatVendorDate(record.date)}</span></div>
                  {type !== 'payment' && <div className="vendor-rfq-detail-row"><span className="vendor-rfq-detail-label">Due Date</span><span className="vendor-rfq-detail-value">{formatVendorDate(record.dueDate)}</span></div>}
                  {type === 'payment' && <div className="vendor-rfq-detail-row"><span className="vendor-rfq-detail-label">Cash Amount</span><span className="vendor-rfq-detail-value">{formatVendorAmount(record.cashAmount)}</span></div>}
                  {type === 'payment' && <div className="vendor-rfq-detail-row"><span className="vendor-rfq-detail-label">Transfer Amount</span><span className="vendor-rfq-detail-value">{formatVendorAmount(record.transferAmount)}</span></div>}
                  <div className="vendor-rfq-detail-row"><span className="vendor-rfq-detail-label">Total</span><span className="vendor-rfq-detail-value">{formatVendorAmount(total)}</span></div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.6 }}>{UNKNOWN_CURRENCY_NOTE} Detail lines, files, and document associations are not provided.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
