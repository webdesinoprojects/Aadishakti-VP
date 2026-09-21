import { useCallback, useEffect, useState } from 'react';
import { Eye, GripVertical, Plus, Save, Trash2 } from 'lucide-react';
import TopBar from '../../components/TopBar';
import ImageUploader from '../../components/ImageUploader';
import { useToast } from '../../context/ToastContext';
import { cmsAPI } from '../../utils/api';
import {
  DEFAULT_CUSTOM_ALLOY_CONTENT,
  normalizeCustomAlloyContent,
} from '../../../data/customAlloyContent';
import './custom-alloy-editor.css';

const createKey = (value, index) =>
  String(value || `element-${index + 1}`)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function CustomAlloyEditor() {
  const [form, setForm] = useState(DEFAULT_CUSTOM_ALLOY_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  const load = useCallback(async () => {
    try {
      const response = await cmsAPI.getSingleton('customAlloy');
      setForm(normalizeCustomAlloyContent(response.data?.data));
    } catch (loadError) {
      console.error('Failed to load Custom Alloy CMS content:', loadError);
      error('Failed to load Custom Alloy page content.');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    load();
  }, [load]);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const updateListItem = (field, index, itemField, value) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [itemField]: value } : item),
    }));
  };

  const removeListItem = (field, index) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const addPackagingOption = () => {
    setForm((current) => ({
      ...current,
      packagingOptions: [...current.packagingOptions, { value: '', label: '' }],
    }));
  };

  const addAlloyElement = () => {
    setForm((current) => ({
      ...current,
      alloyElements: [...current.alloyElements, { key: '', name: '', defaultVal: '' }],
    }));
  };

  const save = async () => {
    if (!form.heroTitle.trim() || !form.heading.trim()) {
      error('Hero title and page heading are required.');
      return;
    }

    const payload = {
      ...form,
      packagingOptions: form.packagingOptions
        .filter((option) => option.label.trim())
        .map((option) => ({ value: option.value.trim() || option.label.trim(), label: option.label.trim() })),
      alloyElements: form.alloyElements
        .filter((element) => element.name.trim())
        .map((element, index) => ({
          key: createKey(element.key || element.name, index),
          name: element.name.trim(),
          defaultVal: element.defaultVal.trim(),
        })),
    };

    setSaving(true);
    try {
      const response = await cmsAPI.updateSingleton('customAlloy', payload);
      setForm(normalizeCustomAlloyContent(response.data?.data));
      success('Custom Alloy page saved and published.');
    } catch (saveError) {
      console.error('Failed to save Custom Alloy CMS content:', saveError);
      error(saveError.response?.data?.error || 'Failed to save Custom Alloy page.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <TopBar breadcrumb="CMS / Custom Alloy" />
        <div className="admin-content"><div className="card custom-alloy-loading">Loading page content…</div></div>
      </>
    );
  }

  return (
    <>
      <TopBar breadcrumb="CMS / Custom Alloy" />
      <div className="admin-content custom-alloy-admin">
        <div className="custom-alloy-admin-heading">
          <div>
            <h1>Custom Alloy Page</h1>
            <p>Edit the public quote page, composition defaults, packaging choices, and confirmation copy.</p>
          </div>
          <a className="btn btn-secondary" href="/custom-alloy" target="_blank" rel="noreferrer">
            <Eye size={16} /> Preview page
          </a>
        </div>

        <section className="card custom-alloy-section">
          <div className="card-header">
            <h2 className="card-title">Hero and introduction</h2>
            <p className="card-subtitle">Controls the public page banner and the copy above the form.</p>
          </div>
          <div className="admin-form-grid">
            <TextField label="Hero title" value={form.heroTitle} onChange={(value) => setField('heroTitle', value)} required />
            <TextField label="Breadcrumb label" value={form.breadcrumbLabel} onChange={(value) => setField('breadcrumbLabel', value)} />
            <TextField label="Section label" value={form.sectionLabel} onChange={(value) => setField('sectionLabel', value)} />
            <TextField label="Page heading" value={form.heading} onChange={(value) => setField('heading', value)} required />
          </div>
          <TextArea label="Introduction" value={form.introduction} onChange={(value) => setField('introduction', value)} rows={3} />
          <div className="form-group">
            <label className="form-label">Hero background image</label>
            <ImageUploader
              currentImage={form.heroImage}
              onUpload={(url) => setField('heroImage', url)}
              onRemove={() => setField('heroImage', '')}
            />
          </div>
        </section>

        <section className="card custom-alloy-section">
          <div className="card-header custom-alloy-section-title">
            <div>
              <h2 className="card-title">Alloy composition fields</h2>
              <p className="card-subtitle">These rows become editable target values on the quote form.</p>
            </div>
            <button type="button" className="btn btn-secondary" onClick={addAlloyElement}><Plus size={16} /> Add element</button>
          </div>
          <div className="custom-alloy-list">
            {form.alloyElements.map((element, index) => (
              <div className="custom-alloy-row custom-alloy-element-row" key={`${element.key}-${index}`}>
                <GripVertical className="custom-alloy-grip" size={18} />
                <TextField label="Internal key" value={element.key} onChange={(value) => updateListItem('alloyElements', index, 'key', value)} />
                <TextField label="Element / property" value={element.name} onChange={(value) => updateListItem('alloyElements', index, 'name', value)} />
                <TextField label="Default target" value={element.defaultVal} onChange={(value) => updateListItem('alloyElements', index, 'defaultVal', value)} />
                <button type="button" className="btn btn-danger custom-alloy-delete" onClick={() => removeListItem('alloyElements', index)} aria-label={`Remove ${element.name || 'element'}`}><Trash2 size={16} /></button>
              </div>
            ))}
            {!form.alloyElements.length && <div className="custom-alloy-empty">No composition fields. Add one to show the specification table.</div>}
          </div>
        </section>

        <section className="card custom-alloy-section">
          <div className="card-header custom-alloy-section-title">
            <div>
              <h2 className="card-title">Packaging choices</h2>
              <p className="card-subtitle">Options available in the Packaging Preference dropdown.</p>
            </div>
            <button type="button" className="btn btn-secondary" onClick={addPackagingOption}><Plus size={16} /> Add option</button>
          </div>
          <div className="custom-alloy-list">
            {form.packagingOptions.map((option, index) => (
              <div className="custom-alloy-row custom-alloy-package-row" key={`${option.value}-${index}`}>
                <GripVertical className="custom-alloy-grip" size={18} />
                <TextField label="Stored value" value={option.value} onChange={(value) => updateListItem('packagingOptions', index, 'value', value)} />
                <TextField label="Visible label" value={option.label} onChange={(value) => updateListItem('packagingOptions', index, 'label', value)} />
                <button type="button" className="btn btn-danger custom-alloy-delete" onClick={() => removeListItem('packagingOptions', index)} aria-label={`Remove ${option.label || 'option'}`}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </section>

        <section className="card custom-alloy-section">
          <div className="card-header">
            <h2 className="card-title">Form, upload, and confirmation copy</h2>
            <p className="card-subtitle">Edit supporting labels without changing how enquiries are submitted.</p>
          </div>
          <div className="admin-form-grid">
            <TextField label="Specification heading" value={form.metallurgicalHeading} onChange={(value) => setField('metallurgicalHeading', value)} />
            <TextField label="Submit button" value={form.submitButton} onChange={(value) => setField('submitButton', value)} />
            <TextField label="Notes label" value={form.notesLabel} onChange={(value) => setField('notesLabel', value)} />
            <TextField label="Notes placeholder" value={form.notesPlaceholder} onChange={(value) => setField('notesPlaceholder', value)} />
            <TextField label="Upload label" value={form.uploadLabel} onChange={(value) => setField('uploadLabel', value)} />
            <TextField label="Upload file hint" value={form.uploadHint} onChange={(value) => setField('uploadHint', value)} />
          </div>
          <TextArea label="Upload prompt" value={form.uploadPrompt} onChange={(value) => setField('uploadPrompt', value)} rows={2} />
          <div className="admin-form-grid">
            <TextField label="Success heading" value={form.successTitle} onChange={(value) => setField('successTitle', value)} />
            <TextField label="Success button" value={form.successButton} onChange={(value) => setField('successButton', value)} />
          </div>
          <TextArea label="Success message" value={form.successMessage} onChange={(value) => setField('successMessage', value)} rows={3} />
        </section>

        <div className="custom-alloy-savebar">
          <span>Saving publishes changes to the public Custom Alloy page.</span>
          <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving…' : 'Save and publish'}
          </button>
        </div>
      </div>
    </>
  );
}

function TextField({ label, value, onChange, required = false }) {
  return (
    <div className="form-group">
      <label className={`form-label ${required ? 'required' : ''}`}>{label}</label>
      <input className="form-input" value={value || ''} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function TextArea({ label, value, onChange, rows }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <textarea className="form-textarea" rows={rows} value={value || ''} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
