import { useState, useEffect } from 'react';
import VendorPagination from '../components/VendorPagination';
import VendorPageHeader from '../components/VendorPageHeader';
import RFQDrawer from '../components/RFQDrawer';
import { getStatusClass } from '../utils/statusHelpers';
import { format } from 'date-fns';

export default function RFQsPage() {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [drawerRfq, setDrawerRfq] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const loadRfqs = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/vendor/rfqs');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setRfqs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRfqs();
  }, []);

  const handleRowClick = (rfq) => {
    setDrawerRfq(rfq);
    setIsDrawerOpen(true);
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Assigned Enquiries...</div>;
  if (error) return <div style={{ padding: '40px', color: 'var(--red-core)' }}>Error loading data.</div>;

  return (
    <div style={{ padding: '40px' }}>
      <VendorPageHeader 
        title="Assigned Enquiries" 
        subtitle="View custom quotes assigned to you by the Admin and chat to clarify requirements." 
      />

      <div className="vendor-panel">
        <table className="vendor-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer Name</th>
              <th>Type</th>
              <th>Date Assigned</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rfqs.map((rfq) => (
              <tr key={rfq.id} className="vendor-table-row-clickable" onClick={() => handleRowClick(rfq)}>
                <td>{rfq.id.substring(0, 8)}...</td>
                <td style={{ fontWeight: '600' }}>{rfq.fullName}</td>
                <td>{rfq.inquiryType}</td>
                <td>{format(new Date(rfq.submittedAt), 'MMM d, yyyy')}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(rfq.status || 'Open')}`}>
                    {rfq.status || 'Open'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-rfq btn-rfq-active"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(rfq);
                    }}
                  >
                    View & Chat
                  </button>
                </td>
              </tr>
            ))}
            {rfqs.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No assigned enquiries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <RFQDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        rfq={drawerRfq} 
        onChatSent={loadRfqs} 
      />
    </div>
  );
}
