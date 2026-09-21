import { FileText } from 'lucide-react';
import { CustomerWorkflowDrawer } from './CustomerWorkflowPrimitives';
import { formatWorkflowDate, titleize, workflowStatusClass } from '../utils/customerWorkflowFormatters';

const imagePattern = /\.(avif|gif|jpe?g|png|webp)$/i;
function RequestFile({ media, title }) {
  if (!media?.url) return null;
  const isImage = imagePattern.test(media.name || media.url);
  return <section className="customer-request-preview"><div><FileText size={17} /><strong>{title}</strong><span>{media.name}</span></div>{isImage ? <img src={media.url} alt={media.name || title} /> : <iframe src={media.url} title={media.name || title} />}</section>;
}

export default function CustomerRequestDrawer({ item, onClose }) {
  return <CustomerWorkflowDrawer open={Boolean(item)} onClose={onClose} eyebrow="Customer request" title={item?.subject} subtitle={item?.request_reference} footer={<button className="customer-workflow-secondary" type="button" onClick={onClose}>Close</button>}>
    {item && <>
      <dl className="customer-workflow-meta">
        <div><dt>Request type</dt><dd>{titleize(item.request_type)}</dd></div>
        <div><dt>Status</dt><dd><span className={workflowStatusClass(item.status)}>{titleize(item.status)}</span></dd></div>
        <div><dt>Related reference</dt><dd>{item.related_reference || 'Not supplied'}</dd></div>
        <div><dt>Submitted</dt><dd>{formatWorkflowDate(item.created_at, true)}</dd></div>
      </dl>
      <section className="customer-request-copy"><strong>Request details</strong><p>{item.description || 'No additional details supplied.'}</p></section>
      {item.review_note && <section className={`customer-request-note ${item.status === 'rejected' ? 'is-rejected' : ''}`}><strong>Aadishakti response</strong><p>{item.review_note}</p></section>}
      <RequestFile media={item.attachment} title="Your attachment" />
      <RequestFile media={item.result} title="Aadishakti result document" />
      {!item.result && ['approved', 'in_review', 'submitted'].includes(item.status) && <div className="customer-request-awaiting"><FileText size={21} /><span>The result document will appear here when Aadishakti fulfils this request.</span></div>}
    </>}
  </CustomerWorkflowDrawer>;
}
