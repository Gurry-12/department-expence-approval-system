export const Footer = () => (
  <footer className="ef-footer">
    <span>© {new Date().getFullYear()} ExpenseFlow. All rights reserved.</span>
    <div style={{ display: 'flex', gap: 16 }}>
      <span style={{ cursor: 'default' }}>Privacy Policy</span>
      <span style={{ cursor: 'default' }}>Terms of Service</span>
    </div>
  </footer>
);
