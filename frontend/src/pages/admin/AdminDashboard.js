// src/pages/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import { 
    FaMobileAlt, FaWrench, FaTags, FaBoxOpen, FaArrowRight, 
    FaCog, FaUserShield, FaBell, FaChartLine, FaShoppingCart,
    FaUsers, FaClock, FaCheckCircle, FaExclamationTriangle,
    FaArrowUp, FaArrowDown, FaEye, FaFire, FaDollarSign,
    FaChartBar, FaChartPie, FaCalendarAlt
} from 'react-icons/fa';

function AdminDashboard() {
  const [stats, setStats] = useState({
    deviceCount: 0,
    repairCount: 0,
    categoryCount: 0,
    brandCount: 0,
    productCount: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    specialOffersCount: 0,
    totalRevenue: 0,
    devicesByType: {},
    productsByCategory: {}
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      // Fetch all data in parallel
      const [devicesRes, productsRes, statsRes] = await Promise.all([
        fetch('/api/admin/devices', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/products/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => null)
      ]);

      if (devicesRes.status === 401 || productsRes.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }

      const devices = await devicesRes.json();
      const products = await productsRes.json();
      const productStats = statsRes ? await statsRes.json() : null;

      // Calculate device statistics
      const devicesByType = devices.reduce((acc, device) => {
        acc[device.type] = (acc[device.type] || 0) + 1;
        return acc;
      }, {});

      const brands = new Set(devices.map(d => d.brand).filter(Boolean));
      const categories = new Set(devices.map(d => d.type).filter(Boolean));
      
      let totalRepairs = 0;
      devices.forEach(device => {
        totalRepairs += (device.repairs?.length || 0);
      });

      // Calculate product statistics
      const productsByCategory = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {});

      const lowStockProducts = products.filter(p => 
        p.stockStatus === 'Low Stock' || p.quantity <= 5
      );
      
      const outOfStockProducts = products.filter(p => 
        p.stockStatus === 'Out of Stock' || p.quantity === 0
      );
      
      const specialOffers = products.filter(p => p.isSpecialOffer);
      
      // Calculate total potential revenue
      const totalRevenue = products.reduce((sum, product) => {
        return sum + (product.price * product.quantity);
      }, 0);

      // Get recent products
      const recentProds = [...products]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecentProducts(recentProds);
      setLowStockProducts(lowStockProducts.slice(0, 5));

      // Generate recent activity
      const activities = [];
      
      // Add recent products as activities
      recentProds.slice(0, 3).forEach(product => {
        const timeAgo = getTimeAgo(new Date(product.createdAt));
        activities.push({
          id: `product-${product._id}`,
          action: 'New product added',
          item: product.name,
          time: timeAgo,
          type: 'product'
        });
      });

      // Add low stock alerts
      lowStockProducts.slice(0, 2).forEach(product => {
        activities.push({
          id: `alert-${product._id}`,
          action: 'Low stock alert',
          item: product.name,
          time: 'Recently',
          type: 'alert'
        });
      });

      setRecentActivity(activities.slice(0, 5));

      setStats({
        deviceCount: devices.length,
        repairCount: totalRepairs,
        categoryCount: categories.size,
        brandCount: brands.size,
        productCount: products.length,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
        specialOffersCount: specialOffers.length,
        totalRevenue: totalRevenue,
        devicesByType: devicesByType,
        productsByCategory: productsByCategory
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'product': return <FaShoppingCart style={{ color: '#10b981' }} />;
      case 'repair': return <FaWrench style={{ color: '#3b82f6' }} />;
      case 'alert': return <FaExclamationTriangle style={{ color: '#f59e0b' }} />;
      case 'device': return <FaMobileAlt style={{ color: '#6366f1' }} />;
      default: return <FaCheckCircle style={{ color: '#6b7280' }} />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    header: { 
      marginBottom: '2rem' 
    },
    headerTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    title: { 
      fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
      fontWeight: '700', 
      color: '#1e293b',
      margin: 0 
    },
    subtitle: {
      color: '#64748b',
      fontSize: 'clamp(0.875rem, 2vw, 1.1rem)'
    },
    dateTime: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#64748b',
      fontSize: 'clamp(0.75rem, 1.5vw, 0.95rem)'
    },
    alert: { 
      padding: '1rem', 
      borderRadius: '0.75rem', 
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    errorAlert: { 
      backgroundColor: '#fee2e2', 
      color: '#dc2626', 
      border: '1px solid #fecaca' 
    },
    loadingState: { 
      textAlign: 'center', 
      padding: '4rem 2rem', 
      color: '#64748b', 
      fontSize: '1.2rem' 
    },
    statsGrid: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', 
      gap: 'clamp(0.75rem, 2vw, 1.5rem)', 
      marginBottom: '2rem' 
    },
    statCard: { 
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      padding: 'clamp(1rem, 3vw, 1.75rem)', 
      borderRadius: '1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: '1px solid rgba(30, 58, 138, 0.1)'
    },
    statCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
    },
    statIcon: {
      position: 'absolute',
      top: 'clamp(1rem, 2vw, 1.5rem)',
      right: 'clamp(1rem, 2vw, 1.5rem)',
      fontSize: 'clamp(2rem, 4vw, 2.5rem)',
      opacity: 0.1
    },
    statNumber: { 
      fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', 
      fontWeight: '700', 
      color: '#1e293b',
      marginBottom: '0.25rem',
      lineHeight: 1
    },
    statLabel: { 
      fontSize: 'clamp(0.75rem, 1.5vw, 0.95rem)', 
      color: '#64748b',
      fontWeight: '500'
    },
    statChange: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
      marginTop: '0.5rem',
      fontWeight: '500',
      flexWrap: 'wrap'
    },
    statChangeUp: { color: '#10b981' },
    statChangeDown: { color: '#ef4444' },
    mainGrid: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
      gap: 'clamp(1rem, 3vw, 2rem)',
      marginTop: '2rem'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      border: '1px solid rgba(30, 58, 138, 0.05)'
    },
    cardHeader: {
      padding: 'clamp(1rem, 2vw, 1.5rem)',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'linear-gradient(to right, #f8fafc, #ffffff)',
      flexWrap: 'wrap',
      gap: '0.5rem'
    },
    cardTitle: {
      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    cardContent: {
      padding: 'clamp(1rem, 2vw, 1.5rem)'
    },
    quickActionsGrid: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', 
      gap: '1rem' 
    },
    actionCard: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      padding: 'clamp(1rem, 2vw, 1.5rem)',
      borderRadius: '0.75rem',
      border: '1px solid #e2e8f0',
      textAlign: 'center',
      textDecoration: 'none',
      color: '#374151',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem',
      position: 'relative',
      overflow: 'hidden'
    },
    actionIcon: { 
      fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
      marginBottom: '0.5rem' 
    },
    actionLabel: { 
      fontWeight: '600', 
      fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
      color: '#1e293b'
    },
    actionDescription: {
      fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)',
      color: '#64748b'
    },
    tableWrapper: {
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch'
    },
    table: { 
      width: '100%', 
      borderCollapse: 'collapse',
      minWidth: '400px'
    },
    th: { 
      padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1rem)', 
      textAlign: 'left', 
      backgroundColor: '#f8fafc', 
      color: '#475569', 
      fontWeight: '600', 
      fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)',
      borderBottom: '1px solid #e2e8f0',
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
      whiteSpace: 'nowrap'
    },
    td: { 
      padding: 'clamp(0.75rem, 2vw, 1rem)', 
      borderBottom: '1px solid #f1f5f9', 
      fontSize: 'clamp(0.8rem, 1.4vw, 0.9rem)', 
      color: '#374151' 
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: 'clamp(0.7rem, 1.2vw, 0.75rem)',
      fontWeight: '500'
    },
    badgeBlue: { backgroundColor: '#dbeafe', color: '#1e40af' },
    badgeGreen: { backgroundColor: '#d1fae5', color: '#065f46' },
    badgeYellow: { backgroundColor: '#fed7aa', color: '#9a3412' },
    linkButton: {
      color: '#3b82f6',
      textDecoration: 'none',
      fontWeight: '500',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)',
      transition: 'color 0.2s'
    },
    viewAllButton: {
      color: '#3b82f6',
      textDecoration: 'none',
      fontSize: 'clamp(0.8rem, 1.4vw, 0.9rem)',
      fontWeight: '500',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    activityItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      padding: 'clamp(0.75rem, 2vw, 1rem) 0',
      borderBottom: '1px solid #f1f5f9'
    },
    activityIcon: {
      width: 'clamp(32px, 5vw, 40px)',
      height: 'clamp(32px, 5vw, 40px)',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f1f5f9',
      flexShrink: 0
    },
    activityContent: {
      flex: 1,
      minWidth: 0
    },
    activityAction: {
      fontWeight: '500',
      color: '#1e293b',
      marginBottom: '0.25rem',
      fontSize: 'clamp(0.8rem, 1.4vw, 0.9rem)'
    },
    activityItemText: {
      color: '#64748b',
      fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)',
      wordBreak: 'break-word'
    },
    activityTime: {
      color: '#94a3b8',
      fontSize: 'clamp(0.7rem, 1.1vw, 0.8rem)'
    },
    emptyState: {
      textAlign: 'center',
      padding: 'clamp(2rem, 4vw, 3rem)',
      color: '#94a3b8'
    },
    miniChart: {
      height: '60px',
      marginTop: '1rem',
      background: 'linear-gradient(to right, #3b82f6 0%, #60a5fa 100%)',
      borderRadius: '0.5rem',
      position: 'relative',
      overflow: 'hidden'
    },
    chartContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem',
      minHeight: '200px'
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)',
      color: '#64748b'
    },
    legendDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: '#3b82f6'
    },
    progressBar: {
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '0.25rem'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#3b82f6',
      borderRadius: '4px',
      transition: 'width 0.5s ease'
    }
  };

  const quickActions = [
    { 
      to: '/admin/devices', 
      label: 'Manage Devices', 
      icon: FaMobileAlt,
      color: '#3b82f6',
      description: 'Add or edit devices'
    },
    { 
      to: '/admin/repairs', 
      label: 'Manage Repairs', 
      icon: FaWrench,
      color: '#10b981',
      description: 'Update repair services'
    },
    { 
      to: '/admin/products', 
      label: 'Manage Products', 
      icon: FaShoppingCart,
      color: '#f59e0b',
      description: 'Product inventory'
    }
  ];

  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <AdminLayout activeItem="dashboard">
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <div>
              <h1 style={styles.title}>Dashboard Overview</h1>
              <p style={styles.subtitle}>Welcome back to Mobile Care Admin</p>
            </div>
            <div style={styles.dateTime}>
              <FaClock />
              <span>{currentDate}</span>
            </div>
          </div>
        </div>
        
        {error && (
          <div style={{...styles.alert, ...styles.errorAlert}}>
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        )}
        
        {loading ? (
          <div style={styles.loadingState}>
            <div className="spinner"></div>
            Loading dashboard data...
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div style={styles.statsGrid}>
              <div 
                style={styles.statCard}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FaMobileAlt style={{...styles.statIcon, color: '#3b82f6'}} />
                <div style={styles.statNumber}>{stats.deviceCount}</div>
                <div style={styles.statLabel}>Total Devices</div>
                <div style={{...styles.statChange, ...styles.statChangeUp}}>
                  {Object.entries(stats.devicesByType).map(([type, count]) => (
                    <span key={type} style={{ fontSize: 'clamp(0.65rem, 1vw, 0.75rem)', marginRight: '0.5rem' }}>
                      {type}: {count}
                    </span>
                  ))}
                </div>
              </div>

              <div 
                style={styles.statCard}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FaWrench style={{...styles.statIcon, color: '#10b981'}} />
                <div style={styles.statNumber}>{stats.repairCount}</div>
                <div style={styles.statLabel}>Total Repairs</div>
                <div style={{...styles.statChange, ...styles.statChangeUp}}>
                  <span>Available repair services</span>
                </div>
              </div>

              <div 
                style={styles.statCard}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FaShoppingCart style={{...styles.statIcon, color: '#f59e0b'}} />
                <div style={styles.statNumber}>{stats.productCount}</div>
                <div style={styles.statLabel}>Products Listed</div>
                {(stats.lowStockCount > 0 || stats.outOfStockCount > 0) && (
                  <div style={{...styles.statChange, ...styles.statChangeDown}}>
                    {stats.lowStockCount > 0 && (
                      <span style={{ marginRight: '0.5rem' }}>
                        <FaExclamationTriangle size={12} /> {stats.lowStockCount} low
                      </span>
                    )}
                    {stats.outOfStockCount > 0 && (
                      <span>
                        <FaExclamationTriangle size={12} /> {stats.outOfStockCount} out
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div 
                style={styles.statCard}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FaFire style={{...styles.statIcon, color: '#ef4444'}} />
                <div style={styles.statNumber}>{stats.specialOffersCount}</div>
                <div style={styles.statLabel}>Special Offers</div>
                <div style={{...styles.statChange, ...styles.statChangeUp}}>
                  <span>Active promotions</span>
                </div>
              </div>

              <div 
                style={styles.statCard}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FaDollarSign style={{...styles.statIcon, color: '#10b981'}} />
                <div style={styles.statNumber}>{formatCurrency(stats.totalRevenue)}</div>
                <div style={styles.statLabel}>Inventory Value</div>
                <div style={{...styles.statChange, color: '#64748b'}}>
                  <span>Total stock value</span>
                </div>
              </div>

              <div 
                style={styles.statCard}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FaTags style={{...styles.statIcon, color: '#6366f1'}} />
                <div style={styles.statNumber}>{stats.brandCount}</div>
                <div style={styles.statLabel}>Active Brands</div>
                <div style={{...styles.statChange, ...styles.statChangeUp}}>
                  <span>Across all devices</span>
                </div>
              </div>
            </div>
            
            <div style={styles.mainGrid}>
              {/* Main Content Area */}
              <div>
                {/* Quick Actions */}
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>
                      <FaChartBar />
                      Quick Actions
                    </h3>
                  </div>
                  <div style={styles.cardContent}>
                    <div style={styles.quickActionsGrid}>
                      {quickActions.map(action => (
                        <Link 
                          key={action.to} 
                          to={action.to} 
                          style={styles.actionCard}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.borderColor = action.color;
                            e.currentTarget.style.boxShadow = `0 8px 20px ${action.color}20`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <action.icon style={{...styles.actionIcon, color: action.color}} />
                          <span style={styles.actionLabel}>{action.label}</span>
                          <span style={styles.actionDescription}>{action.description}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                  <div style={{...styles.card, marginTop: '2rem'}}>
                    <div style={styles.cardHeader}>
                      <h3 style={{...styles.cardTitle, color: '#ef4444'}}>
                        <FaExclamationTriangle />
                        Low Stock Alert
                      </h3>
                      <Link to="/admin/products" style={styles.viewAllButton}>
                        Manage Stock <FaArrowRight size={12} />
                      </Link>
                    </div>
                    <div style={styles.cardContent}>
                      <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                          <thead>
                            <tr>
                              <th style={styles.th}>Product</th>
                              <th style={styles.th}>Category</th>
                              <th style={styles.th}>Stock</th>
                              <th style={styles.th}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lowStockProducts.map(product => (
                              <tr key={product._id}>
                                <td style={styles.td}>
                                  <strong>{product.name}</strong>
                                </td>
                                <td style={styles.td}>
                                  <span style={{
                                    ...styles.badge,
                                    ...styles.badgeBlue
                                  }}>
                                    {product.category}
                                  </span>
                                </td>
                                <td style={styles.td}>
                                  <strong style={{ color: '#ef4444' }}>{product.quantity}</strong>
                                </td>
                                <td style={styles.td}>
                                  <span style={{
                                    ...styles.badge,
                                    backgroundColor: '#fee2e2',
                                    color: '#991b1b'
                                  }}>
                                    {product.stockStatus}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Products */}
                <div style={{...styles.card, marginTop: '2rem'}}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>
                      <FaShoppingCart />
                      Recent Products
                    </h3>
                    <Link to="/admin/products" style={styles.viewAllButton}>
                      View All <FaArrowRight size={12} />
                    </Link>
                  </div>
                  <div style={styles.cardContent}>
                    {recentProducts.length > 0 ? (
                      <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                          <thead>
                            <tr>
                              <th style={styles.th}>Product</th>
                              <th style={styles.th}>Price</th>
                              <th style={styles.th}>Stock</th>
                              <th style={styles.th}>Special</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentProducts.map(product => (
                              <tr key={product._id}>
                                <td style={styles.td}>
                                  <div>
                                    <strong>{product.name}</strong>
                                    <br />
                                    <small style={{ color: '#64748b' }}>{product.brand}</small>
                                  </div>
                                </td>
                                <td style={styles.td}>
                                  <strong>{formatCurrency(product.price)}</strong>
                                </td>
                                <td style={styles.td}>
                                  <span style={{
                                    ...styles.badge,
                                    ...(product.stockStatus === 'In Stock' ? styles.badgeGreen :
                                        product.stockStatus === 'Low Stock' ? styles.badgeYellow :
                                        { backgroundColor: '#fee2e2', color: '#991b1b' })
                                  }}>
                                    {product.stockStatus}
                                  </span>
                                </td>
                                <td style={styles.td}>
                                  {product.isSpecialOffer && (
                                    <FaFire color="#ef4444" size={16} />
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div style={styles.emptyState}>
                        <p>No products added yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                {/* Product Distribution */}
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>
                      <FaChartPie />
                      Product Distribution
                    </h3>
                  </div>
                  <div style={styles.cardContent}>
                    <div style={styles.chartContainer}>
                      <div style={{ width: '100%' }}>
                        {Object.entries(stats.productsByCategory).map(([category, count]) => {
                          const percentage = (count / stats.productCount) * 100;
                          return (
                            <div key={category} style={{ marginBottom: '1rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <span style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)', fontWeight: '500', textTransform: 'capitalize' }}>
                                  {category}
                                </span>
                                <span style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)', color: '#64748b' }}>
                                  {count} ({percentage.toFixed(0)}%)
                                </span>
                              </div>
                              <div style={styles.progressBar}>
                                <div 
                                  style={{
                                    ...styles.progressFill,
                                    width: `${percentage}%`
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div style={{...styles.card, marginTop: '2rem'}}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>
                      <FaClock />
                      Recent Activity
                    </h3>
                  </div>
                  <div style={styles.cardContent}>
                    {recentActivity.map((activity, index) => (
                      <div key={activity.id} style={{
                        ...styles.activityItem,
                        borderBottom: index === recentActivity.length - 1 ? 'none' : '1px solid #f1f5f9'
                      }}>
                        <div style={styles.activityIcon}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div style={styles.activityContent}>
                          <div style={styles.activityAction}>{activity.action}</div>
                          <div style={styles.activityItemText}>{activity.item}</div>
                          <div style={styles.activityTime}>{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Status */}
                <div style={{...styles.card, marginTop: '2rem'}}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>
                      <FaCheckCircle />
                      System Status
                    </h3>
                  </div>
                  <div style={styles.cardContent}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FaCheckCircle style={{ color: '#10b981' }} />
                        <span style={{ color: '#374151', fontSize: 'clamp(0.8rem, 1.4vw, 0.9rem)' }}>All systems operational</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FaCheckCircle style={{ color: '#10b981' }} />
                        <span style={{ color: '#374151', fontSize: 'clamp(0.8rem, 1.4vw, 0.9rem)' }}>Database connected</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FaCheckCircle style={{ color: '#10b981' }} />
                        <span style={{ color: '#374151', fontSize: 'clamp(0.8rem, 1.4vw, 0.9rem)' }}>API endpoints active</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FaCalendarAlt style={{ color: '#3b82f6' }} />
                        <span style={{ color: '#374151', fontSize: 'clamp(0.8rem, 1.4vw, 0.9rem)' }}>
                          Last updated: {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;