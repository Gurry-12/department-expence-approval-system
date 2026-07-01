export const AppButton = ({ children, variant = 'primary', icon, onClick, disabled = false, type = 'button', className = '' }) => (
  <button 
    type={type} 
    className={`btn btn-${variant} px-4 py-2 fw-medium ${className}`} 
    onClick={onClick} 
    disabled={disabled}
  >
    {icon && <i className={`bi ${icon} me-2`}></i>}
    {children}
  </button>
);
