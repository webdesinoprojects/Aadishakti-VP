import { useEffect } from 'react';
import { FileText, X } from 'lucide-react';

const imagePattern = /\.(avif|gif|jpe?g|png|webp)$/i;

export default function PortalDocumentDrawer({ item, role = 'vendor', kind = 'statement', onClose }) {
  useEffect(() => {
    if (!item) return undefined;
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [item, onClose]);

  if (!item) return null;
  const documentUrl = item.documentUrl || item.media?.url;
  const documentName = item.originalName || item.media?.name || item.title || 'Document';
  const isImage = imagePattern.test(documentName || documentUrl || '');
  const isStatement = kind === 'statement';
  const isReceipt = kind === 'receipt';

  return (
    <div className={`portal-document-layer portal-document-layer--${role}`} role="presentation">
      <button className="portal-document-backdrop" type="button" aria-label="Close document preview" onClick={onClose} />
      <aside className="portal-document-drawer" role="dialog" aria-modal="true" aria-labelledby="portal-document-title">
        <header className="portal-document-header">
          <div><span>{isReceipt ? 'Payment proof' : isStatement ? 'Statement document' : 'Document review'}</span><h2 id="portal-document-title">{documentName}</h2></div>
          <button type="button" onClick={onClose} aria-label="Close document preview"><X size={21} /></button>
        </header>

        <div className="portal-document-body">
          <dl className="portal-document-meta">
            <div><dt>{isReceipt ? 'Payment reference' : isStatement ? 'Quarter' : 'Document type'}</dt><dd>{isReceipt ? item.payment_reference : isStatement ? item.quarter : item.document_type}</dd></div>
            <div><dt>Status</dt><dd><span className={statusClass(item.status)}>{item.status}</span></dd></div>
            <div><dt>Submitted</dt><dd>{new Date(item.createdAt || item.created_at).toLocaleString()}</dd></div>
            <div><dt>{isReceipt ? 'Amount' : 'Admin note'}</dt><dd>{isReceipt ? item.amount ?? 'Not supplied' : item.reviewNote || item.review_note || 'No note provided'}</dd></div>
          </dl>

          <section className="portal-document-preview">
            <div><FileText size={18} /><strong>Document preview</strong></div>
            {documentUrl ? (
              isImage
                ? <img src={documentUrl} alt={documentName} />
                : <iframe src={documentUrl} title={documentName} />
            ) : <p>Document is still processing.</p>}
          </section>
        </div>

        <footer className="portal-document-footer"><button type="button" onClick={onClose}>Close</button></footer>
      </aside>
    </div>
  );
}

const statusClass = (status = '') => `portal-status portal-status--${status.toLowerCase().replaceAll(' ', '-')}`;
