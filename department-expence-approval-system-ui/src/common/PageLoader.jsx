import { ClipLoader } from 'react-spinners';

export const PageLoader = ({ message = "Loading..." }) => (
  <div className="d-flex flex-column justify-content-center align-items-center py-5">
    <ClipLoader color="#0d6efd" size={40} />
    <span className="mt-3 text-muted">{message}</span>
  </div>
);
