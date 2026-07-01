import { useEffect, useRef } from 'react';

export const AppModal = ({ isOpen, title, children, onClose, footer, size = '' }) => {
  const modalRef = useRef(null);
  const titleId = `modal-title-${Math.random().toString(36).slice(2, 7)}`;

  // Focus trap and scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement;
    // Lock scroll
    document.body.style.overflow = 'hidden';
    // Focus modal
    const timer = setTimeout(() => modalRef.current?.focus(), 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="ef-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-hidden="false"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`ef-modal-dialog${size ? ` modal-${size}` : ''}`}
        tabIndex={-1}
        style={{ outline: 'none' }}
      >
        <div className="ef-modal-content">
          {/* Header */}
          <div className="ef-modal-header">
            <h2 id={titleId} className="ef-modal-title">{title}</h2>
            <button
              type="button"
              className="ef-modal-close"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <i className="bi bi-x-lg" style={{ fontSize: 14 }} aria-hidden="true" />
            </button>
          </div>

          {/* Body */}
          <div className="ef-modal-body">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="ef-modal-footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
