export const PageLoader = ({ message = 'Loading...' }) => (
  <div className="d-flex flex-column justify-content-center align-items-center py-5" role="status" aria-label={message}>
    <div
      style={{
        width: 40, height: 40,
        border: '3px solid #E2E8F0',
        borderTop: '3px solid #2563EB',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <span className="mt-3" style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>{message}</span>
  </div>
);
