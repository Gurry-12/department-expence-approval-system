import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="d-flex flex-grow-1 overflow-hidden">
        <div className="d-none d-md-block">
            <Sidebar isOpen={isSidebarOpen} />
        </div>
        
        <main className="flex-grow-1 p-4 overflow-auto w-100" style={{ maxHeight: 'calc(100vh - 72px)' }}>
          <div className="container-fluid max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
