import { useCallback, useEffect, useState } from 'react';
import { Edit2, Plus, Save, Trash2, X } from 'lucide-react';
import TopBar from '../../components/TopBar';
import ConfirmModal from '../../components/ConfirmModal';
import ImageUploader from '../../components/ImageUploader';
import { cmsAPI } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const emptyForm = {
  title: '', category: 'news', publishDate: new Date().toISOString().slice(0, 10),
  content: '', featuredImage: '', status: 'Published',
};

export default function NewsManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const { success, error } = useToast();

  const load = useCallback(async () => {
    try {
      const response = await cmsAPI.getNews();
      setItems(response.data || []);
    } catch (loadError) {
      console.error('Failed to load media articles:', loadError);
      error('Failed to load media articles.');
    }
  }, [error]);

  useEffect(() => { load(); }, [load]);

  const startCreate = () => { setForm(emptyForm); setEditingId(null); setOpen(true); };
  const startEdit = (item) => {
    setForm({
      title: item.title || '', category: String(item.category || 'news').toLowerCase(),
      publishDate: item.publishDate ? String(item.publishDate).slice(0, 10) : '',
      content: item.content || '', featuredImage: item.featuredImage || '',
      status: item.status === 'published' ? 'Published' : item.status || 'Published',
    });
    setEditingId(item.id);
    setOpen(true);
  };
  const close = () => { if (!saving) { setOpen(false); setEditingId(null); setForm(emptyForm); } };

  const save = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return error('Title and article content are required.');
    setSaving(true);
    try {
      const response = editingId ? await cmsAPI.updateNews(editingId, form) : await cmsAPI.createNews(form);
      setItems((current) => editingId
        ? current.map((item) => item.id === editingId ? response.data : item)
        : [response.data, ...current]);
      success(editingId ? 'Article updated.' : 'Article published.');
      setSaving(false);
      setOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (saveError) {
      console.error('Failed to save media article:', saveError);
      error('Failed to save media article.');
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteItem) return;
    try {
      await cmsAPI.deleteNews(deleteItem.id);
      setItems((current) => current.filter((item) => item.id !== deleteItem.id));
      setDeleteItem(null);
      success('Article deleted.');
    } catch (removeError) {
      console.error('Failed to delete media article:', removeError);
      error('Failed to delete media article.');
    }
  };

  return (
    <>
      <TopBar breadcrumb="CMS / Media Articles" />
      <div className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div><h1 style={{ margin: '0 0 6px', fontSize: 26 }}>Blogs & News</h1><p className="card-subtitle">Published records appear directly on the public Media page.</p></div>
          <button className="btn btn-primary" type="button" onClick={startCreate}><Plus size={16} /> New article</button>
        </div>
        <div className="card responsive-table-shell" style={{ padding: 0 }}>
          <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th>Article</th><th>Type</th><th>Published</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{item.featuredImage && <img src={item.featuredImage} alt="" style={{ width: 64, height: 44, objectFit: 'cover', borderRadius: 4 }} />}<div><strong>{item.title}</strong><div className="text-muted" style={{ maxWidth: 480, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.content}</div></div></div></td>
                  <td style={{ textTransform: 'capitalize' }}>{item.category || 'news'}</td><td>{item.publishDate || '—'}</td><td>{item.status || 'Published'}</td>
                  <td><div style={{ display: 'flex', gap: 8 }}><button className="btn btn-secondary" type="button" onClick={() => startEdit(item)}><Edit2 size={15} /> Edit</button><button className="btn btn-danger" type="button" onClick={() => setDeleteItem(item)}><Trash2 size={15} /></button></div></td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan="5" style={{ padding: 36, textAlign: 'center' }}>No media articles yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {open && <ArticleDrawer form={form} setForm={setForm} editing={Boolean(editingId)} saving={saving} onClose={close} onSave={save} />}
      <ConfirmModal isOpen={Boolean(deleteItem)} onClose={() => setDeleteItem(null)} onConfirm={remove} title="Delete article" message="Delete this public media article permanently?" confirmText="Delete" type="danger" />
    </>
  );
}

function ArticleDrawer({ form, setForm, editing, saving, onClose, onSave }) {
  return <>
    <button type="button" onClick={onClose} aria-label="Close editor" style={{ position: 'fixed', inset: 0, border: 0, background: 'rgba(15,23,42,.48)', zIndex: 1000 }} />
    <aside className="admin-drawer" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 560, background: '#fff', zIndex: 1001, boxShadow: '-10px 0 30px rgba(15,23,42,.16)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: 22, borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><h2 style={{ margin: 0 }}>{editing ? 'Edit article' : 'New article'}</h2><div className="card-subtitle">Public Media content</div></div><button className="btn btn-secondary" type="button" onClick={onClose}><X size={17} /></button></header>
      <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
        <div style={{ padding: 22, overflowY: 'auto', flex: 1 }}>
          <div className="form-group"><label className="form-label required">Title</label><input className="form-input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></div>
          <div className="admin-form-grid">
            <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option value="blogs">Blog</option><option value="news">News</option></select></div>
            <div className="form-group"><label className="form-label">Publish date</label><input className="form-input" type="date" value={form.publishDate} onChange={(event) => setForm({ ...form, publishDate: event.target.value })} /></div>
          </div>
          <div className="form-group"><label className="form-label">Featured image</label><ImageUploader currentImage={form.featuredImage} onUpload={(url) => setForm({ ...form, featuredImage: url })} onRemove={() => setForm({ ...form, featuredImage: '' })} /></div>
          <div className="form-group"><label className="form-label required">Article content</label><textarea className="form-textarea" rows={10} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} /></div>
          <div className="form-group"><label className="form-label">Status</label><select className="form-select" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="Published">Published</option><option value="Draft">Draft</option><option value="Archived">Archived</option></select></div>
        </div>
        <footer style={{ padding: 18, borderTop: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}><button className="btn btn-secondary" type="button" onClick={onClose}>Cancel</button><button className="btn btn-primary" type="submit" disabled={saving}><Save size={16} />{saving ? 'Saving…' : 'Save article'}</button></footer>
      </form>
    </aside>
  </>;
}
