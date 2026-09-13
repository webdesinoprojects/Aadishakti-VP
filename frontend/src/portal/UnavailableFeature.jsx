export default function UnavailableFeature({ title, description }) {
  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>{title}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{description}</p>
      </div>
      <div className="customer-card" style={{ maxWidth: '760px' }}>
        <h3 style={{ marginBottom: '12px' }}>Not supplied by the CIS API</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          This is an Aadishakti-owned workflow and requires the planned database-backed implementation.
          Static demonstration records have been removed, so this screen will not present sample data as live data.
        </p>
      </div>
    </div>
  );
}
