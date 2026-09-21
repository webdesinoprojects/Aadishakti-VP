import { useState } from 'react';
import { CheckCircle2, Eye, FileClock, ReceiptIndianRupee, XCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { portalWorkflowsAPI } from '../../utils/api';
import { DocumentPreview, WorkflowDialog, WorkflowDrawer, WorkflowEmpty, WorkflowMeta, WorkflowStatus, WorkflowSummary, WorkflowTableCard } from './WorkflowPrimitives';
import { formatDate } from './workflowFormatters';

export default function ReceiptsPanel({ items, onReload }) {
  const [selected, setSelected] = useState(null);
  const [decision, setDecision] = useState(null);
  const [busy, setBusy] = useState(false);
  const { success, error } = useToast();
  const review = async () => {
    setBusy(true);
    try { await portalWorkflowsAPI.reviewReceipt(decision.item.id, { status: decision.status }); success(decision.status === 'verified' ? 'Receipt verified.' : 'Receipt rejected.'); setDecision(null); setSelected(null); await onReload(); }
    catch (requestError) { error(requestError.response?.data?.error || 'Receipt review failed.'); }
    finally { setBusy(false); }
  };
  return <>
    <div className="workflow-summary-grid"><WorkflowSummary icon={ReceiptIndianRupee} label="Submitted receipts" value={items.length} /><WorkflowSummary icon={FileClock} label="Pending verification" value={items.filter((item) => item.status === 'submitted').length} tone="amber" /><WorkflowSummary icon={CheckCircle2} label="Verified" value={items.filter((item) => item.status === 'verified').length} tone="green" /></div>
    <WorkflowTableCard title="Payment receipts" description="Open a row to verify payment information against the uploaded proof." count={items.length}><table className="responsive-table workflow-table"><thead><tr><th>Partner</th><th>Payment reference</th><th>Type</th><th>Amount</th><th>Paid on</th><th>Status</th><th>Action</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="workflow-clickable-row" tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && setSelected(item)} onClick={() => setSelected(item)}><td><strong>{item.account?.display_name || 'Unknown partner'}</strong><small>{item.account?.role || 'partner'}</small></td><td><strong>{item.payment_reference}</strong><small>{formatDate(item.created_at)}</small></td><td>{item.payment_type}</td><td>{item.amount ?? '—'}</td><td>{formatDate(item.paid_on)}</td><td><WorkflowStatus status={item.status} /></td><td><button className="btn btn-secondary workflow-view-button" onClick={(event) => { event.stopPropagation(); setSelected(item); }}><Eye size={15} /> Review</button></td></tr>)}{!items.length && <tr><td colSpan="7"><WorkflowEmpty title="No receipts submitted" copy="Customer and vendor payment proofs will appear here." /></td></tr>}</tbody></table></WorkflowTableCard>
    <WorkflowDrawer open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} eyebrow="Payment receipt review" title={selected?.payment_reference} subtitle={selected?.account?.display_name} footer={selected?.status === 'submitted' ? <><button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button><div><button className="btn btn-danger" onClick={() => setDecision({ item: selected, status: 'rejected' })}><XCircle size={17} /> Reject</button><button className="btn btn-success" onClick={() => setDecision({ item: selected, status: 'verified' })}><CheckCircle2 size={17} /> Verify receipt</button></div></> : <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>}>
      {selected && <><dl className="workflow-document-meta"><WorkflowMeta label="Partner" value={selected.account?.display_name} /><WorkflowMeta label="Role" value={selected.account?.role} /><WorkflowMeta label="Payment reference" value={selected.payment_reference} /><WorkflowMeta label="Payment type" value={selected.payment_type} /><WorkflowMeta label="Amount" value={selected.amount ?? 'Not supplied'} /><WorkflowMeta label="Paid on" value={formatDate(selected.paid_on)} /><WorkflowMeta label="Submitted" value={formatDate(selected.created_at, true)} /><WorkflowMeta label="Status" value={<WorkflowStatus status={selected.status} />} /></dl><div className="workflow-copy-card"><strong>Partner notes</strong><p>{selected.notes || 'No notes supplied.'}</p></div><DocumentPreview media={selected.media} title="Payment proof" /></>}
    </WorkflowDrawer>
    <WorkflowDialog open={Boolean(decision)} onOpenChange={(open) => !open && !busy && setDecision(null)} title={decision?.status === 'verified' ? 'Verify payment receipt' : 'Reject payment receipt'} description={decision?.item?.payment_reference} footer={<><button className="btn btn-secondary" disabled={busy} onClick={() => setDecision(null)}>Cancel</button><button className={`btn ${decision?.status === 'verified' ? 'btn-success' : 'btn-danger'}`} disabled={busy} onClick={review}>{busy ? 'Updating...' : decision?.status === 'verified' ? 'Verify receipt' : 'Reject receipt'}</button></>}><p className="workflow-dialog-copy">{decision?.status === 'verified' ? 'Confirm that this payment proof has been checked and matches the supplied reference.' : 'Confirm that this payment proof cannot be verified.'}</p></WorkflowDialog>
  </>;
}
