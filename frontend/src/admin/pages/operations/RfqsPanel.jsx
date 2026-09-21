import { useMemo, useState } from 'react';
import { Check, ClipboardList, Send, Users } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { portalWorkflowsAPI } from '../../utils/api';
import { WorkflowDrawer, WorkflowEmpty, WorkflowMeta, WorkflowStatus, WorkflowSummary, WorkflowTableCard } from './WorkflowPrimitives';
import { formatDate } from './workflowFormatters';
import RfqVendorPicker from './RfqVendorPicker';

const emptyRfq = { title: '', product: '', quantity: '', unit: '', companyCode: '', responseDueAt: '', description: '' };

export default function RfqsPanel({ items, vendors, onReload }) {
  const [form, setForm] = useState(emptyRfq);
  const [recipientIds, setRecipientIds] = useState([]);
  const [selected, setSelected] = useState(null);
  const [vendorIds, setVendorIds] = useState([]);
  const [busy, setBusy] = useState(false);
  const { success, error } = useToast();
  const assignments = useMemo(() => items.reduce((total, item) => total + (item.assignments?.length || 0), 0), [items]);
  const existingIds = selected?.assignments?.map((assignment) => assignment.vendor_account_id) || [];

  const openRfq = (item) => {
    setSelected(item);
    setVendorIds([]);
  };
  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    if (field === 'companyCode') setRecipientIds([]);
  };
  const toggleRecipient = (id) => setRecipientIds((current) => current.includes(id)
    ? current.filter((value) => value !== id) : [...current, id]);
  const create = async (event) => {
    event.preventDefault();
    if (!recipientIds.length) return error('Select at least one vendor before publishing.');
    setBusy(true);
    try {
      await portalWorkflowsAPI.createRfq({ ...form, vendorAccountIds: recipientIds });
      success(`RFQ published and sent to ${recipientIds.length} vendor${recipientIds.length === 1 ? '' : 's'}.`);
      setForm(emptyRfq);
      setRecipientIds([]);
      await onReload();
    } catch (requestError) { error(requestError.response?.data?.error || 'Failed to create RFQ.'); }
    finally { setBusy(false); }
  };
  const assign = async () => {
    if (!vendorIds.length) return error('Select at least one vendor.');
    setBusy(true);
    try { await portalWorkflowsAPI.assignRfq(selected.id, { vendorAccountIds: vendorIds }); success('RFQ assigned to additional vendors.'); setSelected(null); await onReload(); }
    catch (requestError) { error(requestError.response?.data?.error || 'Failed to assign RFQ.'); }
    finally { setBusy(false); }
  };
  const toggleVendor = (id) => setVendorIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);

  return <>
    <div className="workflow-summary-grid"><WorkflowSummary icon={ClipboardList} label="Total RFQs" value={items.length} /><WorkflowSummary icon={Send} label="Published" value={items.filter((item) => item.status === 'published').length} tone="green" /><WorkflowSummary icon={Users} label="Vendor assignments" value={assignments} tone="amber" /></div>
    <section className="workflow-form-card"><div className="workflow-section-heading"><div><h2>Create RFQ</h2><p>Choose the vendors who should receive this enquiry, then publish it.</p></div></div><form className="workflow-rfq-form" onSubmit={create}>
      <label><span>RFQ title *</span><input required value={form.title} onChange={update('title')} placeholder="e.g. Battery scrap supply requirement" /></label>
      <label><span>Product</span><input value={form.product} onChange={update('product')} placeholder="Material or product" /></label>
      <label><span>Quantity</span><input min="0" step="any" type="number" value={form.quantity} onChange={update('quantity')} placeholder="0" /></label>
      <label><span>Unit</span><input value={form.unit} onChange={update('unit')} placeholder="MT, kg, units..." /></label>
      <label><span>Company scope</span><select value={form.companyCode} onChange={update('companyCode')}><option value="">All companies</option><option value="AGRPL">AGRPL</option><option value="AM">AM</option><option value="AMRPL">AMRPL</option></select></label>
      <label><span>Response due</span><input type="datetime-local" value={form.responseDueAt} onChange={update('responseDueAt')} /></label>
      <label className="workflow-field-wide"><span>Description</span><textarea rows="4" value={form.description} onChange={update('description')} placeholder="Commercial scope, specifications and submission requirements" /></label>
      <section className="workflow-field-wide workflow-assignment-section" aria-label="RFQ vendor recipients"><div className="workflow-section-heading"><div><h3>Send to vendors *</h3><p>Only the selected vendor accounts will see this RFQ. Customers will not receive it.</p></div><span>{recipientIds.length} selected</span></div><RfqVendorPicker vendors={vendors} companyCode={form.companyCode} selectedIds={recipientIds} onToggle={toggleRecipient} onSelectAll={setRecipientIds} onClearSelection={() => setRecipientIds([])} /></section>
      <div className="workflow-form-actions"><button className="btn btn-primary" disabled={busy || !recipientIds.length}><Send size={17} /> {busy ? 'Publishing & sending...' : 'Publish & Send to Vendors'}</button></div>
    </form></section>
    <WorkflowTableCard title="RFQ register" description="Click a row to view details and manage vendor assignments." count={items.length}><table className="responsive-table workflow-table"><thead><tr><th>Reference</th><th>RFQ</th><th>Company</th><th>Response due</th><th>Assigned</th><th>Status</th><th>Action</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="workflow-clickable-row" tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && openRfq(item)} onClick={() => openRfq(item)}><td><strong>{item.rfq_reference}</strong><small>{formatDate(item.created_at)}</small></td><td><strong>{item.title}</strong><small>{item.product || 'No product specified'}</small></td><td>{item.company_code || 'All'}</td><td>{formatDate(item.response_due_at, true)}</td><td>{item.assignments?.length || 0}</td><td><WorkflowStatus status={item.status} /></td><td><button className="btn btn-secondary workflow-view-button" onClick={(event) => { event.stopPropagation(); openRfq(item); }}>Manage</button></td></tr>)}{!items.length && <tr><td colSpan="7"><WorkflowEmpty title="No RFQs created" copy="Use the form above to publish the first RFQ." /></td></tr>}</tbody></table></WorkflowTableCard>
    <WorkflowDrawer open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} eyebrow="RFQ management" title={selected?.title} subtitle={selected?.rfq_reference} footer={<><button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button><button className="btn btn-primary" disabled={busy || !vendorIds.length} onClick={assign}><Check size={17} /> {busy ? 'Assigning...' : 'Assign new vendors'}</button></>}>
      {selected && <><dl className="workflow-document-meta"><WorkflowMeta label="Company" value={selected.company_code || 'All companies'} /><WorkflowMeta label="Status" value={<WorkflowStatus status={selected.status} />} /><WorkflowMeta label="Product" value={selected.product || 'Not supplied'} /><WorkflowMeta label="Quantity" value={[selected.quantity, selected.unit].filter(Boolean).join(' ') || 'Not supplied'} /><WorkflowMeta label="Published" value={formatDate(selected.created_at, true)} /><WorkflowMeta label="Response due" value={formatDate(selected.response_due_at, true)} /></dl><div className="workflow-copy-card"><strong>Description</strong><p>{selected.description || 'No description supplied.'}</p></div><section className="workflow-assignment-section"><div className="workflow-section-heading"><div><h3>Assign active vendors</h3><p>Already assigned vendors are locked; select additional vendors below.</p></div><span>{vendorIds.length} new</span></div><RfqVendorPicker vendors={vendors} companyCode={selected.company_code} selectedIds={vendorIds} assignedIds={existingIds} onToggle={toggleVendor} onSelectAll={setVendorIds} onClearSelection={() => setVendorIds([])} /></section></>}
    </WorkflowDrawer>
  </>;
}
