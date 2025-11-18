import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import RepairForm from './components/RepairForm';
import { FaWrench, FaSync, FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSearch, FaFilter, FaMobileAlt, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

/* Icon map */
import {
  FaFan, FaPlug, FaPowerOff, FaCompactDisc,
  FaTv, FaUsb, FaGamepad, FaTools, FaCameraRetro, FaCamera,
  FaFlask, FaDatabase
} from 'react-icons/fa';

const iconMap = {
  'Screen Replacement': FaTv,
  'Battery Replacement': FaPlug,
  'Charging Port Repair': FaPlug,
  'Audio Repair': FaUsb,
  'Camera Repair': FaCameraRetro,
  'Camera Lens': FaCompactDisc,
  'Liquid Diagnostics': FaFlask,
  'Back Glass Replacement': FaTv,
  'Data Recovery': FaDatabase,
  default: FaWrench
};

/* Utility to build device label */
const getDeviceLabel = (d) => {
  if (!d) return 'Unknown Device';
  return `${d.brand || d.name} ${d.model || ''}`.trim();
};

function AdminRepairs() {
  const { deviceId: paramDeviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get deviceId from URL query params if not in route params
  const queryParams = new URLSearchParams(location.search);
  const queryDeviceId = queryParams.get('deviceId');
  const deviceId = paramDeviceId || queryDeviceId;

  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(deviceId || '');
  const [device, setDevice] = useState(null);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [repairsLoading, setRepairsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingRepair, setEditingRepair] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deletingRepair, setDeletingRepair] = useState(false);
  const [reseeding, setReseeding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => { 
    fetchDevices(); 
  }, []);

  useEffect(() => {
    if (selectedDevice) {
      const current = devices.find(d => d._id === selectedDevice);
      if (current) {
        setDevice(current);
        fetchRepairs(selectedDevice);
      }
    } else {
      setDevice(null);
      setRepairs([]);
    }
  }, [selectedDevice, devices]);

  useEffect(() => {
    if (deviceId && devices.length && !selectedDevice) {
      setSelectedDevice(deviceId);
    }
  }, [deviceId, devices, selectedDevice]);

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return navigate('/admin/login');

      const res = await fetch('/api/admin/devices', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        return navigate('/admin/login');
      }
      if (!res.ok) throw new Error('Failed to fetch devices');

      const data = await res.json();
      setDevices(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load devices.');
    } finally { 
      setLoading(false); 
    }
  };

  const fetchRepairs = async (id) => {
    setRepairsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/devices/${id}/repairs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch repairs');
      const data = await res.json();
      setRepairs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load repairs.');
      setRepairs([]);
    } finally { 
      setRepairsLoading(false); 
    }
  };

  const handleFormSubmit = async (formData) => {
    const payload = {
      ...formData,
      deviceId: selectedDevice
    };

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingRepair
        ? `/api/admin/repairs/${editingRepair._id}`
        : '/api/admin/repairs';
      const method = editingRepair ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Save failed');
      }
      
      await fetchRepairs(selectedDevice);
      setSuccess(`Repair ${editingRepair ? 'updated' : 'added'} successfully`);
      setShowForm(false);
      setEditingRepair(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const deleteRepair = async () => {
    if (!editingRepair) return;
    setDeletingRepair(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/repairs/${editingRepair._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Delete failed');
      
      await fetchRepairs(selectedDevice);
      setSuccess('Repair deleted successfully');
      setShowDelete(false);
      setEditingRepair(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally { 
      setDeletingRepair(false); 
    }
  };

  const reseedDatabase = async () => {
    if (!window.confirm('This will re-seed the phone database from the phoneData.js file. Continue?')) {
      return;
    }
    
    setReseeding(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/reseed-phones', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Re-seed failed');
      
      setSuccess('Database re-seeded successfully');
      await fetchDevices();
      if (selectedDevice) {
        await fetchRepairs(selectedDevice);
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to re-seed database');
      setTimeout(() => setError(''), 5000);
    } finally { 
      setReseeding(false); 
    }
  };

  // Filter repairs based on search term
  const filteredRepairs = repairs.filter(repair => {
    const matchesSearch = repair.repair.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repair.price.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (repair.description && repair.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flexWrap: 'wrap'
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: 'clamp(0.4rem, 2vw, 0.5rem) clamp(0.8rem, 2vw, 1rem)',
      backgroundColor: '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    title: {
      fontSize: 'clamp(1.5rem, 4vw, 2rem)',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0
    },
    reseedButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1.25rem, 3vw, 1.5rem)',
      backgroundColor: '#8b5cf6',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    alert: {
      padding: 'clamp(0.75rem, 2vw, 1rem)',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)'
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
    controlsSection: {
      backgroundColor: 'white',
      padding: 'clamp(1rem, 3vw, 1.5rem)',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '1.5rem'
    },
    selectGroup: {
      marginBottom: '1.5rem'
    },
    selectLabel: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#374151',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)'
    },
    select: {
      width: '100%',
      padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.875rem, 2vw, 1rem)',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      backgroundColor: 'white',
      cursor: 'pointer',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    searchFilterRow: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1rem',
      flexWrap: 'wrap'
    },
    searchBox: {
      position: 'relative',
      flex: '1',
      minWidth: '200px'
    },
    searchIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#6b7280'
    },
    searchInput: {
      width: '100%',
      padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.875rem, 2vw, 1rem) clamp(0.625rem, 2vw, 0.75rem) 2.5rem',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    filterBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    addButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1.25rem, 3vw, 1.5rem)',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginTop: '1rem'
    },
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '1rem',
      marginTop: '1rem'
    },
    statCard: {
      backgroundColor: '#f8fafc',
      padding: '1rem',
      borderRadius: '0.5rem',
      textAlign: 'center',
      border: '1px solid #e5e7eb'
    },
    statNumber: {
      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.25rem'
    },
    statLabel: {
      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
      color: '#64748b',
      fontWeight: '500'
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    tableWrapper: {
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '500px'
    },
    th: {
      padding: 'clamp(0.75rem, 2vw, 1rem)',
      textAlign: 'left',
      backgroundColor: '#f8fafc',
      color: '#475569',
      fontWeight: '600',
      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      borderBottom: '1px solid #e2e8f0',
      whiteSpace: 'nowrap'
    },
    td: {
      padding: 'clamp(0.75rem, 2vw, 1rem)',
      borderBottom: '1px solid #f1f5f9'
    },
    repairInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    repairIcon: {
      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
      color: '#6b7280'
    },
    repairName: {
      fontWeight: '600',
      color: '#1e293b',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)'
    },
    price: {
      fontWeight: '600',
      color: '#059669',
      fontSize: 'clamp(1rem, 2vw, 1.1rem)'
    },
    description: {
      color: '#64748b',
      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
      fontStyle: 'italic'
    },
    actionsCell: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap'
    },
    actionButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: 'clamp(0.375rem, 1vw, 0.5rem) clamp(0.625rem, 1.5vw, 0.75rem)',
      border: 'none',
      borderRadius: '0.375rem',
      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
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
      padding: 'clamp(3rem, 6vw, 4rem) clamp(1.5rem, 4vw, 2rem)',
      color: '#64748b'
    },
    emptyIcon: {
      fontSize: 'clamp(2.5rem, 5vw, 3rem)',
      marginBottom: '1rem',
      opacity: 0.5
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      padding: 'clamp(1.5rem, 4vw, 2rem)',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
    },
    deleteModal: {
      backgroundColor: 'white',
      padding: 'clamp(1.5rem, 4vw, 2rem)',
      borderRadius: '0.75rem',
      maxWidth: '400px',
      width: '100%',
      textAlign: 'center'
    },
    deleteModalTitle: {
      fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '1rem'
    },
    deleteModalText: {
      color: '#64748b',
      marginBottom: '1.5rem',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)'
    },
    deleteModalButtons: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  };

  return (
    <AdminLayout activeItem="repairs">
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button 
              onClick={() => navigate('/admin/devices')}
              style={styles.backButton}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}
            >
              <FaArrowLeft /> Back
            </button>
            <h1 style={styles.title}>Manage Repairs</h1>
          </div>
          {device && device.type === 'phone' && (
            <button 
              style={styles.reseedButton} 
              onClick={reseedDatabase}
              disabled={reseeding}
              onMouseEnter={(e) => !reseeding && (e.target.style.backgroundColor = '#7c3aed')}
              onMouseLeave={(e) => !reseeding && (e.target.style.backgroundColor = '#8b5cf6')}
            >
              <FaSync style={{ marginRight: '0.5rem' }} />
              {reseeding ? 'Re-seeding...' : 'Re-seed Database'}
            </button>
          )}
        </div>

        {error && (
          <div style={{ ...styles.alert, ...styles.errorAlert }}>
            <FaExclamationCircle /> {error}
          </div>
        )}
        
        {success && (
          <div style={{ ...styles.alert, ...styles.successAlert }}>
            <FaCheckCircle /> {success}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <div className="spinner"></div>
            Loading devices...
          </div>
        ) : (
          <>
            <div style={styles.controlsSection}>
              <div style={styles.selectGroup}>
                <label style={styles.selectLabel}>
                  <FaMobileAlt style={{ marginRight: '0.5rem' }} />
                  Select Device:
                </label>
                <select
                  style={styles.select}
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  <option value="">-- Select a Device --</option>
                  {devices.map(d => (
                    <option key={d._id} value={d._id}>
                      {getDeviceLabel(d)} ({d.type})
                    </option>
                  ))}
                </select>
              </div>

              {selectedDevice && (
                <>
                  <div style={styles.searchFilterRow}>
                    <div style={styles.searchBox}>
                      <FaSearch style={styles.searchIcon} />
                      <input
                        type="text"
                        placeholder="Search repairs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                  </div>
                  
                  <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                      <div style={styles.statNumber}>{filteredRepairs.length}</div>
                      <div style={styles.statLabel}>Total Repairs</div>
                    </div>
                    <div style={styles.statCard}>
                      <div style={styles.statNumber}>{device?.brand || 'N/A'}</div>
                      <div style={styles.statLabel}>Brand</div>
                    </div>
                    <div style={styles.statCard}>
                      <div style={styles.statNumber}>{device?.type || 'N/A'}</div>
                      <div style={styles.statLabel}>Device Type</div>
                    </div>
                  </div>

                  <button 
                    style={styles.addButton} 
                    onClick={() => { setShowForm(true); setEditingRepair(null); }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                  >
                    <FaPlus /> Add New Repair
                  </button>
                </>
              )}
            </div>

            {repairsLoading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                <div className="spinner"></div>
                Loading repairs...
              </div>
            ) : selectedDevice ? (
              <div style={styles.tableContainer}>
                {filteredRepairs.length === 0 ? (
                  <div style={styles.emptyState}>
                    <FaWrench style={styles.emptyIcon} />
                    <h3>{searchTerm ? 'No repairs found' : 'No repairs yet'}</h3>
                    <p>{searchTerm ? 'Try adjusting your search' : 'Click "Add New Repair" to add your first repair'}</p>
                  </div>
                ) : (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Repair Type</th>
                          <th style={styles.th}>Price</th>
                          <th style={styles.th}>Description</th>
                          <th style={styles.th}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRepairs.map(r => {
                          const Icon = iconMap[r.repair] || iconMap.default;
                          return (
                            <tr key={r._id}>
                              <td style={styles.td}>
                                <div style={styles.repairInfo}>
                                  <Icon style={styles.repairIcon} />
                                  <div style={styles.repairName}>{r.repair}</div>
                                </div>
                              </td>
                              <td style={styles.td}>
                                <div style={styles.price}>
                                  {r.price?.toLowerCase().includes('quote') 
                                    ? r.price 
                                    : (String(r.price).includes('£') 
                                      ? r.price 
                                      : `£${r.price}`)}
                                </div>
                              </td>
                              <td style={styles.td}>
                                <div style={styles.description}>{r.description || '—'}</div>
                              </td>
                              <td style={styles.td}>
                                <div style={styles.actionsCell}>
                                  <button 
                                    style={{ ...styles.actionButton, ...styles.editButton }}
                                    onClick={() => { setEditingRepair(r); setShowForm(true); }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                                  >
                                    <FaEdit /> Edit
                                  </button>
                                  <button 
                                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                                    onClick={() => { setEditingRepair(r); setShowDelete(true); }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                                  >
                                    <FaTrash /> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.tableContainer}>
                <div style={styles.emptyState}>
                  <FaWrench style={styles.emptyIcon} />
                  <h3>Select a Device</h3>
                  <p>Please select a device from the dropdown to manage its repairs</p>
                </div>
              </div>
            )}

            {showForm && (
              <div 
                style={styles.modal}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowForm(false);
                    setEditingRepair(null);
                  }
                }}
              >
                <div 
                  style={styles.modalContent}
                  onClick={(e) => e.stopPropagation()}
                >
                  <RepairForm
                    repair={editingRepair}
                    onSubmit={handleFormSubmit}
                    onCancel={() => { setShowForm(false); setEditingRepair(null); }}
                  />
                </div>
              </div>
            )}

            {showDelete && editingRepair && (
              <div 
                style={styles.modal}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowDelete(false);
                    setEditingRepair(null);
                  }
                }}
              >
                <div 
                  style={styles.deleteModal}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 style={styles.deleteModalTitle}>Confirm Delete</h3>
                  <p style={styles.deleteModalText}>
                    Are you sure you want to delete the repair "{editingRepair.repair}"?
                  </p>
                  <div style={styles.deleteModalButtons}>
                    <button 
                      style={{ ...styles.actionButton, backgroundColor: '#6b7280', color: 'white' }}
                      onClick={() => { setShowDelete(false); setEditingRepair(null); }}
                    >
                      Cancel
                    </button>
                    <button 
                      style={{ ...styles.actionButton, ...styles.deleteButton }}
                      onClick={deleteRepair} 
                      disabled={deletingRepair}
                    >
                      {deletingRepair ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminRepairs;