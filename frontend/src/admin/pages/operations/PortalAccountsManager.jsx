import { useEffect, useState } from 'react';
import { Copy, KeyRound, Plus, X } from 'lucide-react';
import TopBar from '../../components/TopBar';
import { useToast } from '../../context/ToastContext';
import { portalAccountsAPI } from '../../utils/api';

const emptyForm = () => ({
  role: 'vendor', loginId: '', displayName: '', email: '', password: '',
  mappings: [
    { companyCode: 'AGRPL', cardCode: '', enabled: true, isPrimary: true },
    { companyCode: 'AM', cardCode: '', enabled: false, isPrimary: false },
    { companyCode: 'AMRPL', cardCode: '', enabled: false, isPrimary: false },
  ],
});

export default function PortalAccountsManager() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [issued, setIssued] = useState(null);
  const { success, error } = useToast();
  const load = async () => { try { setAccounts((await portalAccountsAPI.list()).data || []); } catch { error('Failed to load portal accounts.'); } };
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateMapping = (index, patch) => setForm((current) => ({ ...current, mappings: current.mappings.map((item, i) => i === index ? { ...item, ...patch } : item) }));
  const create = async (event) => {
    event.preventDefault();
    try {
      const mappings = form.mappings.filter((item) => item.enabled && item.cardCode.trim()).map(({ companyCode, cardCode, isPrimary }) => ({ companyCode, cardCode, isPrimary }));
      if (!mappings.length) return error('Add at least one CIS company mapping.');
      const response = await portalAccountsAPI.create({ ...form, password: form.password || undefined, mappings });
      setIssued({ loginId: response.data.account.loginId, password: response.data.temporaryPassword });
      setOpen(false); setForm(emptyForm()); await load(); success('Portal account created.');
    } catch (err) { error(err.response?.data?.error || 'Failed to create portal account.'); }
  };
  const resetPassword = async (account) => {
    try { const response = await portalAccountsAPI.resetPassword(account.id); setIssued({ loginId: account.loginId, password: response.data.temporaryPassword }); success('Temporary password generated.'); }
    catch (err) { error(err.response?.data?.error || 'Password reset failed.'); }
  };
  const changeStatus = async (account) => {
    try { await portalAccountsAPI.update(account.id, { status: account.status === 'active' ? 'inactive' : 'active' }); await load(); }
    catch (err) { error(err.response?.data?.error || 'Status update failed.'); }
  };

  return <><TopBar breadcrumb="Operations / Portal Accounts" /><div className="admin-content">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}><div><h1 className="card-title" style={{ fontSize: '24px' }}>Partner Portal Accounts</h1><p className="card-subtitle">Create individual customer or vendor logins and map them to one or more CIS companies.</p></div><button className="btn btn-primary" onClick={() => setOpen(true)}><Plus size={16} /> Create Account</button></div>
    {issued && <div style={{ padding: '16px', marginBottom: '20px', background: '#fef3c7', borderRadius: '8px' }}><strong>Share once:</strong> Login <code>{issued.loginId}</code> / Temporary password <code>{issued.password}</code> <button onClick={() => navigator.clipboard.writeText(`${issued.loginId}\n${issued.password}`)} style={{ border: 0, background: 'none', cursor: 'pointer' }}><Copy size={15} /></button></div>}
    <table className="responsive-table" style={{ width: '100%', background: '#fff', borderCollapse: 'collapse' }}><thead><tr style={{ background: '#f8fafc', textAlign: 'left' }}><th style={{ padding: '14px' }}>Partner</th><th>Role</th><th>Login</th><th>CIS Mappings</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      {accounts.map((account) => <tr key={account.id} style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: '14px', fontWeight: 600 }}>{account.displayName}</td><td>{account.role}</td><td>{account.loginId}</td><td>{account.mappings.map((item) => `${item.companyCode}: ${item.cardCode}${item.isPrimary ? ' (Primary)' : ''}`).join(', ')}</td><td>{account.status}</td><td><button onClick={() => resetPassword(account)} className="btn btn-outline"><KeyRound size={14} /> Reset</button> <button onClick={() => changeStatus(account)} className="btn btn-outline">{account.status === 'active' ? 'Disable' : 'Enable'}</button></td></tr>)}
      {!accounts.length && <tr><td colSpan="6" style={{ padding: '30px', textAlign: 'center' }}>No portal accounts yet.</td></tr>}
    </tbody></table>
  </div>
  {open && <><div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000 }} /><aside className="admin-drawer" style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: '480px', background: '#fff', zIndex: 1001, padding: '24px', overflowY: 'auto' }}><button onClick={() => setOpen(false)} style={{ float: 'right', border: 0, background: 'none' }}><X /></button><h2>Create Portal Account</h2><form onSubmit={create} style={{ display: 'grid', gap: '14px', marginTop: '24px' }}>
    <label>Role<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ width: '100%', padding: '10px' }}><option value="vendor">Vendor</option><option value="customer">Customer</option></select></label>
    <label>Display Name<input required value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} style={{ width: '100%', padding: '10px' }} /></label>
    <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value, loginId: form.loginId || e.target.value })} style={{ width: '100%', padding: '10px' }} /></label>
    <label>Login ID<input required value={form.loginId} onChange={(e) => setForm({ ...form, loginId: e.target.value })} style={{ width: '100%', padding: '10px' }} /></label>
    <label>Temporary Password (optional)<input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Auto-generate if empty" style={{ width: '100%', padding: '10px' }} /></label>
    <strong>CIS Company Mappings</strong>{form.mappings.map((mapping, index) => <div key={mapping.companyCode} style={{ display: 'grid', gridTemplateColumns: '24px 65px 1fr 62px', gap: '8px', alignItems: 'center' }}><input type="checkbox" checked={mapping.enabled} onChange={(e) => updateMapping(index, { enabled: e.target.checked })} /><span>{mapping.companyCode}</span><input disabled={!mapping.enabled} value={mapping.cardCode} placeholder="SAP card code" onChange={(e) => updateMapping(index, { cardCode: e.target.value })} style={{ padding: '9px' }} /><label style={{ fontSize: '11px' }}><input type="radio" name="primary" disabled={!mapping.enabled} checked={mapping.isPrimary} onChange={() => setForm((current) => ({ ...current, mappings: current.mappings.map((item, i) => ({ ...item, isPrimary: i === index })) }))} /> Primary</label></div>)}
    <button className="btn btn-primary">Create Login</button>
  </form></aside></>}
  </>;
}
