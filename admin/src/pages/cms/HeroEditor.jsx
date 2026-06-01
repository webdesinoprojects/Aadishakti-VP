import { useState, useEffect } from 'react';
import { Save, Eye } from 'lucide-react';
import TopBar from '../../components/TopBar';
import ImageUploader from '../../components/ImageUploader';
import { cmsAPI } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const HeroEditor = () => {
  const [data, setData] = useState({
    aboveHeadline: '',
    headlineLine1: '',
    highlightedWord: '',
    headlineLine2: '',
    subtext: '',
    cta1Text: '',
    cta1Link: '',
    cta2Text: '',
    cta2Link: '',
    stats: [
      { number: '', label: '' },
      { number: '', label: '' },
      { number: '', label: '' },
    ],
    backgroundImage: '',
    backgroundVideo: '',
    announcementText: '',
    announcementEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await cmsAPI.getHero();
      setData(response.data);
    } catch (err) {
      console.error('Error loading hero data:', err);
      error('Failed to load hero content');
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

  const updateStat = (index, field, value) => {
    const newStats = [...data.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setData({ ...data, stats: newStats });
  };

  if (loading) {
    return (
      <>
        <TopBar breadcrumb="Home / Hero" />
        <div className="admin-content">
          <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar breadcrumb="Home / Hero" />
      <div className="admin-content">
        <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="card-header">
            <h1 className="card-title">Hero Content</h1>
            <p className="card-subtitle">Edit the homepage hero section</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Above Headline */}
            <div className="form-group">
              <label className="form-label">Above-headline label</label>
              <input
                type="text"
                className="form-input"
                value={data.aboveHeadline}
                onChange={(e) => setData({ ...data, aboveHeadline: e.target.value })}
                placeholder="// EST. 2004 · MUNDRA · ROORKEE"
              />
              <div className="form-help">Small text that appears above the main headline</div>
            </div>

            {/* Main Headline */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Main Headline Line 1</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.headlineLine1}
                  onChange={(e) => setData({ ...data, headlineLine1: e.target.value })}
                  placeholder="India's"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Highlighted Word</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.highlightedWord}
                  onChange={(e) => setData({ ...data, highlightedWord: e.target.value })}
                  placeholder="Sovereign"
                />
                <div className="form-help">This word will be highlighted in red</div>
              </div>
              <div className="form-group">
                <label className="form-label">Headline Line 2</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.headlineLine2}
                  onChange={(e) => setData({ ...data, headlineLine2: e.target.value })}
                  placeholder="of Secondary Lead"
                />
              </div>
            </div>

            {/* Subtext */}
            <div className="form-group">
              <label className="form-label">Subtext</label>
              <textarea
                className="form-textarea"
                value={data.subtext}
                onChange={(e) => setData({ ...data, subtext: e.target.value })}
                placeholder="Two state-of-the-art refineries..."
                rows={2}
              />
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div className="form-group">
                  <label className="form-label">CTA Button 1 Text</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.cta1Text}
                    onChange={(e) => setData({ ...data, cta1Text: e.target.value })}
                    placeholder="Explore Operations"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CTA Button 1 Link</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.cta1Link}
                    onChange={(e) => setData({ ...data, cta1Link: e.target.value })}
                    placeholder="/businesses"
                  />
                </div>
              </div>
              <div>
                <div className="form-group">
                  <label className="form-label">CTA Button 2 Text</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.cta2Text}
                    onChange={(e) => setData({ ...data, cta2Text: e.target.value })}
                    placeholder="Investor Relations →"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CTA Button 2 Link</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.cta2Link}
                    onChange={(e) => setData({ ...data, cta2Link: e.target.value })}
                    placeholder="/investors"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div>
              <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>
                Stats (3 items)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {data.stats.map((stat, index) => (
                  <div key={index} style={{ 
                    padding: '16px', 
                    border: '1px solid var(--admin-border)', 
                    borderRadius: '6px',
                    background: 'var(--admin-bg)'
                  }}>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, marginBottom: '4px', display: 'block' }}>
                        Number
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={stat.number}
                        onChange={(e) => updateStat(index, 'number', e.target.value)}
                        placeholder="50,000+"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, marginBottom: '4px', display: 'block' }}>
                        Label
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={stat.label}
                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                        placeholder="Metric Tonnes"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Background Media */}
            <div>
              <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>
                Hero Background
              </label>
              <ImageUploader
                currentImage={data.backgroundImage}
                onUpload={(url) => setData({ ...data, backgroundImage: url })}
                onRemove={() => setData({ ...data, backgroundImage: '' })}
              />
              <div className="form-help" style={{ marginTop: '8px' }}>
                Upload a background image for the hero section
              </div>
            </div>

            {/* Announcement Bar */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Announcement Bar Text
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={data.announcementEnabled}
                    onChange={(e) => setData({ ...data, announcementEnabled: e.target.checked })}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>Enabled</span>
                </label>
              </div>
              <input
                type="text"
                className="form-input"
                value={data.announcementText}
                onChange={(e) => setData({ ...data, announcementText: e.target.value })}
                placeholder="ISO 9001:2015 Certified · BIS Approved · ..."
                disabled={!data.announcementEnabled}
              />
            </div>

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
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <a
                href="http://localhost:5173"
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
    </>
  );
};

export default HeroEditor;
