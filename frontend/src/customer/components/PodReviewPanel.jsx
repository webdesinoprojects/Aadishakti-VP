import { useState } from 'react';

export default function PodReviewPanel({ order, onReview }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const review = async (action) => {
    if (action === 'reject' && !reason.trim()) {
      setMessage('Please enter a reason for rejecting the proof.');
      return;
    }
    setBusy(true);
    setMessage('');
    try {
      await onReview({ action, note: reason.trim() });
      setRejecting(false);
      setReason('');
      setMessage(action === 'accept' ? 'Proof of delivery accepted.' : 'Proof rejected. The vendor can upload a replacement.');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Unable to review proof of delivery.');
    } finally {
      setBusy(false);
    }
  };

  if (!order.pod_image_url) {
    return <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>POD status: {order.pod_status || 'Awaited'}</p>;
  }

  return (
    <section style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
      <h3 style={{ marginBottom: '8px' }}>Proof of Delivery</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Status: {order.pod_status}</p>
      <a href={order.pod_image_url} target="_blank" rel="noreferrer" className="customer-btn-outline" style={{ display: 'inline-block', textDecoration: 'none' }}>
        View delivery proof
      </a>
      {order.pod_status === 'Under Review' && !rejecting && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
          <button type="button" className="customer-btn-outline is-active" disabled={busy} onClick={() => review('accept')}>Accept Delivery</button>
          <button type="button" className="customer-btn-outline" disabled={busy} onClick={() => setRejecting(true)}>Reject Proof</button>
        </div>
      )}
      {order.pod_status === 'Under Review' && rejecting && (
        <div style={{ marginTop: '16px', display: 'grid', gap: '10px' }}>
          <label htmlFor="pod-rejection-reason"><strong>Reason for rejection</strong></label>
          <textarea id="pod-rejection-reason" rows="3" value={reason} onChange={(event) => setReason(event.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '4px', font: 'inherit' }} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="customer-btn-outline is-active" disabled={busy} onClick={() => review('reject')}>Submit Rejection</button>
            <button type="button" className="customer-btn-outline" disabled={busy} onClick={() => { setRejecting(false); setMessage(''); }}>Cancel</button>
          </div>
        </div>
      )}
      {message && <p role="status" style={{ marginTop: '14px', color: 'var(--text-secondary)' }}>{message}</p>}
    </section>
  );
}
