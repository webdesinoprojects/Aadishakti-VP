import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowDown, ArrowUp, ExternalLink, FilePenLine, Plus, Save, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import TopBar from '../../components/TopBar';
import ImageUploader from '../../components/ImageUploader';
import { useToast } from '../../context/ToastContext';
import { cmsAPI } from '../../utils/api';
import { PUBLIC_PAGE_DEFINITIONS, PUBLIC_PAGE_ORDER } from './public-page-definitions';
import './public-pages-manager.css';

export default function PublicPagesManager() {
  const { pageKey } = useParams();
  if (!pageKey) return <PageDirectory />;
  const definition = PUBLIC_PAGE_DEFINITIONS[pageKey];
  if (!definition) return <Navigate to="/admin/cms/pages" replace />;
  return <PageEditor pageKey={pageKey} definition={definition} />;
}

function PageDirectory() {
  return (
    <>
      <TopBar breadcrumb="CMS / Public Pages" />
      <div className="admin-content public-pages-admin">
        <header className="public-pages-heading">
          <div>
            <h1>Public Website Pages</h1>
            <p>Structured editors for page copy, cards, images, tabs, and public navigation.</p>
          </div>
        </header>
        <div className="public-page-directory">
          {PUBLIC_PAGE_ORDER.map((key) => {
            const page = PUBLIC_PAGE_DEFINITIONS[key];
            return (
              <Link className="public-page-card" to={`/admin/cms/pages/${key}`} key={key}>
                <span className="public-page-card-icon"><FilePenLine size={22} /></span>
                <span>
                  <strong>{page.title}</strong>
                  <small>{page.description}</small>
                </span>
                <span className="public-page-card-action">Edit →</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

function PageEditor({ pageKey, definition }) {
  const [form, setForm] = useState(definition.defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState(definition.sections[0]?.title || '');
  const { success, error } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await cmsAPI.getSingleton(definition.singletonKey);
      const value = response.data?.data;
      setForm(value && Object.keys(value).length ? { ...definition.defaults, ...value } : definition.defaults);
    } catch (loadError) {
      console.error(`Failed to load ${pageKey}:`, loadError);
      error(`Failed to load ${definition.title}.`);
    } finally {
      setLoading(false);
    }
  }, [definition, error, pageKey]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setActiveSection(definition.sections[0]?.title || ''); }, [definition]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const updateItem = (listKey, index, fieldKey, value) => {
    setForm((current) => ({
      ...current,
      [listKey]: (current[listKey] || []).map((item, itemIndex) =>
        itemIndex === index ? { ...item, [fieldKey]: value } : item),
    }));
  };

  const addItem = (field) => {
    const empty = Object.fromEntries(field.fields.map((itemField) => [itemField.key, itemField.type === 'boolean' ? false : ['lines', 'list'].includes(itemField.type) ? [] : '']));
    update(field.key, [...(form[field.key] || []), empty]);
  };

  const removeItem = (listKey, index) => update(listKey, (form[listKey] || []).filter((_, itemIndex) => itemIndex !== index));

  const moveItem = (listKey, index, offset) => {
    const items = [...(form[listKey] || [])];
    const target = index + offset;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    update(listKey, items);
  };

  const save = async () => {
    setSaving(true);
    try {
      const response = await cmsAPI.updateSingleton(definition.singletonKey, form);
      setForm({ ...definition.defaults, ...(response.data?.data || form) });
      success(`${definition.title} saved and published.`);
    } catch (saveError) {
      console.error(`Failed to save ${pageKey}:`, saveError);
      error(saveError.response?.data?.error || `Failed to save ${definition.title}.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <><TopBar breadcrumb={`CMS / ${definition.title}`} /><div className="admin-content"><div className="card public-page-loading">Loading content…</div></div></>;
  }

  return (
    <>
      <TopBar breadcrumb={`CMS / Public Pages / ${definition.title}`} />
      <div className="admin-content public-pages-admin public-page-editor">
        <header className="public-pages-heading">
          <div>
            <Link className="public-pages-back" to="/admin/cms/pages">← All public pages</Link>
            <h1>{definition.title}</h1>
            <p>{definition.description}</p>
          </div>
          <a className="btn btn-secondary" href={definition.publicRoute} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Preview page</a>
        </header>

        <Tabs.Root className="public-page-tabs" value={activeSection} onValueChange={setActiveSection}>
          <div className="public-page-tabbar-shell">
            <Tabs.List className="public-page-tabbar" aria-label={`${definition.title} sections`}>
              {definition.sections.map((section, index) => (
                <Tabs.Trigger className="public-page-tab" value={section.title} key={section.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>{section.title}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </div>

          {definition.sections.map((section) => (
            <Tabs.Content className="public-page-tab-content" value={section.title} key={section.title}>
              <section className="card public-page-section">
                <div className="card-header">
                  <div><span className="public-page-section-kicker">Editing section</span><h2 className="card-title">{section.title}</h2></div>
                  <span className="public-page-section-count">{section.fields.length} field group{section.fields.length === 1 ? '' : 's'}</span>
                </div>
                <div className={`public-page-fields ${section.fields.every((field) => field.type === 'image') ? 'public-page-image-grid' : ''}`}>
                  {section.fields.map((field) => field.type === 'list' ? (
                    <Repeater
                      key={field.key}
                      field={field}
                      items={form[field.key] || []}
                      onUpdate={updateItem}
                      onAdd={addItem}
                      onRemove={removeItem}
                      onMove={moveItem}
                    />
                  ) : (
                    <EditorField key={field.key} field={field} value={form[field.key]} onChange={(value) => update(field.key, value)} />
                  ))}
                </div>
              </section>
            </Tabs.Content>
          ))}
        </Tabs.Root>

        <div className="public-page-savebar">
          <span>Changes publish to the public website immediately.</span>
          <button className="btn btn-primary" type="button" onClick={save} disabled={saving}><Save size={16} />{saving ? 'Saving…' : 'Save and publish'}</button>
        </div>
      </div>
    </>
  );
}

function Repeater({ field, items, onUpdate, onAdd, onRemove, onMove }) {
  return (
    <div className="public-page-repeater">
      <div className="public-page-repeater-heading">
        <div><h3>{field.label}</h3><span>{items.length} item{items.length === 1 ? '' : 's'}</span></div>
        <button className="btn btn-secondary" type="button" onClick={() => onAdd(field)}><Plus size={16} /> Add item</button>
      </div>
      <div className="public-page-repeater-items">
        {items.map((item, index) => (
          <article className="public-page-repeater-item" key={`${field.key}-${index}`}>
            <div className="public-page-item-toolbar">
              <strong>{field.label} {index + 1}</strong>
              <div>
                <button type="button" onClick={() => onMove(field.key, index, -1)} disabled={index === 0} aria-label="Move up"><ArrowUp size={15} /></button>
                <button type="button" onClick={() => onMove(field.key, index, 1)} disabled={index === items.length - 1} aria-label="Move down"><ArrowDown size={15} /></button>
                <button className="danger" type="button" onClick={() => onRemove(field.key, index)} aria-label="Remove item"><Trash2 size={15} /></button>
              </div>
            </div>
            <div className="public-page-item-fields">
              {field.fields.map((itemField) => itemField.type === 'list' ? (
                <NestedRepeaterField
                  key={itemField.key}
                  field={itemField}
                  items={item[itemField.key] || []}
                  onChange={(value) => onUpdate(field.key, index, itemField.key, value)}
                />
              ) : (
                <EditorField key={itemField.key} field={itemField} value={item[itemField.key]} onChange={(value) => onUpdate(field.key, index, itemField.key, value)} />
              ))}
            </div>
          </article>
        ))}
        {!items.length && <div className="public-page-empty">No items yet. Use “Add item” to create the first one.</div>}
      </div>
    </div>
  );
}

function NestedRepeaterField({ field, items, onChange }) {
  const add = () => onChange([...items, Object.fromEntries(field.fields.map((itemField) => [itemField.key, itemField.type === 'boolean' ? false : itemField.type === 'lines' ? [] : '']))]);
  const remove = (index) => onChange(items.filter((_, itemIndex) => itemIndex !== index));
  const move = (index, offset) => {
    const next = [...items];
    const target = index + offset;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const update = (index, key, value) => onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));

  return (
    <div className="public-page-repeater public-page-nested-repeater">
      <div className="public-page-repeater-heading">
        <div><h3>{field.label}</h3><span>{items.length} item{items.length === 1 ? '' : 's'}</span></div>
        <button className="btn btn-secondary" type="button" onClick={add}><Plus size={15} /> Add</button>
      </div>
      <div className="public-page-repeater-items">
        {items.map((item, index) => (
          <article className="public-page-repeater-item" key={`${field.key}-${index}`}>
            <div className="public-page-item-toolbar">
              <strong>{field.label} {index + 1}</strong>
              <div>
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up"><ArrowUp size={14} /></button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label="Move down"><ArrowDown size={14} /></button>
                <button className="danger" type="button" onClick={() => remove(index)} aria-label="Remove item"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="public-page-item-fields">
              {field.fields.map((itemField) => <EditorField key={itemField.key} field={itemField} value={item[itemField.key]} onChange={(value) => update(index, itemField.key, value)} />)}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function EditorField({ field, value, onChange }) {
  if (field.type === 'image') {
    return <div className="form-group public-page-image-field"><label className="form-label">{field.label}</label><ImageUploader currentImage={value || ''} onUpload={onChange} onRemove={() => onChange('')} /></div>;
  }
  if (field.type === 'boolean') {
    return <label className="public-page-checkbox"><input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} /><span>{field.label}</span></label>;
  }
  if (field.type === 'textarea' || field.type === 'lines') {
    const displayValue = field.type === 'lines' && Array.isArray(value) ? value.join('\n') : value || '';
    return <div className="form-group"><label className="form-label">{field.label}</label><textarea className="form-textarea" rows={field.type === 'lines' ? 4 : 3} value={displayValue} onChange={(event) => onChange(field.type === 'lines' ? event.target.value.split('\n').filter(Boolean) : event.target.value)} />{field.type === 'lines' && <div className="form-help">One item per line.</div>}</div>;
  }
  return <div className="form-group"><label className="form-label">{field.label}</label><input className="form-input" value={value ?? ''} onChange={(event) => onChange(event.target.value)} /></div>;
}
