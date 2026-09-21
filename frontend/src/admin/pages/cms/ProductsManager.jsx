import { useCallback, useEffect, useMemo, useState } from 'react';
import { Archive, Edit, Package, Plus, Search, X } from 'lucide-react';
import TopBar from '../../components/TopBar';
import ConfirmModal from '../../components/ConfirmModal';
import ImageUploader from '../../components/ImageUploader';
import { cmsAPI } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import './products-manager.css';

const blankProduct = () => ({ name: '', slug: '', code: '', purity: '', description: '', packaging: '', image: '', datasheet: '', specifications: [], features: [], status: 'published', sortOrder: 0 });
const normalizeProduct = (product) => ({ ...blankProduct(), ...product, specifications: (product.specifications || []).map((item) => ({ parameter: item.parameter ?? item.elem ?? '', value: item.value ?? item.val ?? '' })), features: product.features || [] });

function ProductForm({ value, editing, busy, onChange, onCancel, onSave }) {
  const set = (key, next) => onChange({ ...value, [key]: next });
  const setSpec = (index, key, next) => set('specifications', value.specifications.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: next } : item));
  return <section className="product-editor">
    <header><div><span>{editing ? 'Edit catalog item' : 'New catalog item'}</span><h2>{editing ? value.name : 'Add product'}</h2></div><button type="button" onClick={onCancel} aria-label="Close editor"><X size={20} /></button></header>
    <div className="product-editor-body">
      <div className="product-editor-grid">
        <label><span>Product name *</span><input value={value.name} onChange={(event) => set('name', event.target.value)} /></label>
        <label><span>URL slug</span><input value={value.slug} onChange={(event) => set('slug', event.target.value)} placeholder="generated-from-name" /></label>
        <label><span>Grade / standard</span><input value={value.code} onChange={(event) => set('code', event.target.value)} /></label>
        <label><span>Purity / formula</span><input value={value.purity} onChange={(event) => set('purity', event.target.value)} /></label>
        <label><span>Publishing status</span><select value={value.status} onChange={(event) => set('status', event.target.value)}><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label>
        <label><span>Display order</span><input type="number" min="0" value={value.sortOrder} onChange={(event) => set('sortOrder', event.target.value)} /></label>
        <label className="is-wide"><span>Overview</span><textarea rows="4" value={value.description} onChange={(event) => set('description', event.target.value)} /></label>
        <label className="is-wide"><span>Packaging</span><textarea rows="3" value={value.packaging} onChange={(event) => set('packaging', event.target.value)} /></label>
        <label className="is-wide"><span>Applications (one per line)</span><textarea rows="4" value={value.features.join('\n')} onChange={(event) => set('features', event.target.value.split('\n'))} /></label>
        <label className="is-wide"><span>Datasheet URL</span><input value={value.datasheet} onChange={(event) => set('datasheet', event.target.value)} placeholder="Optional PDF URL" /></label>
      </div>
      <section className="product-spec-editor"><div><h3>Technical specifications</h3><button type="button" onClick={() => set('specifications', [...value.specifications, { parameter: '', value: '' }])}><Plus size={15} /> Add row</button></div>{value.specifications.map((item, index) => <div className="product-spec-row" key={`${index}-${item.parameter}`}><input value={item.parameter} onChange={(event) => setSpec(index, 'parameter', event.target.value)} placeholder="Parameter" /><input value={item.value} onChange={(event) => setSpec(index, 'value', event.target.value)} placeholder="Value" /><button type="button" onClick={() => set('specifications', value.specifications.filter((_item, itemIndex) => itemIndex !== index))} aria-label="Remove specification"><X size={16} /></button></div>)}</section>
      <section className="product-image-editor"><h3>Product image</h3><ImageUploader currentImage={value.image} onUpload={(url) => set('image', url)} onRemove={() => set('image', '')} /></section>
    </div>
    <footer><button className="btn btn-secondary" type="button" disabled={busy} onClick={onCancel}>Cancel</button><button className="btn btn-primary" type="button" disabled={busy || !value.name.trim()} onClick={onSave}>{busy ? 'Saving...' : editing ? 'Save changes' : 'Create product'}</button></footer>
  </section>;
}

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const { success, error } = useToast();

  const loadProducts = useCallback(async () => {
    try { const response = await cmsAPI.getProducts(); setProducts(response.data || []); }
    catch (requestError) { error(requestError.response?.data?.error || 'Failed to load products.'); }
    finally { setLoading(false); }
  }, [error]);
  useEffect(() => { loadProducts(); }, [loadProducts]);

  const save = async () => {
    if (!formData?.name.trim()) return error('Product name is required.');
    const payload = { ...formData, features: formData.features.map((item) => item.trim()).filter(Boolean), specifications: formData.specifications.filter((item) => item.parameter.trim() || item.value.trim()), sortOrder: Number(formData.sortOrder) || 0 };
    setBusy(true);
    try {
      const response = editingId ? await cmsAPI.updateProduct(editingId, payload) : await cmsAPI.createProduct(payload);
      setProducts((current) => editingId ? current.map((item) => item.id === editingId ? response.data : item) : [...current, response.data]);
      success(editingId ? 'Product updated on the public catalog.' : 'Product added to the public catalog.');
      setEditingId(null); setFormData(null);
    } catch (requestError) { error(requestError.response?.data?.error || 'Failed to save product.'); }
    finally { setBusy(false); }
  };

  const archive = async () => {
    setBusy(true);
    try { const response = await cmsAPI.updateProduct(archiveTarget.id, { status: 'archived' }); setProducts((current) => current.map((item) => item.id === archiveTarget.id ? response.data : item)); success('Product archived and removed from the public catalog.'); setArchiveTarget(null); }
    catch (requestError) { error(requestError.response?.data?.error || 'Failed to archive product.'); }
    finally { setBusy(false); }
  };

  const visible = useMemo(() => products.filter((item) => `${item.name} ${item.code}`.toLowerCase().includes(search.toLowerCase())), [products, search]);
  return <><TopBar breadcrumb="CMS / Products" /><div className="admin-content product-manager-page">
    <div className="product-manager-heading"><div><h1>Products Manager</h1><p>Every published item appears on the public Products page and has its own detail page.</p></div><button className="btn btn-primary" onClick={() => { setEditingId(null); setFormData(blankProduct()); }}><Plus size={17} />Add product</button></div>
    <div className="product-manager-toolbar"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search catalog..." /><span>{products.length} products</span></div>
    {formData && <ProductForm value={formData} editing={Boolean(editingId)} busy={busy} onChange={setFormData} onCancel={() => { setEditingId(null); setFormData(null); }} onSave={save} />}
    {loading ? <div className="product-manager-empty">Loading products...</div> : <div className="product-manager-grid">{visible.map((product) => <article className="product-manager-card" key={product.id}>{product.image ? <img src={product.image} alt={product.name} /> : <div className="product-manager-no-image"><Package size={30} /></div>}<div><span className={`product-manager-status is-${product.status}`}>{product.status}</span><h2>{product.name}</h2><small>{product.code || 'No grade supplied'}</small><p>{product.description || 'No description supplied.'}</p><footer><button className="btn btn-secondary" onClick={() => { setEditingId(product.id); setFormData(normalizeProduct(product)); }}><Edit size={15} />Edit</button>{product.status !== 'archived' && <button className="btn btn-secondary" onClick={() => setArchiveTarget(product)}><Archive size={15} />Archive</button>}</footer></div></article>)}{!visible.length && <div className="product-manager-empty">No matching products found.</div>}</div>}
  </div><ConfirmModal isOpen={Boolean(archiveTarget)} onClose={() => !busy && setArchiveTarget(null)} onConfirm={archive} title="Archive product" message="This product will no longer appear on the public website. Its CMS record will be preserved." confirmText={busy ? 'Archiving...' : 'Archive'} type="danger" /></>;
}
