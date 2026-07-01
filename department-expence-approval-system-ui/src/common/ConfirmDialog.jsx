export const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", variant = "primary" }) => {
  if (!isOpen) return null;
  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom-0 pb-0">
            <h5 className="modal-title fw-bold">{title}</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body py-4">
            <p className="mb-0 text-secondary">{message}</p>
          </div>
          <div className="modal-footer border-top-0 pt-0">
            <button type="button" className="btn btn-light" onClick={onCancel}>Cancel</button>
            <button type="button" className={`btn btn-${variant}`} onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
