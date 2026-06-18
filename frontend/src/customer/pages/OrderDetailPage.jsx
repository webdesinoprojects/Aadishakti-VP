import { useParams, Link, NavLink, Outlet } from 'react-router-dom';
import { ArrowLeft, Check, Download } from 'lucide-react';
import { useCustomerData } from '../hooks/useCustomerData';
import { getStatusClass } from '../utils/statusHelpers';

export default function OrderDetailPage() {
  const { id } = useParams();
  const decodedId = decodeURIComponent(id);
  const { data, loading } = useCustomerData();

  if (loading || !data) return <div style={{ padding: '40px' }}>Loading...</div>;

  const order = data.orders.find(o => o.id === decodedId);

  if (!order) return <div style={{ padding: '40px' }}>Order not found.</div>;

  const allSteps = ["Order Confirmed", "In Production", "Dispatched", "In Transit", "Delivered"];
  const currentStepIndex = order.history.length - 1;

  const tabStyle = ({ isActive }) => ({
    padding: '16px 24px',
    background: 'none',
    border: 'none',
    borderBottom: isActive ? '2px solid var(--red-core)' : '2px solid transparent',
    color: isActive ? 'var(--red-core)' : 'var(--text-secondary)',
    fontWeight: isActive ? '600' : '500',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    textDecoration: 'none',
    display: 'inline-block'
  });

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/customer/orders" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
          <ArrowLeft size={16} style={{ marginRight: '8px' }}/> Back to Orders
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>{order.id}</h1>
        <span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span>
      </div>

      <div className="customer-card" style={{ marginBottom: '30px', padding: '30px 40px' }}>
        <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '10px' }}>CUSTOMER PORTAL — ORDER & SHIPMENT TRACKING</h3>
        
        {/* Tracking Stepper */}
        <div className="tracking-stepper">
          <div className="stepper-line"></div>
          {/* Active Line (fill width based on progress) */}
          <div className="stepper-line-active" style={{ width: `${(currentStepIndex / (allSteps.length - 1)) * 100}%` }}></div>
          
          {allSteps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const historyEvent = order.history.find(h => h.status === step);
            
            return (
              <div key={step} className={`stepper-step ${isCompleted ? 'completed' : ''}`}>
                <div className="step-circle">
                  {isCompleted && <Check size={16} />}
                </div>
                <div className="step-label" style={{ color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step}</div>
                <div className="step-date">{historyEvent ? historyEvent.date : '-'}</div>
              </div>
            );
          })}
        </div>

        {/* Tabs Row via NavLink */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '30px' }}>
          <NavLink to={`/customer/orders/${encodeURIComponent(order.id)}`} end style={tabStyle}>Order Details</NavLink>
          <NavLink to={`/customer/orders/${encodeURIComponent(order.id)}/shipments`} style={tabStyle}>Shipments ({order.shipments.length})</NavLink>
          <NavLink to={`/customer/orders/${encodeURIComponent(order.id)}/documents`} style={tabStyle}>Documents ({order.documents.length})</NavLink>
          <NavLink to={`/customer/orders/${encodeURIComponent(order.id)}/invoices`} style={tabStyle}>Invoices ({order.invoices.length})</NavLink>
          <NavLink to={`/customer/orders/${encodeURIComponent(order.id)}/payments`} style={tabStyle}>Payments ({order.payments.length})</NavLink>
        </div>

        {/* Nested Route Content */}
        <Outlet context={{ order }} />

      </div>
    </div>
  );
}

// Child Components for Nested Routes
import { useOutletContext } from 'react-router-dom';

export function OrderDetailIndex() {
  const { order } = useOutletContext();
  return (
    <table className="customer-table" style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
      <tbody>
        <tr><td style={{ width: '200px', fontWeight: '600', background: '#f8fafc' }}>Product</td><td>{order.product}</td></tr>
        <tr><td style={{ fontWeight: '600', background: '#f8fafc' }}>Quantity</td><td>{order.quantity}</td></tr>
        <tr><td style={{ fontWeight: '600', background: '#f8fafc' }}>Price</td><td>₹ {order.price}</td></tr>
        <tr><td style={{ fontWeight: '600', background: '#f8fafc' }}>GST (18%)</td><td>₹ {order.gst}</td></tr>
        <tr><td style={{ fontWeight: '700', background: '#f8fafc' }}>Total Amount</td><td style={{ fontWeight: '700' }}>₹ {order.amount.toLocaleString('en-IN')}</td></tr>
      </tbody>
    </table>
  );
}

export function OrderDetailShipments() {
  const { order } = useOutletContext();
  return (
    <table className="customer-table">
      <thead>
        <tr><th>Shipment ID</th><th>Dispatch Date</th><th>Quantity</th><th>Status</th></tr>
      </thead>
      <tbody>
        {order.shipments.map(s => (
          <tr key={s.id}>
            <td style={{ fontWeight: '600' }}>{s.id}</td>
            <td>{s.date}</td>
            <td>{s.quantity}</td>
            <td><span className={`status-badge ${getStatusClass(s.status)}`}>{s.status}</span></td>
          </tr>
        ))}
        {order.shipments.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No shipments recorded yet.</td></tr>}
      </tbody>
    </table>
  );
}

export function OrderDetailDocuments() {
  const { order } = useOutletContext();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {order.documents.map((doc, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
          <span style={{ fontWeight: '500', fontSize: '14px' }}>{doc.name}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{doc.date}</span>
          <button className="customer-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Download size={14} /> Download</button>
        </div>
      ))}
      {order.documents.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No documents uploaded.</div>}
    </div>
  );
}

export function OrderDetailInvoices() {
  const { order } = useOutletContext();
  return (
    <table className="customer-table">
      <thead>
        <tr><th>Invoice ID</th><th>Amount</th><th>Status</th></tr>
      </thead>
      <tbody>
        {order.invoices.map(inv => (
          <tr key={inv.id}>
            <td style={{ fontWeight: '600' }}>{inv.id}</td>
            <td>₹ {inv.amount.toLocaleString('en-IN')}</td>
            <td><span className="status-badge delivered">{inv.status}</span></td>
          </tr>
        ))}
        {order.invoices.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No invoices generated yet.</td></tr>}
      </tbody>
    </table>
  );
}

export function OrderDetailPayments() {
  const { order } = useOutletContext();
  return (
    <table className="customer-table">
      <thead>
        <tr><th>Payment ID</th><th>Date</th><th>Amount</th></tr>
      </thead>
      <tbody>
        {order.payments.map(p => (
          <tr key={p.id}>
            <td style={{ fontWeight: '600' }}>{p.id}</td>
            <td>{p.date}</td>
            <td>₹ {p.amount.toLocaleString('en-IN')}</td>
          </tr>
        ))}
        {order.payments.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No payments recorded.</td></tr>}
      </tbody>
    </table>
  );
}
