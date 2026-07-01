import { AppModal } from './AppModal';

export const ConfirmDialog = ({
  isOpen, title, message,
  onConfirm, onCancel,
  confirmText = 'Confirm',
  variant = 'danger'
}) => (
  <AppModal
    isOpen={isOpen}
    title={title}
    onClose={onCancel}
    size="sm"
    footer={
      <>
        <button type="button" className="btn btn-light btn-sm" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className={`btn btn-${variant} btn-sm`}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </>
    }
  >
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div
        style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: variant === 'danger' ? '#FEF2F2' : '#EFF6FF',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        aria-hidden="true"
      >
        <i
          className={`bi ${variant === 'danger' ? 'bi-exclamation-triangle-fill text-danger' : 'bi-question-circle-fill text-primary'}`}
          style={{ fontSize: 18 }}
        />
      </div>
      <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{message}</p>
    </div>
  </AppModal>
);
