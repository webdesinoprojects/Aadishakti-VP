import { useEffect, useState } from 'react';
import TopBar from '../../components/TopBar';
import { cmsAPI } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

export default function InvestorsManager() {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => { (async () => {
    try { const res = await cmsAPI.getInvestors(); setForm(res.data || {}); }
    catch { error('Failed to load investors content'); }
  })(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      await cmsAPI.updateInvestors(form);
      success('Investors content saved');
    } catch {
      error('Failed to save investors content');
    } finally { setSaving(false); }
  };

  return (
    <>
      <TopBar breadcrumb="CMS / Investors" />
      <div className="admin-content">
        <div className="card">
          <h1 className="card-title">Investors Data</h1>
          <div className="form-group"><label className="form-label">Heading</label><input className="form-input" value={form.heading || ''} onChange={(e) => setForm({ ...form, heading: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Summary</label><textarea className="form-textarea" rows={6} value={form.summary || ''} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></div>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </>
  );
}
