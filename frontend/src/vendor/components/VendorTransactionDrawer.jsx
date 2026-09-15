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

function SummaryRow({ label, children, amount = false, total = false }) {
  const labelClass = `vendor-summary-label${total ? ' vendor-total-label' : ''}`;
  const valueClass = `vendor-summary-value${amount ? ' vendor-amount-value' : ''}${total ? ' vendor-total-value' : ''}`;
  return (
    <div className={`vendor-summary-row${total ? ' is-total' : ''}`}>
      <span className={labelClass}>{label}</span>
      <span className={valueClass}>{children}</span>
    </div>
  );
}

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
        <div className="vendor-drawer-header">
          <div>
            <h2 className="vendor-drawer-title">{titleFor(type)}</h2>
            <p className="vendor-drawer-subtitle">CIS exposes header summaries only.</p>
          </div>
        </div>
        <div className="vendor-drawer-body">
          <VendorDataState loading={state.loading} error={state.error} />
          {record && (
            <>
              <div className="vendor-summary-card">
                <SummaryRow label="Document Number">{formatVendorValue(record.number)}</SummaryRow>
                <SummaryRow label="Document Date">{formatVendorDate(record.date)}</SummaryRow>
                {type !== 'payment' && <SummaryRow label="Due Date">{formatVendorDate(record.dueDate)}</SummaryRow>}
                {type === 'payment' && <SummaryRow label="Cash Amount" amount>{formatVendorAmount(record.cashAmount)}</SummaryRow>}
                {type === 'payment' && <SummaryRow label="Transfer Amount" amount>{formatVendorAmount(record.transferAmount)}</SummaryRow>}
                <SummaryRow label="Total" amount total>{formatVendorAmount(total)}</SummaryRow>
              </div>
              <p className="vendor-summary-note">
                {UNKNOWN_CURRENCY_NOTE} Detail lines, files, and document associations are not provided.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
