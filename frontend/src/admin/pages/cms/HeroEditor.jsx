import { useState, useEffect } from 'react';
import { Save, Eye, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import TopBar from '../../components/TopBar';
import ImageUploader from '../../components/ImageUploader';
import ConfirmModal from '../../components/ConfirmModal';
import { cmsAPI } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const HeroEditor = () => {
  const [data, setData] = useState({
    heroSlides: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const { success, error } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await cmsAPI.getHero();
      console.log('Loaded hero data:', response.data);
      const loadedData = response.data || {};
      // Ensure heroSlides is always an array
      setData({
        ...loadedData,
        heroSlides: Array.isArray(loadedData.heroSlides) ? loadedData.heroSlides : []
      });
    } catch (err) {
      console.error('Error loading hero data:', err);
      error('Failed to load hero content');
      // Set default data on error
      setData({ heroSlides: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await cmsAPI.updateHero(data);
      success('Changes saved successfully');
    } catch (err) {
      console.error('Error saving hero data:', err);
      error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const addSlide = () => {
    const currentSlides = Array.isArray(data.heroSlides) ? data.heroSlides : [];
    setData({
      ...data,
      heroSlides: [
        ...currentSlides,
        {
          image: '',
          eyebrow: '',
          titleA: '',
          titleB: '',
          titleC: '',
          subtitle: ''
        }
      ]
    });
  };

  const updateSlide = (index, field, value) => {
    const currentSlides = Array.isArray(data.heroSlides) ? data.heroSlides : [];
    const newSlides = [...currentSlides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setData({ ...data, heroSlides: newSlides });
  };

  const deleteSlide = (index) => {
    const currentSlides = Array.isArray(data.heroSlides) ? data.heroSlides : [];
    const newSlides = currentSlides.filter((_, i) => i !== index);
    setData({ ...data, heroSlides: newSlides });
    setDeleteModal(null);
    success('Slide deleted');
  };

  const moveSlide = (index, direction) => {
    const currentSlides = Array.isArray(data.heroSlides) ? data.heroSlides : [];
    const newSlides = [...currentSlides];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newSlides.length) return;
    
    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
    setData({ ...data, heroSlides: newSlides });
  };

  if (loading) {
    return (
      <>
        <TopBar breadcrumb="CMS / Home / Hero" />
        <div className="admin-content">
          <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar breadcrumb="CMS / Home / Hero" />
      <div className="admin-content">
        <div className="card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="card-header">
            <h1 className="card-title">Hero Slides Manager</h1>
            <p className="card-subtitle">Manage homepage hero carousel slides</p>
          </div>

          {/* Hero Slides */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {Array.isArray(data.heroSlides) && data.heroSlides.length > 0 ? (
              data.heroSlides.map((slide, index) => (
                <div
                  key={index}
                  style={{
                    border: '2px solid var(--admin-border)',
                    borderRadius: '8px',
                    padding: '24px',
                    background: 'var(--admin-surface)',
                    position: 'relative'
                  }}
                >
                  {/* Slide Header */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '20px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--admin-border)'
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
                      Slide {index + 1}
                    </h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => moveSlide(index, 'up')}
                        disabled={index === 0}
                        style={{ padding: '6px 12px' }}
                        title="Move up"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => moveSlide(index, 'down')}
                        disabled={index === (Array.isArray(data.heroSlides) ? data.heroSlides.length : 0) - 1}
                        style={{ padding: '6px 12px' }}
                        title="Move down"
                      >
                        <ChevronDown size={16} />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => setDeleteModal(index)}
                        style={{ padding: '6px 12px' }}
                        title="Delete slide"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Slide Content */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Eyebrow Text */}
                    <div className="form-group">
                      <label className="form-label">Eyebrow Text</label>
                      <input
                        type="text"
                        className="form-input"
                        value={slide.eyebrow || ''}
                        onChange={(e) => updateSlide(index, 'eyebrow', e.target.value)}
                        placeholder="// EST. 2004 · MUNDRA · ROORKEE"
                      />
                      <div className="form-help">Small text above the main headline</div>
                    </div>

                    {/* Title Parts */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div className="form-group">
                        <label className="form-label">Title Part A</label>
                        <input
                          type="text"
                          className="form-input"
                          value={slide.titleA || ''}
                          onChange={(e) => updateSlide(index, 'titleA', e.target.value)}
                          placeholder="India's"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Title Part B (Highlighted)</label>
                        <input
                          type="text"
                          className="form-input"
                          value={slide.titleB || ''}
                          onChange={(e) => updateSlide(index, 'titleB', e.target.value)}
                          placeholder="Sovereign"
                        />
                        <div className="form-help">This will be highlighted in red</div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Title Part C</label>
                        <input
                          type="text"
                          className="form-input"
                          value={slide.titleC || ''}
                          onChange={(e) => updateSlide(index, 'titleC', e.target.value)}
                          placeholder="of Secondary Lead"
                        />
                      </div>
                    </div>

                    {/* Subtitle */}
                    <div className="form-group">
                      <label className="form-label">Subtitle</label>
                      <textarea
                        className="form-textarea"
                        value={slide.subtitle || ''}
                        onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                        placeholder="Two state-of-the-art refineries..."
                        rows={2}
                      />
                    </div>

                    {/* Background Image */}
                    <div className="form-group">
                      <label className="form-label">Background Image</label>
                      <ImageUploader
                        currentImage={slide.image}
                        onUpload={(url) => updateSlide(index, 'image', url)}
                        onRemove={() => updateSlide(index, 'image', '')}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px',
                border: '2px dashed var(--admin-border)',
                borderRadius: '8px'
              }}>
                <p style={{ color: 'var(--admin-text-muted)', marginBottom: '16px' }}>
                  No hero slides yet. Add your first slide to get started.
                </p>
              </div>
            )}

            {/* Add Slide Button */}
            <button 
              className="btn btn-secondary" 
              onClick={addSlide}
              style={{ alignSelf: 'flex-start' }}
            >
              <Plus size={16} />
              Add New Slide
            </button>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              paddingTop: '24px', 
              borderTop: '1px solid var(--admin-border)' 
            }}>
              <button 
                className="btn btn-primary" 
                onClick={handleSave}
                disabled={saving}
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save All Changes'}
              </button>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <Eye size={16} />
                Preview on Website
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal !== null}
        onClose={() => setDeleteModal(null)}
        onConfirm={() => deleteSlide(deleteModal)}
        title="Delete Slide"
        message={`Are you sure you want to delete Slide ${deleteModal !== null ? deleteModal + 1 : ''}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </>
  );
};

export default HeroEditor;
