import { useVendorData } from '../hooks/useVendorData';
import { getStatusClass } from '../utils/statusHelpers';
import VendorPageHeader from '../components/VendorPageHeader';

export default function DocumentsPage() {
  const { data, loading, error } = useVendorData();

  if (loading) return <div className="vendor-page">Loading Documents...</div>;
  if (error || !data) return <div className="vendor-page" style={{ color: 'var(--red-core)' }}>Error loading data.</div>;

  const { documents } = data;

  return (
    <div className="vendor-page">
      <VendorPageHeader 
        title="Compliance Documents" 
        subtitle="Manage your uploaded certificates and registrations." 
      />

      <div className="vendor-doc-grid">
        {documents.map(doc => (
          <div key={doc.id} className="vendor-doc-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4>{doc.name}</h4>
              <span className={`status-badge ${getStatusClass(doc.status)}`}>{doc.status}</span>
            </div>
            
            <div className="vendor-doc-meta" style={{ marginTop: 'auto' }}>
              <span>Type: {doc.type}</span>
            </div>
            <div className="vendor-doc-meta">
              <span>Uploaded: {doc.uploadedDate}</span>
            </div>
            <div className="vendor-doc-meta" style={{ marginBottom: '20px' }}>
              <span>Expiry: {doc.expiryDate}</span>
            </div>

            <button className="vendor-doc-btn" disabled>Download PDF</button>
          </div>
        ))}
      </div>
    </div>
  );
}
