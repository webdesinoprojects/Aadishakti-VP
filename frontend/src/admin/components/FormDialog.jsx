export default function FormDialog({ open, title, submitText = 'Save', onClose, onSubmit, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="modal" role="dialog" aria-modal="true" aria-labelledby="admin-form-dialog-title" onSubmit={onSubmit}>
        <div className="modal-header"><h2 id="admin-form-dialog-title" className="modal-title">{title}</h2></div>
        <div className="modal-body" style={{ display: 'grid', gap: '14px' }}>{children}</div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary">{submitText}</button>
        </div>
      </form>
    </div>
  );
}
