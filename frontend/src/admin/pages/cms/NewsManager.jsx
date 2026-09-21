import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import {
  CalendarDays,
  Edit2,
  FileText,
  Newspaper,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import TopBar from '../../components/TopBar';
import ConfirmModal from '../../components/ConfirmModal';
import ImageUploader from '../../components/ImageUploader';
import { cmsAPI } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import './news-manager.css';

const createEmptyForm = () => ({
  title: '',
  category: 'news',
  publishDate: new Date().toISOString().slice(0, 10),
  content: '',
  featuredImage: '',
  status: 'Published',
});

const stripMarkup = (value = '') => String(value)
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;/gi, "'")
  .replace(/\s+/g, ' ')
  .trim();

const formatPublishDate = (value) => {
  if (!value) return 'Not scheduled';
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const normalizeCategory = (value) => String(value || 'news').trim().toLowerCase();
const normalizeStatus = (value) => String(value || 'published').trim().toLowerCase();

export default function NewsManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(createEmptyForm);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState(null);
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('all');
  const { success, error } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await cmsAPI.getNews();
      setItems(response.data || []);
    } catch (loadError) {
      console.error('Failed to load media articles:', loadError);
      error('Failed to load media articles.');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => { load(); }, [load]);

  const counts = useMemo(() => items.reduce((result, item) => {
    const category = normalizeCategory(item.category);
    result.all += 1;
    if (category === 'blogs' || category === 'blog') result.blogs += 1;
    if (category === 'news') result.news += 1;
    return result;
  }, { all: 0, blogs: 0, news: 0 }), [items]);

  const visibleItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      const category = normalizeCategory(item.category);
      const matchesType = activeType === 'all'
        || (activeType === 'blogs' && ['blog', 'blogs'].includes(category))
        || category === activeType;
      const matchesQuery = !needle || [item.title, item.content, item.category]
        .some((value) => stripMarkup(value).toLowerCase().includes(needle));
      return matchesType && matchesQuery;
    });
  }, [activeType, items, query]);

  const startCreate = () => {
    setForm(createEmptyForm());
    setEditingId(null);
    setOpen(true);
  };

  const startEdit = (item) => {
    const itemCategory = normalizeCategory(item.category);
    setForm({
      title: item.title || '',
      category: itemCategory === 'blog' ? 'blogs' : itemCategory,
      publishDate: item.publishDate ? String(item.publishDate).slice(0, 10) : '',
      content: item.content || '',
      featuredImage: item.featuredImage || '',
      status: normalizeStatus(item.status) === 'published'
        ? 'Published'
        : item.status || 'Published',
    });
    setEditingId(item.id);
    setOpen(true);
  };

  const closeEditor = () => {
    if (saving) return;
    setOpen(false);
    setEditingId(null);
    setForm(createEmptyForm());
  };

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) closeEditor();
  };

  const save = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      error('Title and article content are required.');
      return;
    }
    setSaving(true);
    try {
      const response = editingId
        ? await cmsAPI.updateNews(editingId, form)
        : await cmsAPI.createNews(form);
      setItems((current) => editingId
        ? current.map((item) => item.id === editingId ? response.data : item)
        : [response.data, ...current]);
      success(editingId ? 'Article updated.' : 'Article published.');
      setOpen(false);
      setEditingId(null);
      setForm(createEmptyForm());
    } catch (saveError) {
      console.error('Failed to save media article:', saveError);
      error('Failed to save media article.');
    } finally {
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
      <main className="admin-content news-manager">
        <header className="news-page-header">
          <div>
            <div className="news-page-eyebrow"><Newspaper size={15} /> Public content</div>
            <h1>Blogs &amp; News</h1>
            <p>Manage the stories published on the public Media page.</p>
          </div>
          <button className="btn btn-primary news-create-button" type="button" onClick={startCreate}>
            <Plus size={18} /> New article
          </button>
        </header>

        <Tabs.Root className="news-workspace" value={activeType} onValueChange={setActiveType}>
          <div className="news-toolbar">
            <Tabs.List className="news-tabs" aria-label="Filter media articles">
              <Tabs.Trigger className="news-tab" value="all">All <span>{counts.all}</span></Tabs.Trigger>
              <Tabs.Trigger className="news-tab" value="blogs">Blogs <span>{counts.blogs}</span></Tabs.Trigger>
              <Tabs.Trigger className="news-tab" value="news">News <span>{counts.news}</span></Tabs.Trigger>
            </Tabs.List>
            <label className="news-search">
              <Search size={18} aria-hidden="true" />
              <span className="sr-only">Search articles</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title or content"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                  <X size={15} />
                </button>
              )}
            </label>
          </div>

          <Tabs.Content className="news-tab-content" value={activeType}>
            <div className="news-list-heading">
              <div>
                <h2>{activeType === 'all' ? 'All articles' : activeType === 'blogs' ? 'Blog posts' : 'News updates'}</h2>
                <p>{visibleItems.length} {visibleItems.length === 1 ? 'record' : 'records'}</p>
              </div>
            </div>

            {loading ? (
              <div className="news-empty-state" role="status">
                <div className="news-skeleton" />
                <div className="news-skeleton" />
                <div className="news-skeleton" />
              </div>
            ) : visibleItems.length ? (
              <div className="news-table-shell">
                <table className="news-table">
                  <thead>
                    <tr>
                      <th>Article</th>
                      <th>Type</th>
                      <th>Published</th>
                      <th>Status</th>
                      <th><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleItems.map((item) => (
                      <ArticleRow
                        key={item.id}
                        item={item}
                        onEdit={() => startEdit(item)}
                        onDelete={() => setDeleteItem(item)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="news-empty-state">
                <span className="news-empty-icon"><FileText size={24} /></span>
                <h3>{query ? 'No matching articles' : 'No articles in this section'}</h3>
                <p>{query ? 'Try a different search term or clear the search.' : 'Create an article to publish it on the Media page.'}</p>
                {!query && <button type="button" className="btn btn-primary" onClick={startCreate}><Plus size={16} /> New article</button>}
              </div>
            )}
          </Tabs.Content>
        </Tabs.Root>
      </main>

      <ArticleDialog
        open={open}
        form={form}
        setForm={setForm}
        editing={Boolean(editingId)}
        saving={saving}
        onOpenChange={handleOpenChange}
        onClose={closeEditor}
        onSave={save}
      />
      <ConfirmModal
        isOpen={Boolean(deleteItem)}
        onClose={() => setDeleteItem(null)}
        onConfirm={remove}
        title="Delete article"
        message={`Delete “${deleteItem?.title || 'this article'}” permanently?`}
        confirmText="Delete"
        type="danger"
      />
    </>
  );
}

function ArticleRow({ item, onEdit, onDelete }) {
  const category = normalizeCategory(item.category);
  const categoryLabel = category === 'blogs' || category === 'blog' ? 'Blog' : category || 'News';
  const status = normalizeStatus(item.status);
  const excerpt = stripMarkup(item.content) || 'No article excerpt available.';

  return (
    <tr>
      <td data-label="Article">
        <div className="news-article-cell">
          {item.featuredImage ? (
            <img src={item.featuredImage} alt="" loading="lazy" />
          ) : (
            <span className="news-image-placeholder"><Newspaper size={22} /></span>
          )}
          <div className="news-article-copy">
            <strong>{stripMarkup(item.title)}</strong>
            <p>{excerpt}</p>
          </div>
        </div>
      </td>
      <td data-label="Type"><span className={`news-type-badge news-type-${categoryLabel.toLowerCase()}`}>{categoryLabel}</span></td>
      <td data-label="Published">
        <span className="news-date"><CalendarDays size={15} /> {formatPublishDate(item.publishDate)}</span>
      </td>
      <td data-label="Status"><span className={`news-status news-status-${status}`}>{status}</span></td>
      <td data-label="Actions">
        <div className="news-row-actions">
          <button className="news-action-button" type="button" onClick={onEdit} aria-label={`Edit ${item.title}`}>
            <Edit2 size={16} /> <span>Edit</span>
          </button>
          <button className="news-action-button news-action-delete" type="button" onClick={onDelete} aria-label={`Delete ${item.title}`}>
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ArticleDialog({ open, form, setForm, editing, saving, onOpenChange, onClose, onSave }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="news-dialog-overlay" />
        <Dialog.Content className="news-dialog-content" onEscapeKeyDown={(event) => saving && event.preventDefault()}>
          <header className="news-dialog-header">
            <div>
              <span>{editing ? 'Update content' : 'Create content'}</span>
              <Dialog.Title>{editing ? 'Edit article' : 'New article'}</Dialog.Title>
              <Dialog.Description>Content saved here appears on the public Media page.</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="news-dialog-close" type="button" disabled={saving} aria-label="Close article editor">
                <X size={20} />
              </button>
            </Dialog.Close>
          </header>

          <form className="news-dialog-form" onSubmit={onSave}>
            <div className="news-dialog-body">
              <div className="form-group">
                <label className="form-label required" htmlFor="article-title">Title</label>
                <input id="article-title" className="form-input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} autoFocus />
              </div>
              <div className="admin-form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="article-type">Type</label>
                  <select id="article-type" className="form-select" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                    <option value="blogs">Blog</option>
                    <option value="news">News</option>
                    <option value="award">Award</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="article-date">Publish date</label>
                  <input id="article-date" className="form-input" type="date" value={form.publishDate} onChange={(event) => setForm({ ...form, publishDate: event.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Featured image</label>
                <ImageUploader currentImage={form.featuredImage} onUpload={(url) => setForm({ ...form, featuredImage: url })} onRemove={() => setForm({ ...form, featuredImage: '' })} />
              </div>
              <div className="form-group">
                <label className="form-label required" htmlFor="article-content">Article content</label>
                <textarea id="article-content" className="form-textarea news-content-editor" rows={12} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} />
                <p className="form-help">Use clear paragraphs; the article card automatically creates a plain-text preview.</p>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="article-status">Status</label>
                <select id="article-status" className="form-select" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
            <footer className="news-dialog-footer">
              <button className="btn btn-secondary" type="button" onClick={onClose} disabled={saving}>Cancel</button>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving…' : editing ? 'Save changes' : 'Publish article'}
              </button>
            </footer>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
