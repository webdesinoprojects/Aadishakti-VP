import { useState } from 'react';
import { BadgeIndianRupee, CheckCircle2, Clock3, Eye, FileCheck2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { portalWorkflowsAPI } from '../../utils/api';
import { DocumentPreview, WorkflowDialog, WorkflowDrawer, WorkflowEmpty, WorkflowMeta, WorkflowStatus, WorkflowSummary, WorkflowTableCard } from './WorkflowPrimitives';
import { formatDate } from './workflowFormatters';

export default function QuotationsPanel({ items, onReload }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [decision, setDecision] = useState(null);
  const [busy, setBusy] = useState(false);
  const { success, error } = useToast();
  const decide = async () => {
    setBusy(true);
    try {
      await portalWorkflowsAPI.reviewQuotation(decision.item.id, { status: decision.status });
      success(decision.status === 'accepted' ? 'Quotation accepted. Create a logistics order when the receiving customer is confirmed.' : decision.status === 'rejected' ? 'Quotation rejected.' : 'Quotation moved to review.');
      setDecision(null); setSelected(null); await onReload();
    } catch (requestError) { error(requestError.response?.data?.error || 'Quotation review failed.'); }
    finally { setBusy(false); }
  };
  const ask = (status) => setDecision({ item: selected, status });
  return <>
    <div className="workflow-summary-grid"><WorkflowSummary icon={FileCheck2} label="Submitted quotations" value={items.length} /><WorkflowSummary icon={Clock3} label="Awaiting decision" value={items.filter((item) => ['submitted', 'under_review'].includes(item.status)).length} tone="amber" /><WorkflowSummary icon={CheckCircle2} label="Accepted" value={items.filter((item) => item.status === 'accepted').length} tone="green" /></div>
    <WorkflowTableCard title="Vendor quotations" description="Click a quotation to inspect commercial terms and its attachment." count={items.length}><table className="responsive-table workflow-table"><thead><tr><th>Quotation</th><th>Vendor</th><th>RFQ</th><th>Unit price</th><th>Lead time</th><th>Status</th><th>Action</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="workflow-clickable-row" tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && setSelected(item)} onClick={() => setSelected(item)}><td><strong>{item.quotation_reference}</strong><small>{formatDate(item.submitted_at || item.created_at)}</small></td><td><strong>{item.assignment?.vendor?.display_name || 'Unknown vendor'}</strong><small>{item.assignment?.vendor?.email || 'No email'}</small></td><td>{item.assignment?.rfq?.rfq_reference || '—'}</td><td>{item.unit_price ?? '—'}</td><td>{item.lead_time_days == null ? '—' : `${item.lead_time_days} days`}</td><td><WorkflowStatus status={item.status} /></td><td><button className="btn btn-secondary workflow-view-button" onClick={(event) => { event.stopPropagation(); setSelected(item); }}><Eye size={15} /> Review</button></td></tr>)}{!items.length && <tr><td colSpan="7"><WorkflowEmpty title="No quotations received" copy="Vendor submissions will appear here for commercial review." /></td></tr>}</tbody></table></WorkflowTableCard>
    <WorkflowDrawer open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} eyebrow="Quotation review" title={selected?.quotation_reference} subtitle={selected?.assignment?.vendor?.display_name} footer={selected?.status === 'accepted' ? <><button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button><button className="btn btn-primary" onClick={() => navigate(`/admin/logistics?quote=${encodeURIComponent(selected.id)}`)}>Create logistics order</button></> : selected && !['rejected', 'withdrawn'].includes(selected.status) ? <><button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button><div><button className="btn btn-danger" disabled={busy} onClick={() => ask('rejected')}><XCircle size={17} /> Reject</button>{selected.status === 'submitted' && <button className="btn btn-secondary" disabled={busy} onClick={() => ask('under_review')}><Clock3 size={17} /> Mark in review</button>}<button className="btn btn-success" disabled={busy} onClick={() => ask('accepted')}><CheckCircle2 size={17} /> Accept quotation</button></div></> : <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>}>
      {selected && <><dl className="workflow-document-meta"><WorkflowMeta label="Vendor" value={selected.assignment?.vendor?.display_name} /><WorkflowMeta label="Status" value={<WorkflowStatus status={selected.status} />} /><WorkflowMeta label="RFQ" value={selected.assignment?.rfq?.rfq_reference} /><WorkflowMeta label="RFQ title" value={selected.assignment?.rfq?.title} /><WorkflowMeta label="Unit price" value={selected.unit_price} /><WorkflowMeta label="Tax rate" value={selected.tax_rate == null ? 'Not supplied' : `${selected.tax_rate}%`} /><WorkflowMeta label="Lead time" value={selected.lead_time_days == null ? 'Not supplied' : `${selected.lead_time_days} days`} /><WorkflowMeta label="Valid until" value={formatDate(selected.validity_date)} /></dl><div className="workflow-copy-card"><strong>Vendor remarks</strong><p>{selected.remarks || 'No remarks supplied.'}</p></div><DocumentPreview media={selected.media} title="Quotation attachment" /></>}
    </WorkflowDrawer>
    <WorkflowDialog open={Boolean(decision)} onOpenChange={(open) => !open && !busy && setDecision(null)} title={`${decision?.status === 'accepted' ? 'Accept' : decision?.status === 'rejected' ? 'Reject' : 'Review'} quotation`} description={`${decision?.item?.quotation_reference || ''} from ${decision?.item?.assignment?.vendor?.display_name || 'this vendor'}`} footer={<><button className="btn btn-secondary" disabled={busy} onClick={() => setDecision(null)}>Cancel</button><button className={`btn ${decision?.status === 'accepted' ? 'btn-success' : decision?.status === 'rejected' ? 'btn-danger' : 'btn-primary'}`} disabled={busy} onClick={decide}>{busy ? 'Updating...' : 'Confirm decision'}</button></>}><div className="workflow-decision-message"><BadgeIndianRupee size={22} /><p>{decision?.status === 'accepted' ? 'This accepts the commercial offer and marks the related RFQ assignment as awarded.' : decision?.status === 'rejected' ? 'This rejects the offer and marks the related RFQ assignment as not awarded.' : 'This marks the quotation as under review without making a final decision.'}</p></div></WorkflowDialog>
  </>;
}
