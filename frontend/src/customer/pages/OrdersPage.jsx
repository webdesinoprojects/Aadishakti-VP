import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CustomerPageHeader from '../components/CustomerPageHeader';
import customerApi from '../../services/customerApi';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { customerApi.getLogistics().then(setOrders).catch((err) => setError(err.response?.data?.error || 'Unable to load tracked orders.')); }, []);
  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader
        title="Orders & Tracking"
        subtitle="Aadishakti-managed logistics records. CIS Sales Orders are not exposed by the current API contract."
      />
      {error && <p>{error}</p>}
      <div className="customer-card" style={{ padding: 0 }}><table className="customer-table"><thead><tr><th>Order</th><th>Product</th><th>Amount</th><th>Status</th><th>POD</th><th>Action</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td>{order.id}</td><td>{order.product}</td><td>{order.amount}</td><td>{order.status}</td><td>{order.pod_status}</td><td><Link to={`/customer/orders/${encodeURIComponent(order.id)}`} className="customer-btn-outline">Track</Link></td></tr>)}{!orders.length && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No Aadishakti logistics orders are linked to this account.</td></tr>}</tbody></table></div>
    </div>
  );
}
