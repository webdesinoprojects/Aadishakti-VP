export default function VendorDataState({ loading, error, empty = false, emptyMessage = 'No records found.' }) {
  if (loading) return <div className="vendor-page">Loading live CIS data...</div>;
  if (error) {
    const message = error.status === 404
      ? 'The requested record was not found.'
      : error.message || 'Vendor data is temporarily unavailable.';
    return <div className="vendor-page" style={{ color: 'var(--text-secondary)' }}>{message}</div>;
  }
  if (empty) return <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>{emptyMessage}</div>;
  return null;
}
