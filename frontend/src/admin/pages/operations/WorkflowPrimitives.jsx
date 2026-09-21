import * as Dialog from '@radix-ui/react-dialog';
import { FileSearch, X } from 'lucide-react';
import { titleize } from './workflowFormatters';

export function WorkflowStatus({ status }) {
  return <span className={`workflow-status workflow-status--${status || 'unknown'}`}>{titleize(status)}</span>;
}

export function WorkflowSummary({ icon: Icon, label, value, tone = 'blue' }) {
  return <div className={`workflow-summary workflow-summary--${tone}`}><span><Icon size={20} /></span><div><strong>{value}</strong><small>{label}</small></div></div>;
}

export function WorkflowEmpty({ title = 'No records yet', copy = 'New records will appear here.' }) {
  return <div className="workflow-empty"><FileSearch size={29} /><strong>{title}</strong><span>{copy}</span></div>;
}

export function WorkflowTableCard({ title, description, count, children }) {
  return <section className="workflow-table-card">
    <div className="workflow-table-heading"><div><h2>{title}</h2><p>{description}</p></div><span>{count} total</span></div>
    <div className="responsive-table-shell">{children}</div>
  </section>;
}

export function WorkflowDrawer({ open, onOpenChange, eyebrow, title, subtitle, children, footer, width = '760px' }) {
  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="workflow-drawer-backdrop" />
      <Dialog.Content className="admin-drawer workflow-drawer" style={{ '--workflow-drawer-width': width }}>
        <header><div><span>{eyebrow}</span><Dialog.Title>{title}</Dialog.Title><Dialog.Description>{subtitle || 'Review workflow details.'}</Dialog.Description></div><Dialog.Close aria-label="Close"><X size={21} /></Dialog.Close></header>
        <div className="workflow-drawer-body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

export function WorkflowDialog({ open, onOpenChange, title, description, children, footer }) {
  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="workflow-dialog-overlay" />
      <Dialog.Content className="workflow-dialog-content">
        <header><div><Dialog.Title>{title}</Dialog.Title><Dialog.Description>{description || 'Confirm this workflow action.'}</Dialog.Description></div><Dialog.Close aria-label="Close"><X size={20} /></Dialog.Close></header>
        <div className="workflow-dialog-body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

export function WorkflowMeta({ label, value }) {
  return <div><dt>{label}</dt><dd>{value ?? '—'}</dd></div>;
}

export function DocumentPreview({ media, title = 'Attachment preview' }) {
  const fileName = media?.name || '';
  const isImage = /\.(avif|gif|jpe?g|png|webp)$/i.test(fileName || media?.url || '');
  return <section className="workflow-document-preview"><div><FileSearch size={18} /><strong>{title}</strong></div>{media?.url ? (isImage ? <img src={media.url} alt={fileName || title} /> : <iframe src={media.url} title={fileName || title} />) : <p>No attachment was supplied.</p>}</section>;
}
