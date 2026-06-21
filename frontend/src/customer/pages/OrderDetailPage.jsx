import { useParams, Link, NavLink, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Download } from 'lucide-react';
import { getStatusClass } from '../utils/statusHelpers';
import { format } from 'date-fns';

export default function OrderDetailPage() {
  const { id } = useParams();
  const decodedId = decodeURIComponent(id);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/track/${decodedId}`);
        const data = await res.json();
        if (res.ok && data) {
          // Wrap it with mock arrays for the tabs to not crash
          setOrder({ ...data, shipments: [], documents: [], invoices: [], payments: [] });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [decodedId]);

  if (loading) return <div style={{ padding: '40px' }}>Loading...</div>;
  if (!order) return <div style={{ padding: '40px' }}>Order not found.</div>;

  const allSteps = ["Order Confirmed", "Packed", "Shipment Started", "Reached Customer", "Delivered"];
  // Calculate index based on which stages are completed in tracking array
  // We treat "Delivered" as Reached Customer + POD Accepted
  let currentStepIndex = -1;
  order.tracking.forEach((t, i) => {
    if (t.completed) currentStepIndex = i;
  });
  if (order.podStatus === 'Accepted') {
     currentStepIndex = 4; // Delivered
  }

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
        <span className={`status-badge ${getStatusClass(order.status)}`}>
          {order.status === 'Reached Customer' && order.podStatus === 'Accepted' ? 'Delivered' : order.status}
        </span>
      </div>

      <div className="customer-card" style={{ marginBottom: '30px', padding: '30px 40px' }}>
        <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '10px' }}>CUSTOMER PORTAL — ORDER & SHIPMENT TRACKING</h3>
        
        {/* Live Tracking Stepper (Images strictly hidden) */}
        <div className="tracking-stepper">
          <div className="stepper-line"></div>
          <div className="stepper-line-active" style={{ width: `${(Math.max(0, currentStepIndex) / (allSteps.length - 1)) * 100}%` }}></div>
          
          {allSteps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            // Find the tracking timestamp for this step
            let dateStr = '-';
            if (step === 'Delivered' && isCompleted) {
               dateStr = 'Delivery Confirmed';
            } else {
               const trackStage = order.tracking.find(t => t.stage === step);
               if (trackStage && trackStage.timestamp) {
                  dateStr = format(new Date(trackStage.timestamp), 'MMM dd, h:mm a');
               }
            }
            
            return (
              <div key={step} className={`stepper-step ${isCompleted ? 'completed' : ''}`}>
                <div className="step-circle">
                  {isCompleted && <Check size={16} />}
                </div>
                <div className="step-label" style={{ color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step}</div>
                <div className="step-date">{dateStr}</div>
              </div>
            );
          })}
        </div>

        {/* Tabs Row */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '30px' }}>
          <NavLink to={`/customer/orders/${encodeURIComponent(order.id)}`} end style={tabStyle}>Order Details</NavLink>
          <NavLink to={`/customer/orders/${encodeURIComponent(order.id)}/shipments`} style={tabStyle}>Shipments</NavLink>
          <NavLink to={`/customer/orders/${encodeURIComponent(order.id)}/documents`} style={tabStyle}>Documents</NavLink>
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
        <tr><td style={{ width: '200px', fontWeight: '600', background: '#f8fafc' }}>Product</td><td>{order.product || 'Scrap Material'}</td></tr>
        <tr><td style={{ fontWeight: '600', background: '#f8fafc' }}>Price</td><td>₹ {order.amount?.toLocaleString() || '0'}</td></tr>
      </tbody>
    </table>
  );
}

export function OrderDetailShipments() {
  return <div style={{ color: 'var(--text-muted)', padding: '20px' }}>No shipment details available yet.</div>;
}

export function OrderDetailDocuments() {
  return <div style={{ color: 'var(--text-muted)', padding: '20px' }}>No documents available yet.</div>;
}

export function OrderDetailInvoices() {
  return <div style={{ color: 'var(--text-muted)', padding: '20px' }}>No invoices available yet.</div>;
}

export function OrderDetailPayments() {
  return <div style={{ color: 'var(--text-muted)', padding: '20px' }}>No payments available yet.</div>;
}
