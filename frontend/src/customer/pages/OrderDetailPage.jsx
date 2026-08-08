import { ArrowLeft } from 'lucide-react';
import {
  Link,
  NavLink,
  Outlet,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import CustomerDataState from '../components/CustomerDataState';
import { useCustomerOrder } from '../hooks/useCustomerApi';
import {
  formatAmount,
  formatSapDate,
  formatValue,
  UNKNOWN_TRANSACTION_CURRENCY_NOTE,
} from '../utils/customerFormatters';
import { getStatusClass } from '../utils/statusHelpers';

const tabStyle = ({ isActive }) => ({
  padding: '16px 24px',
  borderBottom: isActive ? '2px solid var(--red-core)' : '2px solid transparent',
  color: isActive ? 'var(--red-core)' : 'var(--text-secondary)',
  fontWeight: isActive ? 600 : 500,
  textDecoration: 'none',
  display: 'inline-block',
});

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, loading, error } = useCustomerOrder(id);

  if (loading || error || !order) {
    return <CustomerDataState loading={loading} error={error} />;
  }

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link
          to="/customer/orders"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Orders
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Order #{order.number}</h1>
        <span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span>
      </div>

      <div className="customer-card" style={{ marginBottom: '30px', padding: '30px 40px' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>
          SAP document reference: {order.id}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '18px' }}>
          {UNKNOWN_TRANSACTION_CURRENCY_NOTE}
        </p>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '30px' }}>
          <NavLink to={`/customer/orders/${order.id}`} end style={tabStyle}>Order Details</NavLink>
          <NavLink to={`/customer/orders/${order.id}/shipments`} style={tabStyle}>Deliveries</NavLink>
          <NavLink to={`/customer/orders/${order.id}/documents`} style={tabStyle}>Documents</NavLink>
        </div>
        <Outlet context={{ order }} />
      </div>
    </div>
  );
}

export function OrderDetailIndex() {
  const { order } = useOutletContext();

  return (
    <>
      <table className="customer-table" style={{ border: '1px solid var(--border-color)' }}>
        <tbody>
          <tr><td style={{ fontWeight: 600 }}>Document Date</td><td>{formatSapDate(order.date)}</td></tr>
          <tr><td style={{ fontWeight: 600 }}>Due Date</td><td>{formatSapDate(order.dueDate)}</td></tr>
          <tr><td style={{ fontWeight: 600 }}>Total Amount</td><td>{formatAmount(order.amount)}</td></tr>
          <tr><td style={{ fontWeight: 600 }}>SAP Document Status</td><td>{order.status}</td></tr>
        </tbody>
      </table>

      <h3 style={{ margin: '28px 0 12px' }}>Order Lines</h3>
      <table className="customer-table">
        <thead>
          <tr>
            <th>Line</th>
            <th>Item Code</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Line Total</th>
          </tr>
        </thead>
        <tbody>
          {order.lines.map((line) => (
            <tr key={`${line.lineNumber}-${line.itemCode}`}>
              <td>{formatValue(line.lineNumber)}</td>
              <td>{formatValue(line.itemCode)}</td>
              <td>{formatValue(line.description)}</td>
              <td>{formatValue(line.quantity)}</td>
              <td>{formatAmount(line.unitPrice)}</td>
              <td>{formatAmount(line.lineTotal)}</td>
            </tr>
          ))}
          {order.lines.length === 0 && (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No documented line items were returned.</td></tr>
          )}
        </tbody>
      </table>
    </>
  );
}

function InternalState({ children }) {
  return <div style={{ color: 'var(--text-muted)', padding: '20px' }}>{children}</div>;
}

export function OrderDetailShipments() {
  return (
    <InternalState>
      SAP does not expose a safe order-to-delivery relationship here. View current SAP delivery documents from the Deliveries page.
    </InternalState>
  );
}

export function OrderDetailDocuments() {
  return (
    <InternalState>
      Downloadable order files are not exposed by the SAP API. Internal document workflows remain a Phase 2 feature.
    </InternalState>
  );
}

export function OrderDetailInvoices() {
  return (
    <InternalState>
      SAP invoices are available on the Invoices page, but no order association is assumed from undocumented fields.
    </InternalState>
  );
}

export function OrderDetailPayments() {
  return (
    <InternalState>
      Incoming payments are available on the Payments page, but no order association is assumed from undocumented fields.
    </InternalState>
  );
}
