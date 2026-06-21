import { useState, useEffect } from 'react';
import VendorPagination from '../components/VendorPagination';
import VendorPageHeader from '../components/VendorPageHeader';
import PurchaseOrderDrawer from '../components/PurchaseOrderDrawer';
import { getStatusClass } from '../utils/statusHelpers';
import { format } from 'date-fns';

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/vendor/orders');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Orders...</div>;
  if (error) return <div style={{ padding: '40px', color: 'var(--red-core)' }}>Error loading data.</div>;

  const filteredOrders = filter === 'All' ? orders : orders.filter(po => po.status === filter);

  return (
    <div style={{ padding: '40px' }}>
      <VendorPageHeader 
        title="Purchase Orders / Tracking" 
        subtitle="Manage your active orders and update tracking/logistics steps." 
      />

      <div className="vendor-panel">
        <div className="vendor-filter-bar" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {['All', 'Order Confirmed', 'Packed', 'Shipment Started', 'Reached Customer', 'Delivered'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`vendor-filter-btn ${filter === f ? 'active' : ''}`}
              style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', background: filter === f ? 'var(--red-core)' : '#fff', color: filter === f ? '#fff' : '#666', cursor: 'pointer' }}
            >
              {f}
            </button>
          ))}
        </div>

        <table className="vendor-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? filteredOrders.map((po) => (
              <tr key={po.id} className="vendor-table-row-clickable" onClick={() => handleRowClick(po)}>
                <td style={{ fontWeight: '600', color: '#111' }}>{po.id}</td>
                <td>{format(new Date(po.createdAt), 'MMM d, yyyy')}</td>
                <td>{po.customerName}</td>
                <td>{po.product}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(po.status)}`}>
                    {po.status}
                  </span>
                </td>
                <td style={{ fontWeight: '600' }}>₹ {po.amount}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                  No orders found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <PurchaseOrderDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} order={selectedOrder} onUpdate={loadOrders} />
    </div>
  );
}
