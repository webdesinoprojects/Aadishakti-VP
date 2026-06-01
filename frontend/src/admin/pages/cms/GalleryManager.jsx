import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import TopBar from '../../components/TopBar';
import ConfirmModal from '../../components/ConfirmModal';
import ImageUploader from '../../components/ImageUploader';
import { cmsAPI } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ image: '', category: 'plant', title: '' });
  const [loading, setLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState(null);
  const { success, error } = useToast();

  const load = async () => {
    try {
      const res = await cmsAPI.getGallery();
      setItems(res.data || []);
    } catch {
      error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.image) return error('Upload an image first');
    try {
      const res = await cmsAPI.addImage(form);
      setItems((prev) => [res.data, ...prev]);
      setForm({ image: '', category: 'plant', title: '' });
      success('Image added');
    } catch {
      error('Failed to add image');
    }
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="plant">Plant</option><option value="office">Office</option><option value="products">Products</option></select></div>
            <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          </div>
          <button className="btn btn-primary" onClick={add}><Plus size={16} /> Add Image</button>
        </div>

        <div className="card">
          {loading ? 'Loading...' : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 16 }}>
              {items.map((item) => (
                <div key={item.id} style={{ border: '1px solid var(--admin-border)', borderRadius: 8, overflow: 'hidden' }}>
                  <img src={item.image} alt={item.title || 'gallery'} style={{ width: '100%', height: 150, objectFit: 'cover' }} />
                  <div style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600 }}>{item.title || 'Untitled'}</div>
                    <div className="text-muted" style={{ marginBottom: 8 }}>{item.category}</div>
                    <button className="btn btn-secondary" onClick={() => setDeleteItem(item)}><Trash2 size={16} /> Delete</button>
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
