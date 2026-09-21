import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock3, Eye, FileCheck2, Leaf, LoaderCircle, RotateCcw, Send } from 'lucide-react';
import customerApi from '../../services/customerApi';
import PortalFileDropzone from '../../portal/PortalFileDropzone';
import { usePortalToast } from '../../portal/PortalToastContext';
import CustomerRequestDrawer from './CustomerRequestDrawer';
import { CustomerWorkflowEmpty, CustomerWorkflowStat } from './CustomerWorkflowPrimitives';
import { formatWorkflowDate, titleize, workflowStatusClass } from '../utils/customerWorkflowFormatters';
import './customer-workflows.css';

const completeStatuses = new Set(['fulfilled', 'closed']);

export default function CustomerRequestsWorkspace({ requestTypes, defaultType, historyTypes, mode = 'reports' }) {
  const [items, setItems] = useState([]);
  const [requestType, setRequestType] = useState(defaultType);
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = usePortalToast();
  const allowedTypes = useMemo(() => new Set(historyTypes || requestTypes.map((type) => type.value)), [historyTypes, requestTypes]);
  const Icon = mode === 'claims' ? RotateCcw : Leaf;

  const load = useCallback(async ({ showError = true } = {}) => {
    try {
      const allRequests = await customerApi.getRequests();
      const relevant = allRequests.filter((item) => allowedTypes.has(item.request_type));
      setItems(relevant);
      setSelected((current) => current ? relevant.find((item) => item.id === current.id) || current : null);
    } catch (error) {
      if (showError) toast.error(error.response?.data?.error || 'Unable to load requests.');
    } finally { setLoading(false); }
  }, [allowedTypes, toast]);

  useEffect(() => { load(); }, [load]);

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set('requestType', requestType);
    if (files[0]) data.set('document', files[0]);
    setSubmitting(true);
    try {
      await customerApi.submitRequest(data);
      form.reset();
      setRequestType(defaultType);
      setFiles([]);
      toast.success(`${mode === 'claims' ? 'Quality claim' : 'Report'} request submitted successfully.`);
      await load({ showError: false });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Request submission failed.');
    } finally { setSubmitting(false); }
  };

  const activeCount = items.filter((item) => !completeStatuses.has(item.status) && item.status !== 'rejected').length;
  const completedCount = items.filter((item) => completeStatuses.has(item.status)).length;

  return <div className="customer-workflow-shell">
    <CustomerRequestDrawer item={selected} onClose={() => setSelected(null)} />
    <div className="customer-workflow-stats">
      <CustomerWorkflowStat icon={FileCheck2} value={items.length} label="Total requests" />
      <CustomerWorkflowStat icon={Clock3} value={activeCount} label="In progress" tone="amber" />
      <CustomerWorkflowStat icon={CheckCircle2} value={completedCount} label="Completed" tone="green" />
    </div>

    <section className="customer-card customer-workflow-form-card">
      <header className="customer-workflow-card-heading"><span><Icon size={22} /></span><div><h2>{mode === 'claims' ? 'Submit a quality claim' : 'Request a report or certificate'}</h2><p>Provide the request details and optionally attach one supporting file.</p></div></header>
      <form className="customer-request-form" onSubmit={submit}>
        <div className="customer-request-fields">
          <label><span>Request type</span>{requestTypes.length === 1 ? <input value={requestTypes[0].label} readOnly /> : <select value={requestType} onChange={(event) => setRequestType(event.target.value)} disabled={submitting}>{requestTypes.map((type) => <option value={type.value} key={type.value}>{type.label}</option>)}</select>}</label>
          <label><span>Related order or document</span><input name="relatedReference" placeholder="Optional reference number" disabled={submitting} /></label>
          <label className="is-wide"><span>Subject *</span><input name="subject" required maxLength="180" placeholder={mode === 'claims' ? 'Briefly describe the product quality issue' : 'What report or certificate do you need?'} disabled={submitting} /></label>
          <label className="is-wide"><span>Details</span><textarea name="description" rows="5" maxLength="3000" placeholder="Add specifications, period, order details, or any other information Aadishakti should know." disabled={submitting} /></label>
        </div>
        <PortalFileDropzone files={files} onChange={setFiles} onError={toast.error} disabled={submitting} maxFiles={1} label="Supporting attachment (optional)" dropLabel="Drop a supporting file here" fileKind="supporting document" />
        <div className="customer-workflow-actions"><span>{files.length ? files[0].name : 'No attachment selected'}</span><button type="submit" disabled={submitting}>{submitting ? <><LoaderCircle className="customer-workflow-spin" size={17} />Submitting…</> : <><Send size={17} />Submit request</>}</button></div>
      </form>
    </section>

    <section className="customer-card customer-workflow-history">
      <header className="customer-workflow-history-heading"><div><h2>Request history</h2><p>Track Aadishakti review, notes, and fulfilled documents.</p></div><span>{items.length} total</span></header>
      <div className="customer-workflow-table-scroll"><table className="customer-table"><thead><tr><th>Reference</th><th>Type</th><th>Subject</th><th>Submitted</th><th>Status</th><th>Action</th></tr></thead><tbody>
        {items.map((item) => <tr key={item.id} className="customer-workflow-clickable" onClick={() => setSelected(item)}><td><strong>{item.request_reference}</strong></td><td>{titleize(item.request_type)}</td><td><span className="customer-workflow-subject">{item.subject}</span>{item.review_note && <small>{item.review_note}</small>}</td><td>{formatWorkflowDate(item.created_at)}</td><td><span className={workflowStatusClass(item.status)}>{titleize(item.status)}</span></td><td><button type="button" onClick={(event) => { event.stopPropagation(); setSelected(item); }}><Eye size={15} />View details</button></td></tr>)}
        {!loading && !items.length && <tr><td colSpan="6"><CustomerWorkflowEmpty title="No requests submitted yet" copy="New requests and their status will appear here." /></td></tr>}
        {loading && <tr><td colSpan="6"><div className="customer-workflow-empty"><LoaderCircle className="customer-workflow-spin" size={26} /><span>Loading request history…</span></div></td></tr>}
      </tbody></table></div>
    </section>
  </div>;
}
