import { useEffect, useState } from 'react';
import FormDialog from '../../components/FormDialog';
import TopBar from '../../components/TopBar';
import { useToast } from '../../context/ToastContext';
import { portalAccountsAPI, portalWorkflowsAPI } from '../../utils/api';

const tabs = ['RFQs', 'Quotations', 'Documents', 'Receipts', 'Customer Requests', 'Support'];
const emptyRfq = { title: '', product: '', companyCode: 'AGRPL', responseDueAt: '', description: '' };
const loaders = {
  RFQs: portalWorkflowsAPI.rfqs,
  Quotations: portalWorkflowsAPI.quotations,
  Documents: portalWorkflowsAPI.documents,
  Receipts: portalWorkflowsAPI.receipts,
  'Customer Requests': portalWorkflowsAPI.customerRequests,
  Support: portalWorkflowsAPI.support,
};
const headersFor = (tab) => ({
  RFQs: ['Reference', 'Title', 'Product', 'Company', 'Status', 'Assigned', 'Action'],
  Quotations: ['Quotation', 'Vendor', 'RFQ', 'Unit Price', 'Status', 'Action'],
  Documents: ['Partner', 'Title', 'Type', 'Status', 'File', 'Action'],
  Receipts: ['Partner', 'Reference', 'Amount', 'Status', 'File', 'Action'],
  'Customer Requests': ['Reference', 'Customer', 'Type', 'Subject', 'Status', 'Action'],
  Support: ['Ticket', 'Partner', 'Subject', 'Priority', 'Status', 'Messages', 'Action'],
}[tab]);

export default function PortalWorkflowsManager() {
  const [tab, setTab] = useState('RFQs');
  const [data, setData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [rfqForm, setRfqForm] = useState(emptyRfq);
  const [dialog, setDialog] = useState(null);
  const { success, error } = useToast();

  const load = async () => {
    try { setData((await loaders[tab]()).data || []); }
    catch { error(`Failed to load ${tab.toLowerCase()}.`); }
  };

  useEffect(() => { load(); }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    portalAccountsAPI.list({ role: 'vendor', status: 'active' })
      .then((response) => setVendors(response.data || []))
      .catch(() => error('Failed to load active vendor accounts.'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createRfq = async (event) => {
    event.preventDefault();
    try {
      await portalWorkflowsAPI.createRfq({ ...rfqForm, status: 'published' });
      setRfqForm(emptyRfq);
      success('RFQ created.');
      await load();
    } catch (requestError) {
      error(requestError.response?.data?.error || 'Failed to create RFQ.');
    }
  };

  const submitDialog = async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      if (dialog.type === 'assign') {
        await portalWorkflowsAPI.assignRfq(dialog.item.id, { vendorAccountIds: [values.vendorAccountId] });
        success('RFQ assigned.');
      } else {
        await portalWorkflowsAPI.replySupport(dialog.item.id, { message: values.message });
        success('Reply sent.');
      }
      setDialog(null);
      await load();
    } catch (requestError) {
      error(requestError.response?.data?.error || 'Action failed.');
    }
  };

  const review = async (item, status) => {
    try {
      if (tab === 'Documents') await portalWorkflowsAPI.reviewDocument(item.id, { status });
      if (tab === 'Receipts') await portalWorkflowsAPI.reviewReceipt(item.id, { status });
      if (tab === 'Customer Requests') await portalWorkflowsAPI.reviewCustomerRequest(item.id, { status });
      if (tab === 'Quotations') await portalWorkflowsAPI.reviewQuotation(item.id, { status });
      success('Status updated.');
      await load();
    } catch (requestError) {
      error(requestError.response?.data?.error || 'Status update failed.');
    }
  };

  const rows = data.map((item) => {
    if (tab === 'RFQs') return <tr key={item.id}><td>{item.rfq_reference}</td><td>{item.title}</td><td>{item.product || '-'}</td><td>{item.company_code || 'All'}</td><td>{item.status}</td><td>{item.assignments?.length || 0}</td><td><button className="btn btn-outline" onClick={() => setDialog({ type: 'assign', item })}>Assign</button></td></tr>;
    if (tab === 'Quotations') return <tr key={item.id}><td>{item.quotation_reference}</td><td>{item.assignment?.vendor?.display_name}</td><td>{item.assignment?.rfq?.rfq_reference}</td><td>{item.unit_price}</td><td>{item.status}</td><td><button className="btn btn-outline" onClick={() => review(item, 'accepted')}>Accept</button> <button className="btn btn-outline" onClick={() => review(item, 'rejected')}>Reject</button></td></tr>;
    if (tab === 'Documents') return <tr key={item.id}><td>{item.account?.display_name}</td><td>{item.title}</td><td>{item.document_type}</td><td>{item.status}</td><td>{item.media?.url ? <a href={item.media.url} target="_blank" rel="noreferrer">View</a> : '-'}</td><td><button className="btn btn-outline" onClick={() => review(item, 'approved')}>Approve</button> <button className="btn btn-outline" onClick={() => review(item, 'rejected')}>Reject</button></td></tr>;
    if (tab === 'Receipts') return <tr key={item.id}><td>{item.account?.display_name}</td><td>{item.payment_reference}</td><td>{item.amount ?? '-'}</td><td>{item.status}</td><td>{item.media?.url ? <a href={item.media.url} target="_blank" rel="noreferrer">View</a> : '-'}</td><td><button className="btn btn-outline" onClick={() => review(item, 'verified')}>Verify</button> <button className="btn btn-outline" onClick={() => review(item, 'rejected')}>Reject</button></td></tr>;
    if (tab === 'Customer Requests') return <tr key={item.id}><td>{item.request_reference}</td><td>{item.account?.display_name}</td><td>{item.request_type}</td><td>{item.subject}</td><td>{item.status}</td><td><button className="btn btn-outline" onClick={() => review(item, 'in_review')}>Review</button> <button className="btn btn-outline" onClick={() => review(item, 'approved')}>Approve</button></td></tr>;
    return <tr key={item.id}><td>{item.ticket_reference}</td><td>{item.account?.display_name}</td><td>{item.subject}</td><td>{item.priority}</td><td>{item.status}</td><td>{item.messages?.length || 0}</td><td><button className="btn btn-outline" onClick={() => setDialog({ type: 'reply', item })}>Reply</button></td></tr>;
  });
  const headers = headersFor(tab);

  return <>
    <TopBar breadcrumb="Operations / Portal Workflows" />
    <div className="admin-content">
      <h1 className="card-title" style={{ fontSize: '24px' }}>Portal Workflows</h1>
      <p className="card-subtitle" style={{ marginBottom: '24px' }}>Manage partner-owned workflows that are not supplied by CIS.</p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '22px' }}>{tabs.map((item) => <button key={item} className={`btn ${tab === item ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab(item)}>{item}</button>)}</div>
      {tab === 'RFQs' && <form onSubmit={createRfq} className="admin-form-grid" style={{ background: '#fff', padding: '20px', marginBottom: '20px' }}>
        <input required placeholder="RFQ title" value={rfqForm.title} onChange={(event) => setRfqForm({ ...rfqForm, title: event.target.value })} />
        <input placeholder="Product" value={rfqForm.product} onChange={(event) => setRfqForm({ ...rfqForm, product: event.target.value })} />
        <select value={rfqForm.companyCode} onChange={(event) => setRfqForm({ ...rfqForm, companyCode: event.target.value })}><option>AGRPL</option><option>AM</option><option>AMRPL</option></select>
        <input type="datetime-local" value={rfqForm.responseDueAt} onChange={(event) => setRfqForm({ ...rfqForm, responseDueAt: event.target.value })} />
        <textarea placeholder="Description" value={rfqForm.description} onChange={(event) => setRfqForm({ ...rfqForm, description: event.target.value })} />
        <button className="btn btn-primary">Create RFQ</button>
      </form>}
      <div style={{ overflowX: 'auto' }}><table className="responsive-table" style={{ width: '100%', background: '#fff', borderCollapse: 'collapse' }}><thead><tr style={{ background: '#f8fafc', textAlign: 'left' }}>{headers.map((header) => <th key={header} style={{ padding: '14px' }}>{header}</th>)}</tr></thead><tbody>{rows}{!data.length && <tr><td colSpan={headers.length} style={{ padding: '30px', textAlign: 'center' }}>No records yet.</td></tr>}</tbody></table></div>
    </div>
    <FormDialog open={Boolean(dialog)} title={dialog?.type === 'assign' ? 'Assign RFQ' : 'Reply to Support Ticket'} submitText={dialog?.type === 'assign' ? 'Assign Vendor' : 'Send Reply'} onClose={() => setDialog(null)} onSubmit={submitDialog}>
      {dialog?.type === 'assign'
        ? <label>Vendor Account<select name="vendorAccountId" required style={{ width: '100%', padding: '10px', marginTop: '6px' }}><option value="">Select a vendor</option>{vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.displayName} ({vendor.loginId})</option>)}</select></label>
        : <label>Message<textarea name="message" required rows="5" style={{ width: '100%', padding: '10px', marginTop: '6px' }} /></label>}
    </FormDialog>
  </>;
}
