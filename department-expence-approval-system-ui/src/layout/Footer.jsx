export const Footer = () => (
  <footer className="bg-white border-top py-3 mt-auto">
    <div className="container-fluid px-4">
      <div className="d-flex align-items-center justify-content-between small">
        <div className="text-muted">Copyright &copy; ExpenseFlow {new Date().getFullYear()}</div>
        <div>
          <span className="text-muted text-decoration-none">Privacy Policy</span>
          &middot;
          <span className="text-muted text-decoration-none ms-2">Terms &amp; Conditions</span>
        </div>
      </div>
    </div>
  </footer>
);
