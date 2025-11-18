import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import DeviceForm from './components/DeviceForm';
import { FaEdit, FaTrash, FaTools, FaPlus, FaSearch, FaTimes } from 'react-icons/fa';

// Image mapping function based on brand and model
const getPhoneImage = (brand, model) => {
  const brandLower = brand?.toLowerCase();
  const modelLower = model?.toLowerCase();
  
  // Apple/iPhone mapping
  if (brandLower === 'apple' || brandLower === 'iphone') {
    const iphoneImages = {
      'iphone 16 pro max': '/images/I-Phones/I-Phones/iphone-16-pro-max.avif',
      'iphone 16 pro': '/images/I-Phones/I-Phones/iphone-16-pro.avif',
      'iphone 16 plus': '/images/I-Phones/I-Phones/iphone-16-plus.avif',
      'iphone 16': '/images/I-Phones/I-Phones/iphone16_1.avif',
      'iphone 15 pro max': '/images/I-Phones/I-Phones/iphone-15-pro-max.avif',
      'iphone 15 pro': '/images/I-Phones/I-Phones/iphone-15-pro.avif',
      'iphone 15 plus': '/images/I-Phones/I-Phones/iphone-15-plus.avif',
      'iphone 15': '/images/I-Phones/I-Phones/IPHONE15.avif',
      'iphone 14 pro max': '/images/I-Phones/I-Phones/IPHONE14PROMAX.avif',
      'iphone 14 pro': '/images/I-Phones/I-Phones/iphone14pro.avif',
      'iphone 14 plus': '/images/I-Phones/I-Phones/iphone-14.avif',
      'iphone 14': '/images/I-Phones/I-Phones/iphone-14.avif',
      'iphone 13 pro max': '/images/I-Phones/I-Phones/iphone-13-pro-max.avif',
      'iphone 13 pro': '/images/I-Phones/I-Phones/iphone-13-pro.avif',
      'iphone 13': '/images/I-Phones/I-Phones/IPHONE13.avif',
      'iphone 13 mini': '/images/I-Phones/I-Phones/iphone-13-mini.avif',
      'iphone se 3 (2022)': '/images/I-Phones/I-Phones/iphonese32022.avif',
      'iphone se (2nd generation)': '/images/I-Phones/I-Phones/IPHONESE22022.avif',
      'iphone 12 pro max': '/images/I-Phones/I-Phones/IPHONE12PROMAX.avif',
      'iphone 12 pro': '/images/I-Phones/I-Phones/iphone12pro.avif',
      'iphone 12': '/images/I-Phones/I-Phones/iphone-12.avif',
      'iphone 12 mini': '/images/I-Phones/I-Phones/iphone-12-mini.avif',
      'iphone 11 pro max': '/images/I-Phones/I-Phones/iphone-11-pro-max.avif',
      'iphone 11 pro': '/images/I-Phones/I-Phones/iphone11pro.avif',
      'iphone 11': '/images/I-Phones/I-Phones/IPHONE11.avif',
      'iphone x': '/images/I-Phones/I-Phones/iphone-x.avif',
      'iphone xs max': '/images/I-Phones/I-Phones/iphonexsmax.jpeg',
      'iphone xs': '/images/I-Phones/I-Phones/IPHONEXS.avif',
      'iphone xr': '/images/I-Phones/I-Phones/iphone-xr.avif',
      'iphone 8 plus': '/images/I-Phones/I-Phones/iphone8plus.jpeg',
      'iphone 8': '/images/I-Phones/I-Phones/iphone8.avif',
      'iphone 7': '/images/I-Phones/I-Phones/iphone-7.avif',
      'iphone 7 plus': '/images/I-Phones/I-Phones/iphone-7-plus.avif',
      'iphone 6s plus': '/images/I-Phones/I-Phones/iphone-6s-plus.avif',
      'iphone 6 plus': '/images/I-Phones/I-Phones/iphone-6s-plus.avif',
      'iphone 6s': '/images/I-Phones/I-Phones/iphone-6.avif',
      'iphone 6': '/images/I-Phones/I-Phones/iphone-6.avif',
      'iphone 5c': '/images/I-Phones/I-Phones/iphone-5c.avif',
    };
    
    return iphoneImages[modelLower] || null;
  }
  
  // Samsung mapping
  if (brandLower === 'samsung') {
    const samsungImages = {
      'galaxy s24 ultra': '/images/samsung/samsungs24ultra.avif',
      'galaxy s24 plus': '/images/samsung/samsungs24plus.avif',
      'galaxy s24': '/images/samsung/samsungs24.avif',
      'galaxy s23 ultra': '/images/samsung/galaxys23ultra.avif',
      'galaxy s23 plus': '/images/samsung/galaxys23plus.avif',
      'galaxy s23': '/images/samsung/galaxys23.avif',
      'galaxy s22 ultra': '/images/samsung/galaxys22ultra.avif',
      'galaxy s22 plus': '/images/samsung/galaxys22plus.avif',
      'galaxy s22': '/images/samsung/galaxys22.avif',
      'galaxy s21 ultra': '/images/samsung/galaxys21ultra.avif',
      'galaxy s21 fe': '/images/samsung/galaxys21fe.avif',
      'galaxy s21 plus': '/images/samsung/samsungs21plusnew.avif',
      'galaxy s21': '/images/samsung/samsungs21.avif',
      'galaxy s20 ultra': '/images/samsung/galaxys20ultra.avif',
      'galaxy s20 plus': '/images/samsung/samsungs20plus.avif',
      'galaxy s20 fe': '/images/samsung/galaxys20fe.avif',
      'galaxy s20': '/images/samsung/samsungs20plus.avif',
      'galaxy note 20 ultra': '/images/samsung/galaxynote20ultra.jpg',
      'galaxy note 20': '/images/samsung/galaxynote20.jpg',
      'samsung z flip 6': '/images/samsung/zflip6.jpg',
      'samsung z flip 5': '/images/samsung/zflip5.jpg',
      'samsung z flip 4': '/images/samsung/zflip4.webp',
      'samsung z flip 3': '/images/samsung/zflip3.jpg',
      'samsung z fold 6': '/images/samsung/zfold6.jpg',
      'samsung z fold 5': '/images/samsung/zfold5.jpg',
      'samsung z fold 4': '/images/samsung/zfold4.webp',
      'samsung z fold 3': '/images/samsung/zfold3.jpg',
    };
    
    return samsungImages[modelLower] || null;
  }
  
  // Google Pixel mapping
  if (brandLower === 'google pixel' || brandLower === 'pixel') {
    const pixelImages = {
      'pixel 9 pro xl': '/images/GOOGLEPIXEL/googlepixel9proxl.avif',
      'pixel 9 pro': '/images/GOOGLEPIXEL/googlepixel9proxl.avif',
      'pixel 9': '/images/GOOGLEPIXEL/googlepixel9.avif',
      'pixel 8a': '/images/GOOGLEPIXEL/googlepixel8a.avif',
      'pixel 8 pro': '/images/GOOGLEPIXEL/GooglePixel8Pro.avif',
      'pixel 8': '/images/GOOGLEPIXEL/google-pixel-8.avif',
      'pixel 7 pro': '/images/GOOGLEPIXEL/GooglePixel7Pro.avif',
      'pixel 7': '/images/GOOGLEPIXEL/googlepixel7.avif',
      'pixel 7a': '/images/GOOGLEPIXEL/googlepixel7a.avif',
    };
    
    return pixelImages[modelLower] || null;
  }
  
  return null;
};

function AdminDevices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDevice, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  // Fetch devices from backend
  const fetchDevices = async () => {
    setLoading(true);
    setError(''); // Clear any previous errors
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      
      // Always fetch fresh data from backend
      const res = await fetch('/api/admin/devices', { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        } 
      });
      
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }
      
      if (!res.ok) throw new Error('Failed to fetch devices');
      
      const data = await res.json();
      
      // Map images to devices
      const devicesWithImages = data.map(device => ({
        ...device,
        image: device.image || getPhoneImage(device.brand, device.model)
      }));
      
      setDevices(devicesWithImages);
      
      // If we were editing a device and it was deleted, close the form
      if (editingDevice && !devicesWithImages.find(d => d._id === editingDevice._id)) {
        handleClose();
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally { 
      setLoading(false); 
    }
  };
  
  useEffect(() => { 
    fetchDevices(); 
  }, []);

  // Refresh devices when returning to this page
  useEffect(() => {
    const handleFocus = () => {
      fetchDevices();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleAdd = () => { 
    setEditing(null); 
    setShowForm(true); 
  };
  
  const handleEdit = (device) => { 
    setEditing(device);  
    setShowForm(true); 
  };
  
  const handleClose = () => { 
    setShowForm(false); 
    setEditing(null); 
  };

  const handleDelete = async (device) => {
    if (!window.confirm(`Are you sure you want to delete ${device.brand} ${device.model}?`)) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const id = device._id || device.id;
      
      const res = await fetch(`/api/admin/devices/${id}`, { 
        method: 'DELETE', 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Delete failed');
      }
      
      setSuccess('Device deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      
      // Refresh the device list
      await fetchDevices();
    } catch (err) { 
      console.error('Delete error:', err);
      setError(err.message); 
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleSave = async (data) => {
    const token = localStorage.getItem('adminToken');
    const id = editingDevice && (editingDevice._id || editingDevice.id);
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/admin/devices/${id}` : '/api/admin/devices';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Save failed');
      }
      
      handleClose();
      setSuccess(`Device ${id ? 'updated' : 'added'} successfully`);
      setTimeout(() => setSuccess(''), 3000);
      
      // Refresh the device list
      await fetchDevices();
    } catch (err) { 
      console.error('Save error:', err);
      setError(err.message); 
      setTimeout(() => setError(''), 5000);
    }
  };

  // Filtering
  const filteredDevices = devices.filter(device => {
    const matchesSearch = 
      device.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.model?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || device.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Device type icon
  const getDeviceIcon = (type) => {
    switch(type) {
      case 'phone': return '📱';
      case 'tablet': return '📟';
      case 'watch': return '⌚';
      case 'console': return '🎮';
      default: return '📱';
    }
  };

  // Styles
  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    filtersContainer: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    searchContainer: {
      position: 'relative',
      flex: '1',
      minWidth: '250px',
      maxWidth: '400px'
    },
    searchInput: {
      width: '100%',
      padding: '0.75rem 1rem 0.75rem 2.5rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.95rem',
      backgroundColor: 'white',
      transition: 'border-color 0.2s',
      outline: 'none'
    },
    searchIcon: {
      position: 'absolute',
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#64748b'
    },
    filterSelect: {
      padding: '0.75rem 1rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.95rem',
      backgroundColor: 'white',
      cursor: 'pointer',
      outline: 'none'
    },
    alert: {
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    errorAlert: {
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      border: '1px solid #fecaca'
    },
    successAlert: {
      backgroundColor: '#d1fae5',
      color: '#059669',
      border: '1px solid #a7f3d0'
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    tableScroll: {
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '600px'
    },
    th: {
      padding: '1rem',
      textAlign: 'left',
      backgroundColor: '#f8fafc',
      color: '#475569',
      fontWeight: '600',
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      borderBottom: '1px solid #e2e8f0',
      whiteSpace: 'nowrap'
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #f1f5f9'
    },
    deviceInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    deviceImage: {
      width: '50px',
      height: '50px',
      objectFit: 'contain',
      borderRadius: '0.5rem',
      backgroundColor: '#f8fafc',
      padding: '0.25rem'
    },
    deviceDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    },
    brandName: {
      fontWeight: '600',
      color: '#1e293b',
      fontSize: '0.95rem'
    },
    modelName: {
      color: '#64748b',
      fontSize: '0.875rem'
    },
    typeChip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.25rem 0.75rem',
      borderRadius: '1rem',
      fontSize: '0.75rem',
      fontWeight: '500',
      backgroundColor: '#e0e7ff',
      color: '#4338ca',
      whiteSpace: 'nowrap'
    },
    repairCount: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '50%',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      fontWeight: '600'
    },
    actionsCell: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    actionButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.5rem 0.75rem',
      border: 'none',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap'
    },
    repairsLink: {
      backgroundColor: '#10b981',
      color: 'white',
      textDecoration: 'none'
    },
    editButton: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    deleteButton: {
      backgroundColor: '#ef4444',
      color: 'white'
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem 2rem',
      color: '#64748b'
    },
    emptyStateIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
      opacity: '0.5'
    },
    loadingState: {
      textAlign: 'center',
      padding: '4rem 2rem',
      color: '#64748b'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      padding: '2rem',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
      position: 'relative'
    },
    // Responsive styles
    '@media (max-width: 768px)': {
      title: {
        fontSize: '1.5rem'
      },
      filtersContainer: {
        flexDirection: 'column',
        alignItems: 'stretch'
      },
      searchContainer: {
        maxWidth: '100%'
      },
      actionsCell: {
        flexDirection: 'column',
        alignItems: 'stretch'
      },
      actionButton: {
        width: '100%',
        justifyContent: 'center'
      }
    }
  };

  return (
    <AdminLayout activeItem="devices">
      <div>
        <div style={styles.header}>
          <h1 style={styles.title}>Manage Devices</h1>
          <button 
            onClick={handleAdd} 
            style={styles.addButton}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            <FaPlus /> Add New Device
          </button>
        </div>

        {error && (
          <div style={{ ...styles.alert, ...styles.errorAlert }}>
            ⚠️ {error}
          </div>
        )}
        
        {success && (
          <div style={{ ...styles.alert, ...styles.successAlert }}>
            ✓ {success}
          </div>
        )}

        <div style={styles.filtersContainer}>
          <div style={styles.searchContainer}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by brand or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All Devices</option>
            <option value="phone">Phones</option>
            <option value="tablet">Tablets</option>
            <option value="watch">Watches</option>
            <option value="console">Consoles</option>
          </select>
        </div>

        {loading ? (
          <div style={styles.loadingState}>
            <div>Loading devices...</div>
          </div>
        ) : filteredDevices.length === 0 ? (
          <div style={styles.tableContainer}>
            <div style={styles.emptyState}>
              <div style={styles.emptyStateIcon}>📱</div>
              <h3>No devices found</h3>
              <p>
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Click "Add New Device" to get started'}
              </p>
            </div>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <div style={styles.tableScroll}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Device</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Repairs</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDevices.map(device => (
                    <tr key={device._id || device.id}>
                      <td style={styles.td}>
                        <div style={styles.deviceInfo}>
                          {device.image ? (
                            <img 
                              src={device.image} 
                              alt={`${device.brand} ${device.model}`} 
                              style={styles.deviceImage}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            style={{
                              width: '50px',
                              height: '50px',
                              display: device.image ? 'none' : 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.5rem',
                              backgroundColor: '#f3f4f6',
                              borderRadius: '0.5rem'
                            }}
                          >
                            {getDeviceIcon(device.type)}
                          </div>
                          <div style={styles.deviceDetails}>
                            <div style={styles.brandName}>{device.brand}</div>
                            <div style={styles.modelName}>{device.model}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.typeChip}>
                          {getDeviceIcon(device.type)} {device.type}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.repairCount}>
                          {device.repairs?.length || 0}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={window.innerWidth <= 768 ? 
                          {...styles.actionsCell, flexDirection: 'column', alignItems: 'stretch'} : 
                          styles.actionsCell}
                        >
                          <Link 
                            to={`/admin/repairs?deviceId=${device._id || device.id}`}
                            style={{ 
                              ...styles.actionButton, 
                              ...styles.repairsLink,
                              ...(window.innerWidth <= 768 ? {width: '100%', justifyContent: 'center'} : {})
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                          >
                            <FaTools /> Repairs
                          </Link>
                          <button 
                            onClick={() => handleEdit(device)}
                            style={{ 
                              ...styles.actionButton, 
                              ...styles.editButton,
                              ...(window.innerWidth <= 768 ? {width: '100%', justifyContent: 'center'} : {})
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(device)}
                            style={{ 
                              ...styles.actionButton, 
                              ...styles.deleteButton,
                              ...(window.innerWidth <= 768 ? {width: '100%', justifyContent: 'center'} : {})
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showForm && (
          <div 
            style={styles.modalOverlay}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleClose();
              }
            }}
          >
            <div style={styles.modalContent}>
              <DeviceForm
                device={editingDevice}
                onSubmit={handleSave}
                onCancel={handleClose}
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDevices;