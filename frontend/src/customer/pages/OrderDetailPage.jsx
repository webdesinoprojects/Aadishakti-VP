import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import customerApi from '../../services/customerApi';

function OrderTrackingDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { customerApi.getLogistics().then((items) => { const match = items.find((item) => item.id === id); if (match) setOrder(match); else setError('Order not found.'); }).catch((err) => setError(err.response?.data?.error || 'Unable to load order.')); }, [id]);
  return (
    <div style={{ padding: '40px' }}>
      <Link
        to="/customer/orders"
        style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', textDecoration: 'none' }}
      >
        <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Sales Orders
      </Link>
      <div className="customer-card" style={{ maxWidth: '760px', marginTop: '24px' }}>
        {error && <p>{error}</p>}
        {order && <><h2 style={{ marginBottom: '6px' }}>{order.id}</h2><p style={{ color: 'var(--text-muted)' }}>{order.product} · {order.status}</p><div style={{ marginTop: '24px' }}>{(order.tracking || []).map((stage) => <div key={stage.stage} style={{ padding: '16px 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}><strong>{stage.stage}</strong><span>{stage.completed ? (stage.timestamp ? new Date(stage.timestamp).toLocaleString() : 'Completed') : 'Pending'}</span></div>)}</div>{order.pod_image_url && <p style={{ marginTop: '20px' }}><a href={order.pod_image_url} target="_blank" rel="noreferrer">View proof of delivery</a></p>}</>}
      </div>
    </div>
  );
}

export default OrderTrackingDetail;
export const OrderDetailIndex = OrderTrackingDetail;
export const OrderDetailShipments = OrderTrackingDetail;
export const OrderDetailDocuments = OrderTrackingDetail;
export const OrderDetailInvoices = OrderTrackingDetail;
export const OrderDetailPayments = OrderTrackingDetail;
