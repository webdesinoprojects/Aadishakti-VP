import { useEffect } from 'react';
import { CheckCircle2, FileText, X, XCircle } from 'lucide-react';

const imagePattern = /\.(avif|gif|jpe?g|png|webp)$/i;

export default function ReconciliationReviewDrawer({ item, busy, onClose, onVerify, onReject }) {
  useEffect(() => {
    if (!item) return undefined;
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', closeOnEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [item, onClose]);

  if (!item) return null;
  const isImage = imagePattern.test(item.originalName || item.documentUrl || '');
  const canReview = item.status === 'Pending Verification';

  return (
    <div className="reconciliation-drawer-layer" role="presentation">
      <button className="reconciliation-drawer-backdrop" aria-label="Close document review" onClick={onClose} />
      <aside className="admin-drawer reconciliation-drawer" role="dialog" aria-modal="true" aria-labelledby="reconciliation-drawer-title">
        <header className="reconciliation-drawer-header">
          <div>
            <span className="reconciliation-eyebrow">Statement review</span>
            <h2 id="reconciliation-drawer-title">{item.originalName || 'Statement document'}</h2>
          </div>
          <button className="reconciliation-icon-button" type="button" onClick={onClose} aria-label="Close review"><X size={21} /></button>
        </header>

        <div className="reconciliation-drawer-body">
          <dl className="reconciliation-meta-grid">
            <div><dt>Partner ID</dt><dd>{item.userId}</dd></div>
            <div><dt>Role</dt><dd>{item.role}</dd></div>
            <div><dt>Quarter</dt><dd>{item.quarter}</dd></div>
            <div><dt>Submitted</dt><dd>{new Date(item.createdAt).toLocaleString()}</dd></div>
          </dl>

          <section className="reconciliation-preview-card">
            <div className="reconciliation-preview-heading"><FileText size={18} /><strong>Document preview</strong></div>
            {item.documentUrl ? (
              isImage
                ? <img className="reconciliation-document-image" src={item.documentUrl} alt={item.originalName || 'Submitted statement'} />
                : <iframe className="reconciliation-document-frame" src={item.documentUrl} title={item.originalName || 'Submitted statement'} />
            ) : <div className="reconciliation-preview-empty">Document is still processing.</div>}
          </section>
        </div>

        <footer className="reconciliation-drawer-footer">
          <button className="btn btn-secondary" type="button" onClick={onClose}>Close</button>
          {canReview && <div>
            <button className="btn btn-danger" type="button" disabled={busy} onClick={() => onReject(item)}><XCircle size={17} /> Reject</button>
            <button className="btn btn-success" type="button" disabled={busy} onClick={() => onVerify(item)}><CheckCircle2 size={17} /> Verify &amp; Lock</button>
          </div>}
        </footer>
      </aside>
    </div>
  );
}
