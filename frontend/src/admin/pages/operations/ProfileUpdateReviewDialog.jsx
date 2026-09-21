import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function ProfileUpdateReviewDialog({ target, busy, onClose, onSubmit }) {
  const [note, setNote] = useState('');
  useEffect(() => setNote(''), [target]);
  if (!target) return null;

  const rejecting = target.action === 'reject';
  const submit = (event) => {
    event.preventDefault();
    const reviewNote = note.trim();
    if (rejecting && !reviewNote) return;
    onSubmit(target.request, target.action, reviewNote);
  };

  return <div className="modal-overlay profile-review-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !busy && onClose()}>
    <form className="modal" role="dialog" aria-modal="true" aria-labelledby="profile-review-title" onSubmit={submit}>
      <div className="modal-header">
        <h2 className="modal-title" id="profile-review-title">{rejecting ? 'Reject profile correction' : 'Approve profile correction'}</h2>
      </div>
      <div className="modal-body">
        <p className="profile-review-copy">
          {rejecting ? 'Explain why' : 'Review'} <strong>{target.request.requestReference}</strong>. The message will be visible to the {String(target.request.role || 'partner').toLowerCase()}.
        </p>
        <label className="profile-review-field" htmlFor="profile-review-note">
          <span>{rejecting ? 'Rejection reason *' : 'Message to partner (optional)'}</span>
          <textarea id="profile-review-note" rows="5" maxLength="2000" required={rejecting} autoFocus value={note} onChange={(event) => setNote(event.target.value)} placeholder={rejecting ? 'Explain what must be corrected before resubmitting.' : 'Add any helpful confirmation or next step.'} />
          <small>{note.length}/2000 characters</small>
        </label>
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" type="button" disabled={busy} onClick={onClose}>Cancel</button>
        <button className={`btn btn-${rejecting ? 'danger' : 'success'}`} disabled={busy || (rejecting && !note.trim())}>
          {rejecting ? <XCircle size={17} /> : <CheckCircle2 size={17} />}
          {busy ? 'Saving...' : rejecting ? 'Reject and notify' : 'Approve and notify'}
        </button>
      </div>
    </form>
  </div>;
}
