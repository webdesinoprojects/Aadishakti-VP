import { useState } from 'react';
import VendorDataState from '../components/VendorDataState';
import VendorPageHeader from '../components/VendorPageHeader';
import VendorPagination from '../components/VendorPagination';
import VendorTransactionDrawer from '../components/VendorTransactionDrawer';
import { useVendorPayments } from '../hooks/useVendorApi';
import { formatVendorAmount, formatVendorDate, UNKNOWN_CURRENCY_NOTE } from '../utils/vendorFormatters';

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const { data, loading, error } = useVendorPayments({ page, pageSize: 10 });
  return (
    <div className="vendor-page">
      <VendorPageHeader title="Outgoing Payments" subtitle="Not-cancelled outgoing-payment records supplied by CIS. UTR, receipt files, and invoice associations are not exposed." />
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '20px' }}>{UNKNOWN_CURRENCY_NOTE}</p>
      <VendorDataState loading={loading} error={error} />
      {data && (
        <div className="vendor-panel">
          <table className="vendor-table">
            <thead><tr><th>Payment Number</th><th>Date</th><th>Cash Amount</th><th>Transfer Amount</th><th>Total</th><th>Action</th></tr></thead>
            <tbody>
              {data.items.map((payment) => (
                <tr key={payment.id}>
                  <td style={{ fontWeight: 600 }}>{payment.number}</td>
                  <td>{formatVendorDate(payment.date)}</td>
                  <td className="vendor-amount-value">{formatVendorAmount(payment.cashAmount)}</td>
                  <td className="vendor-amount-value">{formatVendorAmount(payment.transferAmount)}</td>
                  <td className="vendor-amount-value vendor-total-value">{formatVendorAmount(payment.totalPaymentAmount)}</td>
                  <td><button className="vendor-btn-outline" onClick={() => setSelected(payment.id)}>View Summary</button></td>
                </tr>
              ))}
              {data.items.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No outgoing payments were returned.</td></tr>}
            </tbody>
          </table>
          <VendorPagination totalItems={data.pagination.total} itemsPerPage={data.pagination.pageSize} currentPage={data.pagination.page} onPageChange={setPage} />
        </div>
      )}
      <VendorTransactionDrawer type="payment" docEntry={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
