import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Edit2, Plus, Save, Trash2, X } from 'lucide-react';
import TopBar from '../../components/TopBar';
import ConfirmModal from '../../components/ConfirmModal';
import ImageUploader from '../../components/ImageUploader';
import { cmsAPI } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const emptyForm = { image: '', category: 'plants', title: '', sortOrder: 0 };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState(null);
  const { success, error } = useToast();

  const load = useCallback(async () => {
    try {
      const res = await cmsAPI.getGallery();
      setItems(res.data || []);
    } catch {
      error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.image) return error('Upload an image first');
    try {
      const res = editingId ? await cmsAPI.updateImage(editingId, form) : await cmsAPI.addImage(form);
      setItems((prev) => editingId ? prev.map((item) => item.id === editingId ? res.data : item) : [...prev, res.data]);
      setForm(emptyForm);
      setEditingId(null);
      success(editingId ? 'Gallery image updated' : 'Image added');
    } catch {
      error(editingId ? 'Failed to update image' : 'Failed to add image');
    }
  };

  const move = async (index, offset) => {
    const target = index + offset;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    try {
      await Promise.all(next.map((item, order) => cmsAPI.updateImage(item.id, { sortOrder: order })));
      success('Gallery order saved');
    } catch { error('Could not save gallery order'); load(); }
  };

  const remove = async () => {
    if (!deleteItem) return;
    try {
      await cmsAPI.deleteImage(deleteItem.id);
      setItems((prev) => prev.filter((x) => x.id !== deleteItem.id));
      setDeleteItem(null);
      success('Image deleted');
    } catch {
      error('Failed to delete image');
    }
  };

  return (
    <>
      <TopBar breadcrumb="CMS / Gallery" />
      <div className="admin-content">
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><h1 className="card-title">Gallery Manager</h1></div>
          <div className="form-group"><label className="form-label">Image</label><ImageUploader currentImage={form.image} onUpload={(url) => setForm({ ...form, image: url })} onRemove={() => setForm({ ...form, image: '' })} /></div>
          <div className="admin-form-grid" style={{ gap: 12 }}>
            <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="plants">Manufacturing Plants</option><option value="office">Corporate HQ</option><option value="events">Events & Exhibitions</option><option value="celebration">Celebrations</option></select></div>
            <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}><button className="btn btn-primary" onClick={save}>{editingId ? <Save size={16} /> : <Plus size={16} />}{editingId ? 'Save Changes' : 'Add Image'}</button>{editingId && <button className="btn btn-secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}><X size={16} /> Cancel</button>}</div>
        </div>

        <div className="card">
          {loading ? 'Loading...' : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 16 }}>
              {items.map((item, index) => (
                <div key={item.id} style={{ border: '1px solid var(--admin-border)', borderRadius: 8, overflow: 'hidden' }}>
                  <img src={item.image} alt={item.title || 'gallery'} style={{ width: '100%', height: 150, objectFit: 'cover' }} />
                  <div style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>{item.title || 'Untitled'}</div>
                    <div className="text-muted" style={{ marginBottom: 8 }}>{item.category}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}><button className="btn btn-secondary" onClick={() => { setEditingId(item.id); setForm({ ...emptyForm, ...item }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Edit2 size={15} /> Edit</button><button className="btn btn-secondary" onClick={() => move(index, -1)} disabled={index === 0}><ArrowUp size={15} /></button><button className="btn btn-secondary" onClick={() => move(index, 1)} disabled={index === items.length - 1}><ArrowDown size={15} /></button><button className="btn btn-danger" onClick={() => setDeleteItem(item)}><Trash2 size={15} /></button></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ConfirmModal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={remove} title="Delete Image" message="Are you sure?" confirmText="Delete" type="danger" />
    </>
  );
}
