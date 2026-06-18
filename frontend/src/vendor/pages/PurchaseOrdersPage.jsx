import { useState } from 'react';
import { useVendorData } from '../hooks/useVendorData';
import { getStatusClass } from '../utils/statusHelpers';
import VendorPagination from '../components/VendorPagination';
import VendorPageHeader from '../components/VendorPageHeader';
import PurchaseOrderDrawer from '../components/PurchaseOrderDrawer';

export default function PurchaseOrdersPage() {
  const { data, loading, error } = useVendorData();
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Orders...</div>;
  if (error || !data) return <div style={{ padding: '40px', color: 'var(--red-core)' }}>Error loading data.</div>;

  const { purchaseOrders } = data;
  const filteredOrders = filter === 'All' ? purchaseOrders : purchaseOrders.filter(po => po.status === filter);

  return (
    <div style={{ padding: '40px' }}>
      <VendorPageHeader 
        title="Purchase Orders" 
        subtitle="Track your active and past orders." 
      />

      <div className="vendor-panel">
        <div className="vendor-filter-bar">
          {['All', 'Confirmed', 'Partially Received', 'Completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`vendor-filter-btn ${filter === f ? 'active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>

        <table className="vendor-table">
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Date</th>
              <th>Delivery Date</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? filteredOrders.map((po) => (
              <tr key={po.poNumber} className="vendor-table-row-clickable" onClick={() => handleRowClick(po)}>
                <td style={{ fontWeight: '600', color: '#111' }}>{po.poNumber}</td>
                <td>{po.date}</td>
                <td>{po.deliveryDate}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(po.status)}`}>
                    {po.status}
                  </span>
                </td>
                <td style={{ fontWeight: '600' }}>₹ {po.amount}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                  No orders found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <VendorPagination totalItems={purchaseOrders.length} />
      </div>
      <PurchaseOrderDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} order={selectedOrder} />
    </div>
  );
}
