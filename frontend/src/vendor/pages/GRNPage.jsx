import { useVendorData } from '../hooks/useVendorData';
import { getStatusClass } from '../utils/statusHelpers';
import { useState } from 'react';
import VendorPagination from '../components/VendorPagination';
import VendorPageHeader from '../components/VendorPageHeader';
import DocumentViewerModal from '../components/DocumentViewerModal';

export default function GRNPage() {
  const { data, loading, error } = useVendorData();
  const [selectedDoc, setSelectedDoc] = useState(null);

  if (loading) return <div className="vendor-page">Loading GRN...</div>;
  if (error || !data) return <div className="vendor-page" style={{ color: 'var(--red-core)' }}>Error loading data.</div>;

  const { grn, profile } = data;

  return (
    <div className="vendor-page">
      <VendorPageHeader 
        title="GRN & Receipts" 
        subtitle="View Goods Receipt Notes for your deliveries." 
      />

      <div className="vendor-panel">
        <table className="vendor-table">
          <thead>
            <tr>
              <th>GRN No</th>
              <th>PO Number</th>
              <th>Material</th>
              <th>Quantity</th>
              <th>Received Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {grn.map((receipt) => (
              <tr key={receipt.id} className="vendor-table-row-clickable" onClick={() => setSelectedDoc(receipt)}>
                <td style={{ fontWeight: '600', color: '#111' }}>{receipt.grnNo}</td>
                <td>{receipt.poNumber}</td>
                <td>{receipt.material}</td>
                <td style={{ fontWeight: '600' }}>{receipt.quantity}</td>
                <td>{receipt.receivedDate}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(receipt.status)}`}>
                    {receipt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <VendorPagination totalItems={grn.length} />
      </div>
      <DocumentViewerModal 
        isOpen={!!selectedDoc} 
        onClose={() => setSelectedDoc(null)} 
        data={selectedDoc} 
        type="grn" 
        vendorProfile={profile} 
      />
    </div>
  );
}
