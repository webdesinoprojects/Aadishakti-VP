import CustomerDataState from '../components/CustomerDataState';
import CustomerPageHeader from '../components/CustomerPageHeader';
import { useCustomerProfile } from '../hooks/useCustomerApi';
import { formatAmount, formatValue } from '../utils/customerFormatters';

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>{label}</label>
      <div style={{ minHeight: '42px', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: '#f8fafc', color: 'var(--text-secondary)' }}>
        {formatValue(value)}
      </div>
    </div>
  );
}

export default function MyProfilePage() {
  const { data, loading, error } = useCustomerProfile();
  if (loading || error || !data) return <CustomerDataState loading={loading} error={error} />;

  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader title="My Profile" subtitle="Read-only active Customer information supplied by CIS." />
      <div className="customer-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--red-core)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 700 }}>
            {(data.name || 'C').charAt(0)}
          </div>
          <div>
            <h2>{formatValue(data.name)}</h2>
            <p style={{ color: 'var(--text-muted)' }}>CIS-owned fields cannot be edited in this portal.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <ReadOnlyField label="Company Name" value={data.name} />
          <ReadOnlyField label="Account Reference" value={data.accountReference} />
          <ReadOnlyField label="Email Address" value={data.email} />
          <ReadOnlyField label="Phone" value={data.phone} />
          <ReadOnlyField label="Mobile" value={data.mobile} />
          <ReadOnlyField label="Tax Reference" value={data.taxReference} />
          <ReadOnlyField label="Customer Group" value={data.groupName} />
          <ReadOnlyField label="Relationship Manager" value={data.relationshipManager} />
          <ReadOnlyField label="Currency" value={data.currency} />
          <ReadOnlyField label="Current Account Balance" value={formatAmount(data.accountBalance, data.currency)} />
        </div>

        <div style={{ marginTop: '28px', padding: '16px', background: '#f8fafc', color: 'var(--text-muted)', borderRadius: '6px' }}>
          Profile editing and password management are unavailable in this read-only CIS integration.
        </div>
      </div>
    </div>
  );
}
