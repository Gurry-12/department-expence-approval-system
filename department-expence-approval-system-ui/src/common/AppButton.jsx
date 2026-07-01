export const AppButton = ({
  children,
  variant = 'primary',
  icon,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  size = '',
  title,
  ariaLabel,
}) => (
  <button
    type={type}
    className={`btn btn-${variant}${size ? ` btn-${size}` : ''} fw-medium ${className}`}
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={ariaLabel || title}
    style={{ display: 'inline-flex', alignItems: 'center', gap: icon && children ? 6 : 0 }}
  >
    {icon && <i className={`bi ${icon}`} aria-hidden="true" />}
    {children}
  </button>
);
