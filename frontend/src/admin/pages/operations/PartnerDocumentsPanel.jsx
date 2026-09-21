import { useState } from 'react';
import { CheckCircle2, Eye, FileCheck2, FileClock, FileX2, XCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { portalWorkflowsAPI } from '../../utils/api';
import { DocumentPreview, WorkflowDialog, WorkflowDrawer, WorkflowEmpty, WorkflowMeta, WorkflowStatus, WorkflowSummary, WorkflowTableCard } from './WorkflowPrimitives';
import { formatDate } from './workflowFormatters';

export default function PartnerDocumentsPanel({ items, onReload }) {
  const [selected, setSelected] = useState(null);
  const [decision, setDecision] = useState(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const { success, error } = useToast();

  const ask = (status) => {
    setReason('');
    setDecision({ item: selected, status });
    setSelected(null);
  };
  const review = async () => {
    if (decision.status === 'rejected' && !reason.trim()) return error('Enter a rejection reason for the partner.');
    setBusy(true);
    try {
      await portalWorkflowsAPI.reviewDocument(decision.item.id, { status: decision.status, reviewNote: reason.trim() });
      success(decision.status === 'approved' ? 'Document approved.' : 'Document rejected; the reason is visible to the partner.');
      setDecision(null);
      await onReload();
    } catch (requestError) { error(requestError.response?.data?.error || 'Document review failed.'); }
    finally { setBusy(false); }
  };

  return <>
    <div className="workflow-summary-grid">
      <WorkflowSummary icon={FileClock} label="Pending review" value={items.filter((item) => item.status === 'pending').length} tone="amber" />
      <WorkflowSummary icon={FileCheck2} label="Approved" value={items.filter((item) => item.status === 'approved').length} tone="green" />
      <WorkflowSummary icon={FileX2} label="Rejected" value={items.filter((item) => item.status === 'rejected').length} tone="red" />
    </div>
    <WorkflowTableCard title="Partner documents" description="Click any row to review the uploaded file and complete metadata." count={items.length}>
      <table className="responsive-table workflow-table"><thead><tr><th>Partner</th><th>Role</th><th>Title</th><th>Type</th><th>Uploaded</th><th>Status</th><th>Action</th></tr></thead><tbody>
        {items.map((item) => <tr key={item.id} className="workflow-clickable-row" tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && setSelected(item)} onClick={() => setSelected(item)}>
          <td><strong>{item.account?.display_name || 'Unknown partner'}</strong><small>{item.account?.email || 'No email'}</small></td>
          <td><span className="workflow-role-badge">{item.account?.role || 'partner'}</span></td>
          <td>{item.title}</td><td>{item.document_type}</td><td>{formatDate(item.created_at)}</td><td><WorkflowStatus status={item.status} /></td>
          <td><button className="btn btn-secondary workflow-view-button" type="button" onClick={(event) => { event.stopPropagation(); setSelected(item); }}><Eye size={15} /> Review</button></td>
        </tr>)}
        {!items.length && <tr><td colSpan="7"><WorkflowEmpty title="No partner documents yet" copy="New customer and vendor uploads will appear here." /></td></tr>}
      </tbody></table>
    </WorkflowTableCard>

    <WorkflowDrawer open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} eyebrow="Partner document review" title={selected?.title} subtitle={selected?.media?.name || selected?.account?.display_name} footer={selected?.status === 'pending' ? <><button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button><div><button className="btn btn-danger" disabled={busy} onClick={() => ask('rejected')}><XCircle size={17} /> Reject</button><button className="btn btn-success" disabled={busy} onClick={() => ask('approved')}><CheckCircle2 size={17} /> Approve</button></div></> : <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>}>
      {selected && <><dl className="workflow-document-meta"><WorkflowMeta label="Partner" value={selected.account?.display_name} /><WorkflowMeta label="Role" value={selected.account?.role} /><WorkflowMeta label="Document type" value={selected.document_type} /><WorkflowMeta label="Status" value={<WorkflowStatus status={selected.status} />} /><WorkflowMeta label="Document number" value={selected.document_number || 'Not supplied'} /><WorkflowMeta label="Uploaded" value={formatDate(selected.created_at, true)} /><WorkflowMeta label="Issued on" value={formatDate(selected.issued_on)} /><WorkflowMeta label="Expires on" value={formatDate(selected.expires_on)} /></dl>{selected.review_note && <div className="workflow-admin-note"><strong>Admin note</strong><p>{selected.review_note}</p></div>}<DocumentPreview media={selected.media} title="Document preview" /></>}
    </WorkflowDrawer>

    <WorkflowDialog open={Boolean(decision)} onOpenChange={(open) => !open && !busy && setDecision(null)} title={decision?.status === 'approved' ? 'Approve partner document' : 'Reject partner document'} description={decision?.item?.title} footer={<><button className="btn btn-secondary" disabled={busy} onClick={() => setDecision(null)}>Cancel</button><button className={`btn ${decision?.status === 'approved' ? 'btn-success' : 'btn-danger'}`} disabled={busy || (decision?.status === 'rejected' && !reason.trim())} onClick={review}>{busy ? 'Updating...' : decision?.status === 'approved' ? 'Approve document' : 'Reject document'}</button></>}>
      {decision?.status === 'rejected' ? <label className="workflow-dialog-field"><span>Rejection reason *</span><textarea rows="5" autoFocus required value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Describe what must be corrected or uploaded again." /><small>This reason will be shown to the customer or vendor.</small></label> : <p className="workflow-dialog-copy">Approve this document and make the reviewed status visible to the partner?</p>}
    </WorkflowDialog>
  </>;
}
