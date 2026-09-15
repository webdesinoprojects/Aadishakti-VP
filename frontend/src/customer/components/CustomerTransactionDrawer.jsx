import { X } from 'lucide-react';
import { useCustomerCreditNote, useCustomerDelivery, useCustomerInvoice, useCustomerPayment } from '../hooks/useCustomerApi';
import { formatAmount, formatSapDate, formatValue, UNKNOWN_TRANSACTION_CURRENCY_NOTE } from '../utils/customerFormatters';
import CustomerDataState from './CustomerDataState';

function DetailRow({ label, children, amount = false, total = false }) {
  const valueClass = amount
    ? `customer-amount-value${total ? ' customer-total-value' : ''}`
    : undefined;
  return <tr><td className={total ? 'customer-total-label' : undefined} style={{ fontWeight: 600 }}>{label}</td><td className={valueClass}>{children}</td></tr>;
}

function DetailRows({ record, type }) {
  const total = type === 'payment' ? record.totalPaymentAmount : record.amount;
  return (
    <table className="customer-table">
      <tbody>
        <DetailRow label="Document Number">{formatValue(record.number)}</DetailRow>
        <DetailRow label="Document Date">{formatSapDate(record.date)}</DetailRow>
        {type !== 'payment' && <DetailRow label="Due Date">{formatSapDate(record.dueDate)}</DetailRow>}
        {type === 'payment' && <DetailRow label="Cash Amount" amount>{formatAmount(record.cashAmount)}</DetailRow>}
        {type === 'payment' && <DetailRow label="Transfer Amount" amount>{formatAmount(record.transferAmount)}</DetailRow>}
        <DetailRow label="Total" amount total>{formatAmount(total)}</DetailRow>
        {type !== 'payment' && <DetailRow label="CIS Scope">Current open record</DetailRow>}
      </tbody>
    </table>
  );
}

const drawerTitle = (type) => type === 'invoice'
  ? 'Invoice Summary'
  : type === 'creditNote' ? 'AR Credit Note Summary'
    : type === 'delivery' ? 'Delivery Summary' : 'Incoming Payment Summary';

export default function CustomerTransactionDrawer({ type, docEntry, onClose }) {
  const invoice = useCustomerInvoice(type === 'invoice' ? docEntry : null);
  const creditNote = useCustomerCreditNote(type === 'creditNote' ? docEntry : null);
  const delivery = useCustomerDelivery(type === 'delivery' ? docEntry : null);
  const payment = useCustomerPayment(type === 'payment' ? docEntry : null);
  const state = type === 'invoice' ? invoice : type === 'creditNote' ? creditNote : type === 'delivery' ? delivery : payment;
  if (!docEntry) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.42)', zIndex: 1000 }} onClick={onClose}>
      <aside style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: 'min(560px, 100%)', background: '#fff', padding: '28px', overflowY: 'auto' }} onClick={(event) => event.stopPropagation()}>
        <button onClick={onClose} aria-label="Close details" style={{ float: 'right', border: 0, background: 'none', cursor: 'pointer' }}><X /></button>
        <h2 style={{ marginBottom: '8px' }}>{drawerTitle(type)}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '8px' }}>{UNKNOWN_TRANSACTION_CURRENCY_NOTE}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>
          CIS exposes header summaries only; line items and downloadable documents are unavailable.
        </p>
        <CustomerDataState loading={state.loading} error={state.error} />
        {state.data && <DetailRows record={state.data} type={type} />}
      </aside>
    </div>
  );
}
