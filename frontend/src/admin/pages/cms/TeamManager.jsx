import { useEffect, useState } from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import TopBar from '../../components/TopBar';
import ConfirmModal from '../../components/ConfirmModal';
import ImageUploader from '../../components/ImageUploader';
import { cmsAPI } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

export default function TeamManager() {
  const [members, setMembers] = useState([]);
  const emptyForm = { name: '', role: '', image: '', bio: '', category: 'leadership', displayOrder: 0, isVisible: true };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const { success, error } = useToast();

  useEffect(() => { (async () => {
    try { const res = await cmsAPI.getTeam(); setMembers(res.data || []); }
    catch { error('Failed to load team'); }
  })(); }, [error]);

  const save = async () => {
    if (!form.name.trim()) return error('Name required');
    try {
      const res = editingId ? await cmsAPI.updateTeamMember(editingId, form) : await cmsAPI.createTeamMember(form);
      setMembers((prev) => editingId ? prev.map((item) => item.id === editingId ? res.data : item) : [...prev, res.data]);
      setForm(emptyForm);
      setEditingId(null);
      success(editingId ? 'Team member updated' : 'Team member added');
    } catch { error('Failed to add member'); }
  };

  const remove = async () => {
    if (!deleteItem) return;
    try {
      await cmsAPI.deleteTeamMember(deleteItem.id);
      setMembers((prev) => prev.filter((x) => x.id !== deleteItem.id));
      setDeleteItem(null);
      success('Member removed');
    } catch { error('Failed to remove member'); }
  };

  return (
    <>
      <TopBar breadcrumb="CMS / Team" />
      <div className="admin-content">
        <div className="card" style={{ marginBottom: 20 }}>
          <h1 className="card-title">Our Team</h1>
          <div className="form-group"><label className="form-label">Photo</label><ImageUploader currentImage={form.image} onUpload={(url) => setForm({ ...form, image: url })} onRemove={() => setForm({ ...form, image: '' })} circular /></div>
          <div className="admin-form-grid" style={{ gap: 12 }}>
            <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Role</label><input className="form-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
          </div>
          <div className="form-group"><label className="form-label">Biography / Quote</label><textarea className="form-textarea" rows={4} value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
          <div className="admin-form-grid" style={{ gap: 12 }}>
            <div className="form-group"><label className="form-label">Display order</label><input className="form-input" type="number" value={form.displayOrder || 0} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} /></div>
            <label className="public-page-checkbox"><input type="checkbox" checked={form.isVisible !== false} onChange={(e) => setForm({ ...form, isVisible: e.target.checked })} /><span>Visible on About page</span></label>
          </div>
          <div style={{ display: 'flex', gap: 8 }}><button className="btn btn-primary" onClick={save}>{editingId ? <Edit2 size={16} /> : <Plus size={16} />}{editingId ? 'Save Member' : 'Add Member'}</button>{editingId && <button className="btn btn-secondary" onClick={() => { setForm(emptyForm); setEditingId(null); }}>Cancel</button>}</div>
        </div>
        <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
          {members.map((m) => (
            <div key={m.id} style={{ border: '1px solid var(--admin-border)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
              {m.image && <img src={m.image} alt={m.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 8 }} />}
              <div style={{ fontWeight: 600 }}>{m.name}</div><div className="text-muted" style={{ marginBottom: 8 }}>{m.role}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}><button className="btn btn-secondary" onClick={() => { setForm({ ...emptyForm, ...m }); setEditingId(m.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Edit2 size={16} /> Edit</button><button className="btn btn-secondary" onClick={() => setDeleteItem(m)}><Trash2 size={16} /> Delete</button></div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmModal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={remove} title="Delete Team Member" message="Are you sure?" confirmText="Delete" type="danger" />
    </>
  );
}
