import { useState } from 'react';
import { Download } from 'lucide-react';
import { QualityDrawer } from '../components/CustomerDrawers';
import CustomerPageHeader from '../components/CustomerPageHeader';
import CustomerPagination from '../components/CustomerPagination';
import { useCustomerData } from '../hooks/useCustomerData';

export default function QualityPage() {
  const { data, loading } = useCustomerData();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQc, setSelectedqc] = useState(null);
  const itemsPerPage = 10;

  if (loading || !data) return <div style={{ padding: '40px' }}>Loading...</div>;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = (data.quality || []).slice(indexOfFirst, indexOfLast);

  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader title="Quality Certificates (COA)" subtitle="Download Certificates of Analysis for your products." />
      <div className="customer-card" style={{ padding: 0 }}>
        <table className="customer-table">
          <thead>
            <tr><th>QC ID</th><th>Batch No.</th><th>Product</th><th>Date</th><th>Status</th><th>Certificate</th></tr>
          </thead>
          <tbody>
            {currentItems.map(q => (
              <tr key={q.id} onClick={() => setSelectedqc(q)} style={{cursor: "pointer"}} className="hover-row">
                <td style={{ fontWeight: '600' }}>{q.id}</td>
                <td>{q.batch}</td>
                <td>{q.product}</td>
                <td>{q.date}</td>
                <td><span className="status-badge delivered">{q.status}</span></td>
                <td><button className="customer-btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Download size={14}/> {q.file}</button></td>
              </tr>
            ))}
            {currentItems.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No certificates found.</td></tr>}
          </tbody>
        </table>
        {data.quality?.length > 0 && <CustomerPagination currentPage={currentPage} totalPages={Math.ceil(data.quality.length / itemsPerPage)} onPageChange={setCurrentPage} totalItems={data.quality.length} itemsPerPage={itemsPerPage} />}
      </div>
      <QualityDrawer qc={selectedQc} onClose={() => setSelectedqc(null)} />
    </div>
  );
}
