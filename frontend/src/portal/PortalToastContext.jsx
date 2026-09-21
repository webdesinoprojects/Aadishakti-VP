/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import './portal-toast.css';

const PortalToastContext = createContext(null);

export const usePortalToast = () => {
  const context = useContext(PortalToastContext);
  if (!context) throw new Error('usePortalToast must be used within PortalToastProvider');
  return context;
};

export function PortalToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);
  const remove = useCallback((id) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);
  const show = useCallback((message, type = 'info') => {
    nextId.current += 1;
    const id = nextId.current;
    setToasts((current) => [...current.slice(-2), { id, message, type }]);
    window.setTimeout(() => remove(id), 4000);
  }, [remove]);
  const value = useMemo(() => ({
    success: (message) => show(message, 'success'),
    error: (message) => show(message, 'error'),
    warning: (message) => show(message, 'warning'),
    info: (message) => show(message, 'info'),
  }), [show]);
  const icons = { success: CheckCircle2, error: XCircle, warning: AlertTriangle, info: Info };

  return <PortalToastContext.Provider value={value}>
    {children}
    <div className="portal-toast-region" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return <div className={`portal-toast is-${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'} key={toast.id}>
          <Icon size={20} /><span>{toast.message}</span>
          <button type="button" onClick={() => remove(toast.id)} aria-label="Dismiss notification"><X size={16} /></button>
        </div>;
      })}
    </div>
  </PortalToastContext.Provider>;
}
