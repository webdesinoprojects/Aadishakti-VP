import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CustomerPageHeader from '../components/CustomerPageHeader';
import CustomerPagination from '../components/CustomerPagination';
import { useCustomerData } from '../hooks/useCustomerData';
import { getStatusClass } from '../utils/statusHelpers';

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data, loading } = useCustomerData();
  const navigate = useNavigate();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  if (loading || !data) return <div style={{ padding: '40px' }}>Loading orders...</div>;

  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader 
        title="All Orders" 
        subtitle="View and manage your purchase orders."
      />

      <div className="customer-card" style={{ padding: 0 }}>
        <table className="customer-table">
          <thead>
            <tr>
              <th>Order No.</th>
              <th>Product</th>
              <th>Date</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.orders.slice(indexOfFirstItem, indexOfLastItem).map(order => (
              <tr key={order.id}>
                <td style={{ fontWeight: '600' }}>{order.id}</td>
                <td>{order.product}</td>
                <td>{order.date}</td>
                <td>{order.quantity}</td>
                <td><span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span></td>
                <td style={{ fontWeight: '500' }}>₹ {order.amount.toLocaleString('en-IN')}</td>
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
          </tbody>
        </table>
        <CustomerPagination 
          currentPage={currentPage}
          totalPages={Math.ceil(data.orders.length / itemsPerPage)}
          onPageChange={setCurrentPage}
          totalItems={data.orders.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}
