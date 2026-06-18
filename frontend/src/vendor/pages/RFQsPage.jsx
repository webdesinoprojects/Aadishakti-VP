import { useVendorData } from '../hooks/useVendorData';
import { getStatusClass } from '../utils/statusHelpers';
import { useState } from 'react';
import VendorPagination from '../components/VendorPagination';
import VendorPageHeader from '../components/VendorPageHeader';
import RFQDrawer from '../components/RFQDrawer';

export default function RFQsPage() {
  const { data, loading, error } = useVendorData();
  const [drawerRfq, setDrawerRfq] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRowClick = (rfq) => {
    setDrawerRfq(rfq);
    setIsDrawerOpen(true);
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading RFQs...</div>;
  if (error || !data) return <div style={{ padding: '40px', color: 'var(--red-core)' }}>Error loading data.</div>;

  const { rfqs } = data;

  return (
    <div style={{ padding: '40px' }}>
      <VendorPageHeader 
        title="RFQs / Enquiries" 
        subtitle="View open requests for quotation and submit bids." 
      />

      <div className="vendor-panel">
        <table className="vendor-table">
          <thead>
            <tr>
              <th>RFQ ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rfqs.map((rfq) => (
              <tr key={rfq.id} className="vendor-table-row-clickable" onClick={() => handleRowClick(rfq)}>
                <td>{rfq.id}</td>
                <td style={{ fontWeight: '600' }}>{rfq.title}</td>
                <td>{rfq.category}</td>
                <td>{rfq.deadline}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(rfq.status)}`}>
                    {rfq.status}
                  </span>
                </td>
                <td>
                  <button
                    className={`btn-rfq ${rfq.status === 'Open' ? 'btn-rfq-active' : 'btn-rfq-disabled'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(rfq);
                    }}
                  >
                    {rfq.status === 'Open' ? 'Submit Quotation' : 'View Details'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <VendorPagination totalItems={rfqs.length} />
      </div>
      <RFQDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} rfq={drawerRfq} />
    </div>
  );
}
