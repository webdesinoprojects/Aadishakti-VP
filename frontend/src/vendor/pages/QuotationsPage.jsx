import { useVendorData } from '../hooks/useVendorData';
import { getStatusClass } from '../utils/statusHelpers';
import { useState } from 'react';
import VendorPagination from '../components/VendorPagination';
import VendorPageHeader from '../components/VendorPageHeader';
import QuotationDrawer from '../components/QuotationDrawer';

export default function QuotationsPage() {
  const { data, loading, error } = useVendorData();
  const [drawerQt, setDrawerQt] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRowClick = (qt) => {
    setDrawerQt(qt);
    setIsDrawerOpen(true);
  };

  if (loading) return <div className="vendor-page">Loading Quotations...</div>;
  if (error || !data) return <div className="vendor-page" style={{ color: 'var(--red-core)' }}>Error loading data.</div>;

  const { quotations } = data;

  return (
    <div className="vendor-page">
      <VendorPageHeader 
        title="My Quotations" 
        subtitle="Track the status of your submitted bids." 
      />

      <div className="vendor-panel">
        <table className="vendor-table">
          <thead>
            <tr>
              <th>Quotation ID</th>
              <th>RFQ ID</th>
              <th>RFQ Title</th>
              <th>Submitted Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((qt) => (
              <tr key={qt.id} className="vendor-table-row-clickable" onClick={() => handleRowClick(qt)}>
                <td style={{ fontWeight: '600' }}>{qt.id}</td>
                <td>{qt.rfqId}</td>
                <td>{qt.rfqTitle}</td>
                <td>{qt.submittedDate}</td>
                <td style={{ fontWeight: '600' }}>₹ {qt.amount}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(qt.status)}`}>
                    {qt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <VendorPagination totalItems={quotations.length} />
      </div>
      <QuotationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} quotation={drawerQt} />
    </div>
  );
}
