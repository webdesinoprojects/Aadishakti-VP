import { useState } from 'react';
import CustomerDataState from '../components/CustomerDataState';
import CustomerPageHeader from '../components/CustomerPageHeader';
import CustomerPagination from '../components/CustomerPagination';
import CustomerTransactionDrawer from '../components/CustomerTransactionDrawer';
import { useCustomerPayments } from '../hooks/useCustomerApi';
import {
  formatAmount,
  formatSapDate,
  UNKNOWN_TRANSACTION_CURRENCY_NOTE,
} from '../utils/customerFormatters';

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const { data, loading, error } = useCustomerPayments({ page, pageSize: 10 });

  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader
        title="Incoming Payments"
        subtitle="Not-cancelled incoming-payment records exposed by CIS. Receipt files and UTR data are not supplied."
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
                <th>Payment Number</th>
                <th>Date</th>
                <th>Cash Amount</th>
                <th>Transfer Amount</th>
                <th>Total Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((payment) => (
                <tr key={payment.id}>
                  <td style={{ fontWeight: 600 }}>{payment.number}</td>
                  <td>{formatSapDate(payment.date)}</td>
                  <td>{formatAmount(payment.cashAmount)}</td>
                  <td>{formatAmount(payment.transferAmount)}</td>
                  <td>{formatAmount(payment.totalPaymentAmount)}</td>
                  <td>
                    <button className="customer-btn-outline" onClick={() => setSelected(payment.id)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No current incoming payments were returned.</td></tr>
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
        type="payment"
        docEntry={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
