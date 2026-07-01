export const AppModal = ({ isOpen, title, children, onClose, footer }) => {
  if (!isOpen) return null;
  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg" style={{ transition: 'all 0.3s ease' }}>
        <div className="modal-content glass-card border-0 shadow-lg">
          <div className="modal-header bg-transparent border-bottom-0 pb-3 pt-4 px-4">
            <h5 className="modal-title fw-bold text-dark">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            {children}
          </div>
          {footer && (
            <div className="modal-footer border-top-0 pt-0 px-4 pb-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
