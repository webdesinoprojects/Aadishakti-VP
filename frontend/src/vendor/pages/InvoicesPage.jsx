import { useVendorData } from '../hooks/useVendorData';
import { getStatusClass } from '../utils/statusHelpers';
import { useState } from 'react';
import VendorPagination from '../components/VendorPagination';
import VendorPageHeader from '../components/VendorPageHeader';
import DocumentViewerModal from '../components/DocumentViewerModal';

export default function InvoicesPage() {
  const { data, loading, error } = useVendorData();
  const [selectedDoc, setSelectedDoc] = useState(null);

  if (loading) return <div style={{ padding: '40px' }}>Loading Invoices...</div>;
  if (error || !data) return <div style={{ padding: '40px', color: 'var(--red-core)' }}>Error loading data.</div>;

  const { invoices, kpis, profile } = data;

  return (
    <div style={{ padding: '40px' }}>
      <VendorPageHeader 
        title="Invoices & Payments" 
        subtitle="View your invoice history and payment statuses."
      >
        <div className="vendor-kpi-card" style={{ width: '250px', padding: '16px 24px' }}>
          <div className="vendor-kpi-value" style={{ fontSize: '24px' }}>₹ {kpis.totalReceivables}</div>
          <div className="vendor-kpi-label" style={{ marginBottom: 0 }}>Total Receivables</div>
        </div>
      </VendorPageHeader>

      <div className="vendor-panel">
        <table className="vendor-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Invoice No</th>
              <th>PO Number</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="vendor-table-row-clickable" onClick={() => setSelectedDoc(inv)}>
                <td>{inv.id}</td>
                <td style={{ fontWeight: '600', color: '#111' }}>{inv.invoiceNo}</td>
                <td>{inv.poNumber}</td>
                <td style={{ fontWeight: '600' }}>₹ {inv.amount}</td>
                <td>{inv.dueDate}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(inv.status)}`}>
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <VendorPagination totalItems={invoices.length} />
      </div>
      <DocumentViewerModal 
        isOpen={!!selectedDoc} 
        onClose={() => setSelectedDoc(null)} 
        data={selectedDoc} 
        type="invoice" 
        vendorProfile={profile} 
      />
    </div>
  );
}
