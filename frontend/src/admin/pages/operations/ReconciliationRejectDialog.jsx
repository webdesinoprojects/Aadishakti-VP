import { useEffect, useState } from 'react';
import { XCircle } from 'lucide-react';

export default function ReconciliationRejectDialog({ item, busy, onClose, onSubmit }) {
  const [reason, setReason] = useState('');

  useEffect(() => setReason(''), [item]);
  if (!item) return null;

  const submit = (event) => {
    event.preventDefault();
    const value = reason.trim();
    if (value) onSubmit(item, value);
  };

  return (
    <div className="modal-overlay reconciliation-reject-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !busy && onClose()}>
      <form className="modal" role="dialog" aria-modal="true" aria-labelledby="reconciliation-reject-title" onSubmit={submit}>
        <div className="modal-header">
          <h2 className="modal-title" id="reconciliation-reject-title">Reject statement</h2>
        </div>
        <div className="modal-body">
          <p className="reconciliation-reject-context">Explain why <strong>{item.originalName}</strong> for <strong>{item.quarter}</strong> cannot be accepted.</p>
          <div className="form-group">
            <label className="form-label required" htmlFor="reconciliation-reason">Rejection reason</label>
            <textarea id="reconciliation-reason" className="form-textarea" rows="5" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Example: The statement is incomplete. Please upload all pages." required autoFocus />
            <p className="form-help">This message will be visible to the customer or vendor.</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" type="button" disabled={busy} onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" disabled={busy || !reason.trim()}><XCircle size={17} /> {busy ? 'Rejecting...' : 'Reject statement'}</button>
        </div>
      </form>
    </div>
  );
}
