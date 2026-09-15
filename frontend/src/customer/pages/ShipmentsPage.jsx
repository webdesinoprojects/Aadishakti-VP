import { useState } from 'react';
import CustomerDataState from '../components/CustomerDataState';
import CustomerPageHeader from '../components/CustomerPageHeader';
import CustomerPagination from '../components/CustomerPagination';
import CustomerTransactionDrawer from '../components/CustomerTransactionDrawer';
import { useCustomerDeliveries } from '../hooks/useCustomerApi';
import {
  formatAmount,
  formatSapDate,
  UNKNOWN_TRANSACTION_CURRENCY_NOTE,
} from '../utils/customerFormatters';

export default function ShipmentsPage() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const { data, loading, error } = useCustomerDeliveries({ page, pageSize: 10 });

  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader
        title="Current Open Deliveries"
        subtitle="Current delivery documents exposed by CIS. These are not live logistics tracking events."
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
                <th>Delivery Number</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>CIS Scope</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((delivery) => (
                <tr key={delivery.id}>
                  <td style={{ fontWeight: 600 }}>{delivery.number}</td>
                  <td>{formatSapDate(delivery.date)}</td>
                  <td>{formatSapDate(delivery.dueDate)}</td>
                  <td className="customer-amount-value">{formatAmount(delivery.amount)}</td>
                  <td>Current open</td>
                  <td>
                    <button className="customer-btn-outline" onClick={() => setSelected(delivery.id)}>
                      View Summary
                    </button>
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No current delivery documents were returned.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <CustomerPagination
            currentPage={data.pagination.page}
            totalItems={data.pagination.total}
            itemsPerPage={data.pagination.pageSize}
            onPageChange={setPage}
          />
        </div>
      )}

      <CustomerTransactionDrawer
        type="delivery"
        docEntry={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
