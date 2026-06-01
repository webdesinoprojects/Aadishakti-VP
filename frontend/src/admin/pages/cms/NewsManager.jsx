import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import TopBar from '../../components/TopBar';
import ConfirmModal from '../../components/ConfirmModal';
import { cmsAPI } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

export default function NewsManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', status: 'Published' });
  const [deleteItem, setDeleteItem] = useState(null);
  const { success, error } = useToast();

  const load = async () => {
    try {
      const res = await cmsAPI.getNews();
      setItems(res.data || []);
    } catch { error('Failed to load news'); }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.title.trim()) return error('Title required');
    try {
      const res = await cmsAPI.createNews(form);
      setItems((prev) => [res.data, ...prev]);
      setForm({ title: '', content: '', status: 'Published' });
      success('Announcement added');
    } catch { error('Failed to add announcement'); }
  };

  const remove = async () => {
    if (!deleteItem) return;
    try {
      await cmsAPI.deleteNews(deleteItem.id);
      setItems((prev) => prev.filter((x) => x.id !== deleteItem.id));
      setDeleteItem(null);
      success('Announcement deleted');
    } catch { error('Failed to delete announcement'); }
  };

  return (
    <>
      <TopBar breadcrumb="CMS / News" />
      <div className="admin-content">
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><h1 className="card-title">News & Announcements</h1></div>
          <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Content</label><textarea className="form-textarea" rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
          <button className="btn btn-primary" onClick={add}><Plus size={16} /> Add Announcement</button>
        </div>
        <div className="card">
          {items.map((item) => (
            <div key={item.id} style={{ borderBottom: '1px solid var(--admin-border)', padding: '12px 0', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div><div style={{ fontWeight: 600 }}>{item.title}</div><div className="text-muted">{item.content}</div></div>
              <button className="btn btn-secondary" onClick={() => setDeleteItem(item)}><Trash2 size={16} /> Delete</button>
            </div>
          ))}
        </div>
      </div>
      <ConfirmModal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={remove} title="Delete Announcement" message="Are you sure?" confirmText="Delete" type="danger" />
    </>
  );
}
