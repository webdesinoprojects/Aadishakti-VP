import { useState } from 'react';
import { CheckCircle2, ClipboardCheck, Clock3, Eye, Inbox, XCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { portalWorkflowsAPI } from '../../utils/api';
import { DocumentPreview, WorkflowDialog, WorkflowDrawer, WorkflowEmpty, WorkflowMeta, WorkflowStatus, WorkflowSummary, WorkflowTableCard } from './WorkflowPrimitives';
import { formatDate, titleize } from './workflowFormatters';

const finalStatuses = new Set(['approved', 'rejected', 'fulfilled', 'closed']);

export default function CustomerRequestsPanel({ items, onReload }) {
  const [selected, setSelected] = useState(null);
  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const { success, error } = useToast();
  const ask = (status) => { setNote(selected?.review_note || ''); setDecision({ item: selected, status }); };
  const review = async () => {
    if (decision.status === 'rejected' && !note.trim()) return error('Enter a rejection reason for the customer.');
    setBusy(true);
    try { await portalWorkflowsAPI.reviewCustomerRequest(decision.item.id, { status: decision.status, reviewNote: note.trim() }); success(`Customer request marked ${titleize(decision.status)}.`); setDecision(null); setSelected(null); await onReload(); }
    catch (requestError) { error(requestError.response?.data?.error || 'Customer request update failed.'); }
    finally { setBusy(false); }
  };
  return <>
    <div className="workflow-summary-grid"><WorkflowSummary icon={Inbox} label="Total requests" value={items.length} /><WorkflowSummary icon={Clock3} label="Needs attention" value={items.filter((item) => ['submitted', 'in_review'].includes(item.status)).length} tone="amber" /><WorkflowSummary icon={ClipboardCheck} label="Completed" value={items.filter((item) => ['fulfilled', 'closed'].includes(item.status)).length} tone="green" /></div>
    <WorkflowTableCard title="Customer requests" description="Review quality claims, certificates and document requests." count={items.length}><table className="responsive-table workflow-table"><thead><tr><th>Reference</th><th>Customer</th><th>Request type</th><th>Subject</th><th>Related reference</th><th>Status</th><th>Action</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="workflow-clickable-row" tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && setSelected(item)} onClick={() => setSelected(item)}><td><strong>{item.request_reference}</strong><small>{formatDate(item.created_at)}</small></td><td><strong>{item.account?.display_name || 'Unknown customer'}</strong><small>{item.account?.email || 'No email'}</small></td><td>{titleize(item.request_type)}</td><td>{item.subject}</td><td>{item.related_reference || '—'}</td><td><WorkflowStatus status={item.status} /></td><td><button className="btn btn-secondary workflow-view-button" onClick={(event) => { event.stopPropagation(); setSelected(item); }}><Eye size={15} /> Review</button></td></tr>)}{!items.length && <tr><td colSpan="7"><WorkflowEmpty title="No customer requests" copy="Quality claims and document requests will appear here." /></td></tr>}</tbody></table></WorkflowTableCard>
    <WorkflowDrawer open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} eyebrow="Customer request" title={selected?.subject} subtitle={selected?.request_reference} footer={selected && !finalStatuses.has(selected.status) ? <><button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button><div><button className="btn btn-danger" onClick={() => ask('rejected')}><XCircle size={17} /> Reject</button>{selected.status === 'submitted' && <button className="btn btn-secondary" onClick={() => ask('in_review')}><Clock3 size={17} /> Start review</button>}<button className="btn btn-success" onClick={() => ask('approved')}><CheckCircle2 size={17} /> Approve</button></div></> : <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>}>
      {selected && <><dl className="workflow-document-meta"><WorkflowMeta label="Customer" value={selected.account?.display_name} /><WorkflowMeta label="Status" value={<WorkflowStatus status={selected.status} />} /><WorkflowMeta label="Request type" value={titleize(selected.request_type)} /><WorkflowMeta label="Related reference" value={selected.related_reference || 'Not supplied'} /><WorkflowMeta label="Submitted" value={formatDate(selected.created_at, true)} /><WorkflowMeta label="Last updated" value={formatDate(selected.updated_at, true)} /></dl><div className="workflow-copy-card"><strong>Customer description</strong><p>{selected.description || 'No description supplied.'}</p></div>{selected.review_note && <div className="workflow-admin-note"><strong>Admin note</strong><p>{selected.review_note}</p></div>}<DocumentPreview media={selected.attachment} title="Customer attachment" />{selected.result && <DocumentPreview media={selected.result} title="Fulfilled document" />}</>}
    </WorkflowDrawer>
    <WorkflowDialog open={Boolean(decision)} onOpenChange={(open) => !open && !busy && setDecision(null)} title={`${decision?.status === 'in_review' ? 'Start review for' : titleize(decision?.status)} customer request`} description={decision?.item?.request_reference} footer={<><button className="btn btn-secondary" disabled={busy} onClick={() => setDecision(null)}>Cancel</button><button className={`btn ${decision?.status === 'rejected' ? 'btn-danger' : decision?.status === 'in_review' ? 'btn-primary' : 'btn-success'}`} disabled={busy || (decision?.status === 'rejected' && !note.trim())} onClick={review}>{busy ? 'Updating...' : 'Confirm update'}</button></>}><label className="workflow-dialog-field"><span>{decision?.status === 'rejected' ? 'Rejection reason *' : 'Admin note'}</span><textarea rows="5" autoFocus value={note} onChange={(event) => setNote(event.target.value)} placeholder={decision?.status === 'rejected' ? 'Explain what the customer must correct or provide.' : 'Optional note visible to the customer.'} /></label></WorkflowDialog>
  </>;
}
