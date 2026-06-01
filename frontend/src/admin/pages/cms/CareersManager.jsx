import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import TopBar from '../../components/TopBar';
import ConfirmModal from '../../components/ConfirmModal';
import { cmsAPI } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

export default function CareersManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', location: '', status: 'Open' });
  const [deleteItem, setDeleteItem] = useState(null);
  const { success, error } = useToast();

  useEffect(() => { (async () => {
    try { const res = await cmsAPI.getCareers(); setItems(res.data || []); }
    catch { error('Failed to load jobs'); }
  })(); }, []);

  const add = async () => {
    if (!form.title.trim()) return error('Role title required');
    try {
      const res = await cmsAPI.createCareer(form);
      setItems((prev) => [res.data, ...prev]);
      setForm({ title: '', location: '', status: 'Open' });
      success('Job added');
    } catch { error('Failed to add job'); }
  };

  const remove = async () => {
    if (!deleteItem) return;
    try {
      await cmsAPI.deleteCareer(deleteItem.id);
      setItems((prev) => prev.filter((x) => x.id !== deleteItem.id));
      setDeleteItem(null);
      success('Job removed');
    } catch { error('Failed to remove job'); }
  };

  return (
    <>
      <TopBar breadcrumb="CMS / Careers" />
      <div className="admin-content">
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><h1 className="card-title">Careers & Jobs</h1></div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div className="form-group"><label className="form-label">Role</label><input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Location</label><input className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
          </div>
          <button className="btn btn-primary" onClick={add}><Plus size={16} /> Add Job</button>
        </div>
        <div className="card">
          {items.map((item) => (
            <div key={item.id} style={{ borderBottom: '1px solid var(--admin-border)', padding: '12px 0', display: 'flex', justifyContent: 'space-between' }}>
              <div><div style={{ fontWeight: 600 }}>{item.title}</div><div className="text-muted">{item.location || 'Location not set'}</div></div>
              <button className="btn btn-secondary" onClick={() => setDeleteItem(item)}><Trash2 size={16} /> Delete</button>
            </div>
          ))}
        </div>
      </div>
      <ConfirmModal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={remove} title="Delete Job" message="Are you sure?" confirmText="Delete" type="danger" />
    </>
  );
}
