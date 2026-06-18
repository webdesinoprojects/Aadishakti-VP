import { useVendorData } from '../hooks/useVendorData';
import VendorPagination from '../components/VendorPagination';
import { useState } from 'react';
import PaymentDrawer from '../components/PaymentDrawer';
import VendorPageHeader from '../components/VendorPageHeader';

export default function PaymentsPage() {
  const { data, loading, error } = useVendorData();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (loading) return <div className="vendor-page">Loading Payments...</div>;
  if (error || !data) return <div className="vendor-page" style={{ color: 'var(--red-core)' }}>Error loading data.</div>;

  const { payments } = data;

  const handleRowClick = (pay) => {
    setSelectedPayment(pay);
    setIsDrawerOpen(true);
  };

  const totalPaidThisMonth = payments.reduce((acc, pay) => {
    // Mock sum, parsing commas
    const num = parseInt(pay.amount.replace(/,/g, ''), 10);
    return acc + num;
  }, 0).toLocaleString('en-IN');

  return (
    <div className="vendor-page">
      <VendorPageHeader 
        title="Payments Received" 
        subtitle="Track your recent payouts."
      >
        <div className="vendor-kpi-card" style={{ width: '250px', padding: '16px 24px' }}>
          <div className="vendor-kpi-value" style={{ fontSize: '24px' }}>₹ {totalPaidThisMonth}</div>
          <div className="vendor-kpi-label" style={{ marginBottom: 0 }}>Paid This Month</div>
        </div>
      </VendorPageHeader>

      <div className="vendor-panel">
        <table className="vendor-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Invoice No</th>
              <th>Amount</th>
              <th>Paid Date</th>
              <th>Mode</th>
              <th>UTR / Ref</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((pay) => (
              <tr key={pay.id} className="vendor-table-row-clickable" onClick={() => handleRowClick(pay)}>
                <td>{pay.id}</td>
                <td style={{ fontWeight: '600', color: '#111' }}>{pay.invoiceNo}</td>
                <td style={{ fontWeight: '600' }}>₹ {pay.amount}</td>
                <td>{pay.paidDate}</td>
                <td>{pay.mode}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{pay.utr}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <VendorPagination totalItems={payments.length} />
      </div>
      <PaymentDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} payment={selectedPayment} />
    </div>
  );
}
