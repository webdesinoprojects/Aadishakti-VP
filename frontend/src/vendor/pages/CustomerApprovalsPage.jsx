import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import vendorApi from '../../services/vendorApi';
import VendorPageHeader from '../components/VendorPageHeader';
import { getStatusClass } from '../utils/statusHelpers';

const approvalStatuses = new Set(['Under Review', 'Accepted', 'Rejected']);

export default function CustomerApprovalsPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    vendorApi.getLogistics()
      .then((items) => setOrders(items.filter((item) => approvalStatuses.has(item.pod_status))))
      .catch((requestError) => setError(requestError.response?.data?.error || 'Unable to load customer approvals.'));
  }, []);

  return (
    <div className="vendor-page">
      <VendorPageHeader title="Customer Approvals" subtitle="Track customer decisions on submitted proof of delivery." />
      {error && <p>{error}</p>}
      <div className="vendor-panel">
        <table className="vendor-table">
          <thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Submitted Proof</th><th>Customer Decision</th><th>Action</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer_name}</td>
                <td>{order.product}</td>
                <td>{order.pod_image_url ? <a href={order.pod_image_url} target="_blank" rel="noreferrer">View POD</a> : 'Replacement required'}</td>
                <td><span className={`status-badge ${getStatusClass(order.pod_status || '')}`}>{order.pod_status}</span></td>
                <td><Link className="vendor-btn-outline" to="/vendor/logistics">Open Tracker</Link></td>
              </tr>
            ))}
            {!orders.length && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No proof-of-delivery decisions are available yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
