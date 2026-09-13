import VendorDataState from '../components/VendorDataState';
import VendorPageHeader from '../components/VendorPageHeader';
import { useVendorProfile } from '../hooks/useVendorApi';
import { formatVendorAmount, formatVendorValue } from '../utils/vendorFormatters';

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <label className="profile-field-label">{label}</label>
      <div className="profile-field-value">{formatVendorValue(value)}</div>
    </div>
  );
}

export default function MyProfilePage() {
  const { data, loading, error } = useVendorProfile();
  if (loading || error || !data) return <VendorDataState loading={loading} error={error} />;
  return (
    <div className="vendor-page" style={{ maxWidth: '900px' }}>
      <VendorPageHeader title="My Profile" subtitle="Read-only active Vendor information supplied by CIS." />
      <div className="vendor-panel">
        <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{data.name}</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Vendor reference: {data.accountReference}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          <ReadOnlyField label="Company Name" value={data.name} />
          <ReadOnlyField label="Vendor Group" value={data.groupName} />
          <ReadOnlyField label="Email Address" value={data.email} />
          <ReadOnlyField label="Phone" value={data.phone} />
          <ReadOnlyField label="Mobile" value={data.mobile} />
          <ReadOnlyField label="Tax Reference" value={data.taxReference} />
          <ReadOnlyField label="Relationship Manager" value={data.relationshipManager} />
          <ReadOnlyField label="Currency" value={data.currency} />
          <ReadOnlyField label="Current Account Balance" value={formatVendorAmount(data.accountBalance, data.currency)} />
        </div>
        <p style={{ marginTop: '28px', padding: '16px', background: '#f8fafc', color: 'var(--text-muted)', borderRadius: '6px' }}>
          CIS is read-only. Profile updates, bank details, and password management require the later database-backed workflow.
        </p>
      </div>
    </div>
  );
}
