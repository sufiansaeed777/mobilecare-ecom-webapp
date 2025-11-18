import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function PublicLayout() {
  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-fill">
        {/* Public pages like Home, About, etc., will be rendered here */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;