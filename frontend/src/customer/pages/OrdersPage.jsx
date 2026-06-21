import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import CustomerPageHeader from '../components/CustomerPageHeader';
import { getStatusClass } from '../utils/statusHelpers';

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders');
        const data = await res.json();
        // Since we don't have auth, just show all live orders for the demo
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  if (loading) return <div style={{ padding: '40px' }}>Loading orders...</div>;

  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader 
        title="All Orders" 
        subtitle="View and track your live purchase orders."
      />

      <div className="customer-card" style={{ padding: 0 }}>
        <table className="customer-table">
          <thead>
            <tr>
              <th>Order No.</th>
              <th>Product</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(indexOfFirstItem, indexOfLastItem).map(order => (
              <tr key={order.id}>
                <td style={{ fontWeight: '600' }}>{order.id}</td>
                <td>{order.product || 'Scrap Material'}</td>
                <td>{order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : '-'}</td>
                <td style={{ fontWeight: '500' }}>₹ {order.amount ? order.amount.toLocaleString('en-IN') : '0'}</td>
                <td><span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span></td>
                <td>
                  <button 
                    className="customer-btn-outline" 
                    onClick={() => navigate(`/customer/orders/${encodeURIComponent(order.id)}`)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>No active orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
