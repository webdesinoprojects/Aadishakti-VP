import { useEffect } from 'react';
import { Inbox, X } from 'lucide-react';

export function CustomerWorkflowEmpty({ title, copy }) {
  return <div className="customer-workflow-empty"><Inbox size={29} /><strong>{title}</strong><span>{copy}</span></div>;
}

export function CustomerWorkflowStat({ icon: Icon, value, label, tone = 'blue' }) {
  return <div className={`customer-workflow-stat is-${tone}`}><span><Icon size={20} /></span><div><strong>{value}</strong><small>{label}</small></div></div>;
}

export function CustomerWorkflowDrawer({ open, onClose, eyebrow, title, subtitle, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', closeOnEscape); };
  }, [open, onClose]);
  if (!open) return null;

  return <div className="customer-workflow-drawer-layer" role="presentation">
    <button className="customer-workflow-backdrop" type="button" aria-label="Close details" onClick={onClose} />
    <aside className="customer-workflow-drawer" role="dialog" aria-modal="true">
      <header><div><span>{eyebrow}</span><h2>{title}</h2><p>{subtitle}</p></div><button type="button" onClick={onClose} aria-label="Close"><X size={21} /></button></header>
      <div className="customer-workflow-drawer-body">{children}</div>
      {footer && <footer>{footer}</footer>}
    </aside>
  </div>;
}
