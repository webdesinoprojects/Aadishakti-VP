import { useState } from 'react';
import { PaymentDrawer } from '../components/CustomerDrawers';
import CustomerPageHeader from '../components/CustomerPageHeader';
import CustomerPagination from '../components/CustomerPagination';
import { useCustomerData } from '../hooks/useCustomerData';

export default function PaymentsPage() {
  const { data, loading } = useCustomerData();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedpayment] = useState(null);
  const itemsPerPage = 10;

  if (loading || !data) return <div style={{ padding: '40px' }}>Loading...</div>;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = (data.payments || []).slice(indexOfFirst, indexOfLast);

  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader title="Payments" subtitle="History of all your completed payments." />
      <div className="customer-card" style={{ padding: 0 }}>
        <table className="customer-table">
          <thead>
            <tr><th>Payment ID</th><th>Invoice ID</th><th>Date</th><th>Method</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {currentItems.map(p => (
              <tr key={p.id} onClick={() => setSelectedpayment(p)} style={{cursor: "pointer"}} className="hover-row">
                <td style={{ fontWeight: '600' }}>{p.id}</td>
                <td>{p.invoiceId}</td>
                <td>{p.date}</td>
                <td>{p.method}</td>
                <td style={{ fontWeight: '600' }}>₹ {p.amount.toLocaleString('en-IN')}</td>
                <td><span className="status-badge delivered">{p.status}</span></td>
              </tr>
            ))}
            {currentItems.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No payments found.</td></tr>}
          </tbody>
        </table>
        {data.payments?.length > 0 && <CustomerPagination currentPage={currentPage} totalPages={Math.ceil(data.payments.length / itemsPerPage)} onPageChange={setCurrentPage} totalItems={data.payments.length} itemsPerPage={itemsPerPage} />}
      </div>
      <PaymentDrawer payment={selectedPayment} onClose={() => setSelectedpayment(null)} />
    </div>
  );
}
