import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerDataState from '../components/CustomerDataState';
import CustomerPageHeader from '../components/CustomerPageHeader';
import CustomerPagination from '../components/CustomerPagination';
import { useCustomerOrders } from '../hooks/useCustomerApi';
import {
  formatAmount,
  formatSapDate,
  UNKNOWN_TRANSACTION_CURRENCY_NOTE,
} from '../utils/customerFormatters';
import { getStatusClass } from '../utils/statusHelpers';

const SEARCH_DEBOUNCE_MS = 400;

export default function OrdersPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [request, setRequest] = useState({ page: 1, q: '' });
  const { data, loading, error } = useCustomerOrders({
    page: request.page,
    pageSize: 10,
    q: request.q,
  });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const effectiveQuery = searchInput.trim();
      setRequest((current) => (
        current.q === effectiveQuery
          ? current
          : { page: 1, q: effectiveQuery }
      ));
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader
        title="Orders"
        subtitle="Customer orders returned by SAP across document statuses."
      />

      <input
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        placeholder="Search order number, date, or status"
        style={{
          padding: '10px 14px',
          width: '320px',
          maxWidth: '100%',
          marginBottom: '10px',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
        }}
      />
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '20px' }}>
        {UNKNOWN_TRANSACTION_CURRENCY_NOTE}
      </p>

      <CustomerDataState loading={loading} error={error} />
      {data && (
        <div className="customer-card" style={{ padding: 0 }}>
          <table className="customer-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Date</th>
                <th>Amount</th>
                <th>SAP Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600 }}>{order.number}</td>
                  <td>{formatSapDate(order.date)}</td>
                  <td>{formatAmount(order.amount)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span>
                  </td>
                  <td>
                    <button
                      className="customer-btn-outline"
                      onClick={() => navigate(`/customer/orders/${order.id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <CustomerPagination
            currentPage={data.pagination.page}
            totalItems={data.pagination.total}
            itemsPerPage={data.pagination.pageSize}
            onPageChange={(page) => setRequest((current) => ({ ...current, page }))}
          />
        </div>
      )}
    </div>
  );
}
