export default function CustomerDataState({ loading, error, empty = false, emptyMessage = 'No records found.' }) {
  if (loading) return <div style={{ padding: '40px' }}>Loading live SAP data...</div>;
  if (error) {
    const message = error.status === 404
      ? 'The requested record was not found.'
      : error.message || 'Customer data is temporarily unavailable.';
    return <div style={{ padding: '40px', color: 'var(--text-secondary)' }}>{message}</div>;
  }
  if (empty) return <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>{emptyMessage}</div>;
  return null;
}
