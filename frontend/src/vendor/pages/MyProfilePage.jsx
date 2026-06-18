import { useVendorData } from '../hooks/useVendorData';
import VendorPageHeader from '../components/VendorPageHeader';

export default function MyProfilePage() {
  const { data, loading, error } = useVendorData();

  if (loading) return <div style={{ padding: '40px' }}>Loading Profile...</div>;
  if (error || !data) return <div style={{ padding: '40px', color: 'var(--red-core)' }}>Error loading profile.</div>;

  const { profile } = data;

  return (
    <div style={{ padding: '40px', maxWidth: '800px' }}>
      <VendorPageHeader 
        title="My Profile" 
        subtitle="View your registered business details." 
      />

      <div className="vendor-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{profile.name}</h2>
            <div style={{ fontSize: 'var(--fs-small)', color: 'var(--text-muted)' }}>Vendor Code: {profile.vendorCode}</div>
          </div>
          <div>
            <span className="status-badge status-confirmed">{profile.status}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <label className="profile-field-label">Company Name</label>
            <div className="profile-field-value">{profile.name}</div>
          </div>
          <div>
            <label className="profile-field-label">Vendor Category</label>
            <div className="profile-field-value">{profile.category}</div>
          </div>
          <div>
            <label className="profile-field-label">GST Number</label>
            <div className="profile-field-value">{profile.gst}</div>
          </div>
          <div>
            <label className="profile-field-label">PAN Number</label>
            <div className="profile-field-value">{profile.pan}</div>
          </div>
        </div>

        <div style={{ marginTop: '30px', fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
          Note: To update your profile details or compliance documents, please contact your Aadishakti procurement representative.
        </div>
      </div>
    </div>
  );
}
