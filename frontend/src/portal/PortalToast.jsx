import { useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function PortalToast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(onDismiss, 4500);
    return () => window.clearTimeout(timeout);
  }, [toast, onDismiss]);

  if (!toast) return null;
  const Icon = toast.type === 'error' ? AlertCircle : CheckCircle2;

  return (
    <div className={`portal-toast portal-toast--${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'}>
      <Icon size={20} aria-hidden="true" />
      <div><strong>{toast.type === 'error' ? 'Upload failed' : 'Upload complete'}</strong><span>{toast.message}</span></div>
      <button type="button" onClick={onDismiss} aria-label="Dismiss notification"><X size={17} /></button>
    </div>
  );
}
