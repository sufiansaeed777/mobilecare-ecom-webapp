// src/pages/admin/components/AdminLayout.js
import React from 'react';
import AdminSidebar from './AdminSidebar';

function AdminLayout({ children, activeItem }) {
  const styles = {
    layout: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f0f4f8',
      position: 'relative'
    },
    contentWrapper: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    },
    adminContent: {
      flex: 1,
      padding: '2rem',
      backgroundColor: '#f0f4f8',
      transition: 'margin-left 0.3s ease',
      marginLeft: '260px', // Default when sidebar is open
    },
    // Media queries for responsiveness
    '@media (max-width: 768px)': {
      adminContent: {
        marginLeft: '70px',
        padding: '1rem'
      }
    }
  };

  return (
    <div style={styles.layout}>
      <AdminSidebar activeItem={activeItem} />
      <div style={styles.contentWrapper}>
        {/* Navbar will be rendered by the parent App component */}
        <div className="admin-content" style={styles.adminContent}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;