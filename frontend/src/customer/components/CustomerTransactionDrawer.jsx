import { X } from 'lucide-react';
import {
  useCustomerDelivery,
  useCustomerInvoice,
  useCustomerPayment,
} from '../hooks/useCustomerApi';
import {
  formatAmount,
  formatSapDate,
  formatValue,
  UNKNOWN_TRANSACTION_CURRENCY_NOTE,
} from '../utils/customerFormatters';
import CustomerDataState from './CustomerDataState';

function DetailRow({ label, children }) {
  return (
    <tr>
      <td style={{ fontWeight: 600 }}>{label}</td>
      <td>{children}</td>
    </tr>
  );
}

function DetailRows({ record, type }) {
  const total = type === 'payment' ? record.totalPaymentAmount : record.amount;

  return (
    <table className="customer-table">
      <tbody>
        <DetailRow label="Document Number">{formatValue(record.number)}</DetailRow>
        <DetailRow label="Document Date">{formatSapDate(record.date)}</DetailRow>
        {type !== 'payment' && (
          <DetailRow label="Due Date">{formatSapDate(record.dueDate)}</DetailRow>
        )}
        {type === 'invoice' && (
          <DetailRow label="Paid Amount">{formatAmount(record.paidAmount)}</DetailRow>
        )}
        {type === 'invoice' && (
          <DetailRow label="Outstanding">{formatAmount(record.outstandingAmount)}</DetailRow>
        )}
        {type === 'payment' && (
          <DetailRow label="Cash Amount">{formatAmount(record.cashAmount)}</DetailRow>
        )}
        {type === 'payment' && (
          <DetailRow label="Transfer Amount">{formatAmount(record.transferAmount)}</DetailRow>
        )}
        <DetailRow label="Total">{formatAmount(total)}</DetailRow>
        {type !== 'payment' && (
          <DetailRow label="SAP Document Status">{formatValue(record.status)}</DetailRow>
        )}
      </tbody>
    </table>
  );
}

function LineItems({ lines }) {
  if (!lines?.length) return null;

  return (
    <table className="customer-table" style={{ marginTop: '24px' }}>
      <thead>
        <tr>
          <th>Item</th>
          <th>Description</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Line Total</th>
        </tr>
      </thead>
      <tbody>
        {lines.map((line) => (
          <tr key={`${line.lineNumber}-${line.itemCode}`}>
            <td>{formatValue(line.itemCode)}</td>
            <td>{formatValue(line.description)}</td>
            <td>{formatValue(line.quantity)}</td>
            <td>{formatAmount(line.unitPrice)}</td>
            <td>{formatAmount(line.lineTotal)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function drawerTitle(type) {
  if (type === 'invoice') return 'Invoice Details';
  if (type === 'delivery') return 'SAP Delivery Document Details';
  return 'Incoming Payment Details';
}

export default function CustomerTransactionDrawer({ type, docEntry, onClose }) {
  const invoice = useCustomerInvoice(type === 'invoice' ? docEntry : null);
  const delivery = useCustomerDelivery(type === 'delivery' ? docEntry : null);
  const payment = useCustomerPayment(type === 'payment' ? docEntry : null);
  const state = type === 'invoice' ? invoice : type === 'delivery' ? delivery : payment;

  if (!docEntry) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.42)', zIndex: 1000 }}
      onClick={onClose}
    >
      <aside
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          height: '100%',
          width: 'min(560px, 100%)',
          background: '#fff',
          padding: '28px',
          overflowY: 'auto',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close details"
          style={{ float: 'right', border: 0, background: 'none', cursor: 'pointer' }}
        >
          <X />
        </button>
        <h2 style={{ marginBottom: '8px' }}>{drawerTitle(type)}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>
          {UNKNOWN_TRANSACTION_CURRENCY_NOTE}
        </p>
        <CustomerDataState loading={state.loading} error={state.error} />
        {state.data && <DetailRows record={state.data} type={type} />}
        <LineItems lines={state.data?.lines} />
      </aside>
    </div>
  );
}
