import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import TopBar from '../../components/TopBar';
import ConfirmModal from '../../components/ConfirmModal';
import ImageUploader from '../../components/ImageUploader';
import { cmsAPI } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    features: [],
  });
  const [deleteModal, setDeleteModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { success, error } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await cmsAPI.getProducts();
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error loading products:', err);
      error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      error('Product name is required');
      return;
    }

    try {
      if (editingId) {
        await cmsAPI.updateProduct(editingId, formData);
        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...formData } : p))
        );
        success('Product updated');
      } else {
        const res = await cmsAPI.createProduct(formData);
        setProducts((prev) => [...prev, res.data]);
        success('Product created');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', description: '', image: '', features: [] });
    } catch (err) {
      console.error('Error saving product:', err);
      error('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await cmsAPI.deleteProduct(deleteModal.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteModal.id));
      success('Product deleted');
      setDeleteModal(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <TopBar breadcrumb="CMS / Products" />
      <div className="admin-content">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Products Manager</h1>
            <p className="card-subtitle">Manage your products</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--admin-text-muted)',
                }}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>
            <button className="btn btn-primary" onClick={() => {
              setEditingId(null);
              setFormData({ name: '', description: '', image: '', features: [] });
              setShowForm(true);
            }}>
              <Plus size={18} /> Add Product
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div style={{
              background: 'var(--admin-sidebar-bg)',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid var(--admin-border)'
            }}>
              <h3 style={{ marginBottom: '16px', color: 'white' }}>{editingId ? 'Edit Product' : 'New Product'}</h3>
              
              <div className="form-group">
                <label style={{ color: 'white' }}>Product Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label style={{ color: 'white' }}>Description</label>
                <textarea
                  className="form-input"
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label style={{ color: 'white' }}>Product Image</label>
                <ImageUploader
                  currentImage={formData.image}
                  onUpload={(url) => setFormData({ ...formData, image: url })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save Product
                </button>
                <button className="btn btn-secondary" onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--admin-text-muted)' }}>
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--admin-text-muted)' }}>
              No products found
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {filteredProducts.map((product) => (
                <div key={product.id} style={{
                  border: '1px solid var(--admin-border)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'all 0.2s'
                }}>
                  {product.image && (
                    <img src={product.image} alt={product.name} style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover'
                    }} />
                  )}
                  <div style={{ padding: '16px' }}>
                    <h4 style={{ marginBottom: '8px' }}>{product.name}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', marginBottom: '12px' }}>
                      {product.description?.substring(0, 100)}...
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEdit(product)}
                        style={{ flex: 1 }}
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setDeleteModal({ id: product.id })}
                        style={{ flex: 1 }}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        confirmText="Delete"
        type="danger"
      />
    </>
  );
};

export default ProductsManager;
