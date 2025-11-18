// src/pages/admin/components/AdminSidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaMobileAlt, FaWrench, FaSignOutAlt, FaEye, FaShieldAlt,
  FaBars, FaTimes, FaShoppingCart, FaChartLine
} from 'react-icons/fa';

const SIDEBAR_WIDTH_OPEN = '260px';
const SIDEBAR_WIDTH_COLLAPSED = '70px';

function AdminSidebar({ activeItem }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Update CSS variable for content margin
    const updateContentMargin = () => {
      const adminContent = document.querySelector('.admin-content');
      if (adminContent) {
        adminContent.style.marginLeft = isSidebarOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_COLLAPSED;
        adminContent.style.transition = 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    };
    
    // Add admin-page class to body when on admin pages
    document.body.classList.add('admin-page');
    
    updateContentMargin();
    
    return () => {
      const adminContent = document.querySelector('.admin-content');
      if (adminContent) {
        adminContent.style.marginLeft = '0';
      }
      // Remove admin-page class when leaving admin pages
      document.body.classList.remove('admin-page');
    };
  }, [isSidebarOpen]);
  

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const currentWidth = isSidebarOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_COLLAPSED;

  const styles = {
    sidebar: {
      width: currentWidth,
      backgroundColor: '#0f172a', 
      color: '#e2e8f0',          
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed', 
      top: 0,
      left: 0,
      boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      zIndex: 40, // Reduced from 1050
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    },
    headerContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: isSidebarOpen ? 'space-between' : 'center',
      padding: '1.75rem 1.25rem', 
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      minHeight: '80px',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.875rem',
    },
    logoIcon: {
      fontSize: '1.875rem',
      color: '#3b82f6', 
      flexShrink: 0,
      filter: 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.4))',
      transition: 'transform 0.3s ease',
    },
    logoText: {
      fontSize: '1.375rem', 
      fontWeight: '700',
      color: '#f8fafc', 
      margin: 0,
      whiteSpace: 'nowrap',
      opacity: isSidebarOpen ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out',
      overflow: 'hidden',
      letterSpacing: '-0.025em',
    },
    toggleButton: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#e2e8f0',
      fontSize: '1.25rem',
      cursor: 'pointer',
      padding: '0.625rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '0.5rem',
      transition: 'all 0.2s ease',
      backdropFilter: 'blur(10px)',
    },
    nav: {
      flexGrow: 1,
      paddingTop: '1.5rem',
      paddingBottom: '1rem',
      overflowY: 'auto', 
      overflowX: 'hidden',
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent',
    },
    navList: { listStyle: 'none', padding: 0, margin: 0 },
    navItem: { 
      marginBottom: '0.25rem',
      padding: '0 0.75rem',
    },
    navLinkBase: { 
      display: 'flex',
      alignItems: 'center',
      padding: '0.875rem 1rem',
      justifyContent: isSidebarOpen ? 'flex-start' : 'center',
      color: '#94a3b8', 
      textDecoration: 'none',
      fontSize: '0.9375rem', 
      fontWeight: '500',
      borderRadius: '0.625rem',
      transition: 'all 0.2s ease',
      position: 'relative',
      overflow: 'hidden',
      gap: isSidebarOpen ? '0.875rem' : '0',
    },
    navLinkActive: { 
      color: '#ffffff', 
      fontWeight: '600',
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.3)',
    },
    navLinkIcon: {
      fontSize: '1.25rem',
      width: '24px',
      minWidth: '24px',
      textAlign: 'center',
      color: 'inherit', 
      flexShrink: 0,
      transition: 'transform 0.2s ease',
    },
    navLinkText: {
      opacity: isSidebarOpen ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out',
      pointerEvents: isSidebarOpen ? 'auto' : 'none',
      whiteSpace: 'nowrap',
    },
    navTooltip: {
      position: 'absolute',
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginLeft: '0.75rem',
      padding: '0.5rem 0.75rem',
      backgroundColor: '#1e293b',
      color: '#f8fafc',
      fontSize: '0.875rem',
      fontWeight: '500',
      borderRadius: '0.375rem',
      whiteSpace: 'nowrap',
      opacity: 0,
      pointerEvents: 'none',
      transition: 'opacity 0.2s ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      zIndex: 1100,
    },
    footer: {
      padding: '1.25rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem', 
      marginTop: 'auto',
      background: 'rgba(0, 0, 0, 0.2)',
    },
    footerButtonBase: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: isSidebarOpen ? 'center' : 'center',
      gap: '0.625rem',
      width: '100%',
      padding: '0.75rem',
      border: '1px solid rgba(255, 255, 255, 0.2)', 
      borderRadius: '0.5rem',
      backgroundColor: 'transparent',
      color: '#e2e8f0',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
      textAlign: 'center',
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',
      backdropFilter: 'blur(10px)',
    },
    footerButtonText: {
        opacity: isSidebarOpen ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        pointerEvents: isSidebarOpen ? 'auto' : 'none',
    },
    divider: {
      height: '1px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      margin: '1rem 1.5rem',
    },
    sectionTitle: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      padding: '0 1.5rem',
      marginBottom: '0.5rem',
      opacity: isSidebarOpen ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out',
    }
  };
  
  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt, key: 'dashboard' },
    { name: 'Manage Devices', path: '/admin/devices', icon: FaMobileAlt, key: 'devices' },
    { name: 'Manage Repairs', path: '/admin/repairs', icon: FaWrench, key: 'repairs' },
    { name: 'Manage Products', path: '/admin/products', icon: FaShoppingCart, key: 'products' },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.headerContainer}>
        <div style={styles.logoContainer}>
          <FaShieldAlt 
            style={styles.logoIcon} 
            onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(360deg)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
          />
          {isSidebarOpen && <h2 style={styles.logoText}>Admin Panel</h2>}
        </div>
        {isSidebarOpen && (
          <button 
            style={styles.toggleButton} 
            onClick={toggleSidebar}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <FaTimes /> 
          </button>
        )}
      </div>
      {!isSidebarOpen && (
        <div style={{display: 'flex', justifyContent: 'center', padding: '1rem 0'}}>
          <button 
            style={{...styles.toggleButton, padding: '0.75rem'}} 
            onClick={toggleSidebar}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
            aria-label="Expand sidebar"
          >
            <FaBars />
          </button>
        </div>
      )}
      
      <nav style={styles.nav}>
        <div style={styles.sectionTitle}>MAIN</div>
        <ul style={styles.navList}>
          {navLinks.slice(0, 2).map(item => {
            const isActive = activeItem === item.key;
            let linkStyle = {
              ...styles.navLinkBase,
              ...(isActive ? styles.navLinkActive : {}),
            };

            return (
              <li key={item.key} style={styles.navItem}>
                <Link 
                  to={item.path} 
                  style={linkStyle}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = '#ffffff';
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.transform = 'scale(1.1)';
                      
                      // Show tooltip if sidebar is collapsed
                      if (!isSidebarOpen) {
                        const tooltip = e.currentTarget.querySelector('.tooltip');
                        if (tooltip) tooltip.style.opacity = '1';
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = styles.navLinkBase.color;
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.transform = 'scale(1)';
                      
                      // Hide tooltip
                      const tooltip = e.currentTarget.querySelector('.tooltip');
                      if (tooltip) tooltip.style.opacity = '0';
                    }
                  }}
                >
                  <item.icon style={styles.navLinkIcon} />
                  <span style={styles.navLinkText}>{item.name}</span>
                  {!isSidebarOpen && (
                    <span className="tooltip" style={styles.navTooltip}>{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        
        <div style={styles.divider}></div>
        <div style={styles.sectionTitle}>MANAGEMENT</div>
        <ul style={styles.navList}>
          {navLinks.slice(2).map(item => {
            const isActive = activeItem === item.key;
            let linkStyle = {
              ...styles.navLinkBase,
              ...(isActive ? styles.navLinkActive : {}),
            };

            return (
              <li key={item.key} style={styles.navItem}>
                <Link 
                  to={item.path} 
                  style={linkStyle}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = '#ffffff';
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.transform = 'scale(1.1)';
                      
                      // Show tooltip if sidebar is collapsed
                      if (!isSidebarOpen) {
                        const tooltip = e.currentTarget.querySelector('.tooltip');
                        if (tooltip) tooltip.style.opacity = '1';
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = styles.navLinkBase.color;
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.transform = 'scale(1)';
                      
                      // Hide tooltip
                      const tooltip = e.currentTarget.querySelector('.tooltip');
                      if (tooltip) tooltip.style.opacity = '0';
                    }
                  }}
                >
                  <item.icon style={styles.navLinkIcon} />
                  <span style={styles.navLinkText}>{item.name}</span>
                  {!isSidebarOpen && (
                    <span className="tooltip" style={styles.navTooltip}>{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div style={styles.footer}>
        <button 
          onClick={handleLogout} 
          style={styles.footerButtonBase}
          title={isSidebarOpen ? "" : "Logout"}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            e.currentTarget.style.color = '#fca5a5';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; 
            e.currentTarget.style.color = styles.footerButtonBase.color;
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <FaSignOutAlt />
          <span style={styles.footerButtonText}>Logout</span>
        </button>
        <Link 
          to="/" 
          target="_blank" rel="noopener noreferrer"
          style={styles.footerButtonBase}
          title={isSidebarOpen ? "" : "View Website"}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
            e.currentTarget.style.color = '#93c5fd';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; 
            e.currentTarget.style.color = styles.footerButtonBase.color;
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <FaEye />
          <span style={styles.footerButtonText}>View Website</span>
        </Link>
      </div>
    </div>
  );
}

export default AdminSidebar;