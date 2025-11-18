// DeviceForm.js - Responsive and improved UI
import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaTimes, FaImage, FaUpload, FaMobileAlt, FaTabletAlt, FaLaptop, FaGamepad, FaClock, FaCheck, FaExclamationCircle } from 'react-icons/fa';

function DeviceForm({ device, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    image: '',
    type: 'phone',
    repairs: []
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  // Repair form state
  const [newRepair, setNewRepair] = useState({ repair: '', price: '' });
  const [showRepairForm, setShowRepairForm] = useState(false);

  const deviceTypes = [
    { value: 'phone', label: 'Phone', icon: FaMobileAlt, color: '#3b82f6' },
    { value: 'tablet', label: 'Tablet', icon: FaTabletAlt, color: '#10b981' },
    { value: 'watch', label: 'Watch', icon: FaClock, color: '#f59e0b' },
    { value: 'console', label: 'Console', icon: FaGamepad, color: '#8b5cf6' }
  ];

  const brandSuggestions = {
    phone: ['Apple', 'Samsung', 'Google Pixel', 'OnePlus', 'Huawei', 'Nokia', 'Motorola', 'Oppo', 'Redmi'],
    tablet: ['Apple', 'Samsung', 'Microsoft', 'Lenovo'],
    watch: ['Apple', 'Samsung', 'Garmin', 'Fitbit'],
    console: ['Sony', 'Microsoft', 'Nintendo']
  };

  const commonRepairs = {
    phone: [
      { repair: 'Screen Replacement', price: '£50' },
      { repair: 'Battery Replacement', price: '£40' },
      { repair: 'Charging Port Repair', price: '£35' },
      { repair: 'Camera Repair', price: '£45' },
      { repair: 'Audio Repair', price: '£30' },
      { repair: 'Liquid Diagnostics', price: '£25' },
      { repair: 'Back Glass Replacement', price: '£40' },
      { repair: 'Data Recovery', price: '£60' }
    ],
    tablet: [
      { repair: 'Screen Replacement', price: '£80' },
      { repair: 'Battery Replacement', price: '£50' },
      { repair: 'Charging Port Repair', price: '£40' }
    ],
    watch: [
      { repair: 'Screen Replacement', price: '£60' },
      { repair: 'Battery Replacement', price: '£35' }
    ],
    console: [
      { repair: 'HDMI Port Repair', price: '£50' },
      { repair: 'Overheating/Fan Noise', price: '£45' },
      { repair: 'Disc Not Recognised', price: '£40' }
    ]
  };

  useEffect(() => {
    if (device) {
      setFormData({
        brand: device.brand || '',
        model: device.model || '',
        image: device.image || '',
        type: device.type || 'phone',
        repairs: device.repairs || []
      });
      setPreviewUrl(device.image || '');
    }
  }, [device]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a JPEG, PNG, WebP or AVIF image');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be < 5 MB');
      return;
    }

    setImageFile(file);
    setError('');

    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image;

    try {
      setUploading(true);
      const body = new FormData();
      body.append('image', imageFile);

      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data.imageUrl;
    } catch (err) {
      setError('Image upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAddRepair = () => {
    if (!newRepair.repair || !newRepair.price) {
      setError('Please enter both repair type and price');
      return;
    }

    setFormData(prev => ({
      ...prev,
      repairs: [...prev.repairs, { ...newRepair, _id: Date.now() }]
    }));
    setNewRepair({ repair: '', price: '' });
    setShowRepairForm(false);
    setError('');
  };

  const handleRemoveRepair = (index) => {
    setFormData(prev => ({
      ...prev,
      repairs: prev.repairs.filter((_, i) => i !== index)
    }));
  };

  const handleQuickAddRepair = (repair) => {
    setFormData(prev => ({
      ...prev,
      repairs: [...prev.repairs, { ...repair, _id: Date.now() }]
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!formData.brand || !formData.model) {
      setError('Brand and Model are required');
      return;
    }

    if (!device && formData.repairs.length === 0) {
      setError('At least one repair is required for new devices');
      return;
    }

    const imageUrl = await uploadImage();
    if (imageFile && !imageUrl) return;

    const submitData = { 
      ...formData, 
      image: imageUrl || formData.image,
      // Don't send repairs if editing existing device
      repairs: device ? undefined : formData.repairs.map(r => ({
        repair: r.repair,
        price: r.price
      }))
    };

    onSubmit(submitData);
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    header: {
      marginBottom: '2rem',
      paddingBottom: '1.5rem',
      borderBottom: '2px solid #e5e7eb',
      position: 'relative'
    },
    closeButton: {
      position: 'absolute',
      top: '0',
      right: '0',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      color: '#6b7280',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      transition: 'all 0.2s'
    },
    title: {
      fontSize: 'clamp(1.5rem, 3vw, 1.75rem)',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    subtitle: {
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      color: '#64748b',
      marginTop: '0.5rem'
    },
    errorAlert: {
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      padding: '0.75rem 1rem',
      borderRadius: '0.75rem',
      marginBottom: '1.5rem',
      border: '1px solid #fecaca',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    deviceTypeSection: {
      marginBottom: '2rem'
    },
    deviceTypeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '1rem',
      marginTop: '0.75rem'
    },
    deviceTypeCard: {
      padding: 'clamp(1rem, 2vw, 1.25rem)',
      border: '2px solid #e5e7eb',
      borderRadius: '0.75rem',
      backgroundColor: '#f9fafb',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem'
    },
    deviceTypeCardActive: {
      borderColor: '#3b82f6',
      backgroundColor: '#eff6ff'
    },
    deviceTypeIcon: {
      fontSize: 'clamp(1.5rem, 3vw, 2rem)'
    },
    deviceTypeLabel: {
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      fontWeight: '600',
      color: '#374151'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '1.5rem'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#374151',
      fontSize: 'clamp(0.875rem, 2vw, 0.95rem)'
    },
    required: {
      color: '#ef4444',
      marginLeft: '0.25rem'
    },
    input: {
      width: '100%',
      padding: 'clamp(0.75rem, 2vw, 1rem)',
      border: '2px solid #e5e7eb',
      borderRadius: '0.75rem',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      transition: 'all 0.2s',
      outline: 'none',
      backgroundColor: '#f9fafb'
    },
    imageUploadSection: {
      marginBottom: '2rem'
    },
    imagePreviewContainer: {
      position: 'relative',
      width: '100%',
      maxWidth: '300px',
      margin: '0 auto 1rem',
      aspectRatio: '1',
      backgroundColor: '#f3f4f6',
      borderRadius: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      border: '2px dashed #cbd5e1'
    },
    imagePreview: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      padding: '1rem'
    },
    imagePlaceholder: {
      textAlign: 'center',
      color: '#9ca3af'
    },
    imagePlaceholderIcon: {
      fontSize: 'clamp(3rem, 6vw, 4rem)',
      marginBottom: '0.5rem'
    },
    fileInputWrapper: {
      position: 'relative',
      overflow: 'hidden',
      display: 'inline-block',
      width: '100%'
    },
    fileInputLabel: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: 'clamp(0.75rem, 2vw, 1rem)',
      backgroundColor: '#3b82f6',
      color: 'white',
      borderRadius: '0.75rem',
      cursor: 'pointer',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      fontWeight: '600',
      transition: 'all 0.2s',
      width: '100%'
    },
    fileInput: {
      position: 'absolute',
      left: '-9999px'
    },
    uploadHint: {
      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
      color: '#6b7280',
      textAlign: 'center',
      marginTop: '0.5rem'
    },
    repairsSection: {
      marginTop: '2rem',
      padding: 'clamp(1.25rem, 3vw, 1.5rem)',
      backgroundColor: '#f8fafc',
      borderRadius: '1rem',
      border: '2px solid #e5e7eb'
    },
    repairsList: {
      marginTop: '1rem'
    },
    repairItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'clamp(0.75rem, 2vw, 1rem)',
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      marginBottom: '0.75rem',
      border: '1px solid #e5e7eb',
      transition: 'all 0.2s'
    },
    repairInfo: {
      flex: 1
    },
    repairName: {
      fontWeight: '600',
      color: '#1e293b',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)'
    },
    repairPrice: {
      color: '#10b981',
      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
      fontWeight: '600'
    },
    removeButton: {
      padding: '0.5rem',
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    addRepairButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1.25rem)',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '0.75rem',
      fontSize: 'clamp(0.875rem, 2vw, 0.95rem)',
      fontWeight: '500',
      cursor: 'pointer',
      marginTop: '1rem',
      transition: 'all 0.2s'
    },
    quickAddContainer: {
      marginTop: '1rem',
      padding: 'clamp(1rem, 2vw, 1.25rem)',
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      border: '1px solid #e5e7eb'
    },
    quickAddGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 180px), 1fr))',
      gap: '0.75rem',
      marginTop: '0.75rem'
    },
    quickAddButton: {
      padding: 'clamp(0.625rem, 1.5vw, 0.75rem)',
      backgroundColor: '#f3f4f6',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'left'
    },
    repairForm: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginTop: '1rem',
      padding: 'clamp(1rem, 2vw, 1.25rem)',
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      border: '1px solid #e5e7eb',
      alignItems: 'end'
    },
    actions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
      marginTop: '2rem',
      paddingTop: '1.5rem',
      borderTop: '2px solid #e5e7eb',
      flexWrap: 'wrap'
    },
    cancelButton: {
      padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: '1px solid #e5e7eb',
      borderRadius: '0.75rem',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    submitButton: {
      padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '0.75rem',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    disabledNotice: {
      padding: 'clamp(1rem, 2vw, 1.25rem)',
      backgroundColor: '#fef3c7',
      border: '1px solid #fde68a',
      borderRadius: '0.75rem',
      color: '#92400e',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          type="button"
          onClick={onCancel}
          style={styles.closeButton}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <FaTimes />
        </button>
        <h2 style={styles.title}>
          <FaMobileAlt style={{ color: '#3b82f6' }} />
          {device ? 'Edit Device' : 'Add New Device'}
        </h2>
        <p style={styles.subtitle}>
          Configure device information and repair services
        </p>
      </div>

      {error && (
        <div style={styles.errorAlert}>
          <FaExclamationCircle /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Device Type Selection */}
        <div style={styles.deviceTypeSection}>
          <label style={styles.label}>
            Device Type <span style={styles.required}>*</span>
          </label>
          <div style={styles.deviceTypeGrid}>
            {deviceTypes.map(type => {
              const Icon = type.icon;
              const isActive = formData.type === type.value;
              return (
                <div
                  key={type.value}
                  style={{
                    ...styles.deviceTypeCard,
                    ...(isActive ? styles.deviceTypeCardActive : {}),
                    cursor: device || uploading ? 'not-allowed' : 'pointer',
                    opacity: device || uploading ? 0.6 : 1
                  }}
                  onClick={() => !device && !uploading && handleChange({ target: { name: 'type', value: type.value } })}
                >
                  <Icon style={{ ...styles.deviceTypeIcon, color: isActive ? type.color : '#6b7280' }} />
                  <span style={styles.deviceTypeLabel}>{type.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Brand <span style={styles.required}>*</span>
            </label>
            <input
              name="brand"
              value={formData.brand}
              list="brand-list"
              onChange={handleChange}
              style={styles.input}
              disabled={uploading}
              placeholder="e.g., Apple, Samsung"
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <datalist id="brand-list">
              {(brandSuggestions[formData.type] || []).map(b => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Model <span style={styles.required}>*</span>
            </label>
            <input
              name="model"
              value={formData.model}
              onChange={handleChange}
              style={styles.input}
              disabled={uploading}
              placeholder="e.g., iPhone 15 Pro, Galaxy S24"
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div style={styles.imageUploadSection}>
          <label style={styles.label}>Device Image (optional)</label>
          <div style={styles.imagePreviewContainer}>
            {previewUrl ? (
              <img src={previewUrl} alt="Device preview" style={styles.imagePreview} />
            ) : (
              <div style={styles.imagePlaceholder}>
                <FaImage style={styles.imagePlaceholderIcon} />
                <p>No image uploaded</p>
              </div>
            )}
          </div>
          <div style={styles.fileInputWrapper}>
            <label style={styles.fileInputLabel}>
              <FaUpload /> {uploading ? 'Uploading...' : 'Upload Image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
                style={styles.fileInput}
              />
            </label>
          </div>
          <p style={styles.uploadHint}>
            Supported formats: JPEG, PNG, WebP or AVIF. Max 5MB.
          </p>
        </div>

        {/* Only show repairs section for new devices */}
        {!device && (
          <div style={styles.repairsSection}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>
              Repairs <span style={styles.required}>*</span>
            </h3>

            {formData.repairs.length > 0 && (
              <div style={styles.repairsList}>
                {formData.repairs.map((repair, index) => (
                  <div key={repair._id || index} style={styles.repairItem}>
                    <div style={styles.repairInfo}>
                      <div style={styles.repairName}>{repair.repair}</div>
                      <div style={styles.repairPrice}>{repair.price}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRepair(index)}
                      style={styles.removeButton}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#fecaca'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#fee2e2'}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showRepairForm && (
              <div style={styles.repairForm}>
                <div>
                  <label style={{ ...styles.label, marginBottom: '0.25rem' }}>
                    Repair Type
                  </label>
                  <input
                    value={newRepair.repair}
                    onChange={(e) => setNewRepair({ ...newRepair, repair: e.target.value })}
                    style={{ ...styles.input, marginBottom: 0 }}
                    placeholder="e.g., Screen Replacement"
                  />
                </div>
                <div>
                  <label style={{ ...styles.label, marginBottom: '0.25rem' }}>
                    Price
                  </label>
                  <input
                    value={newRepair.price}
                    onChange={(e) => setNewRepair({ ...newRepair, price: e.target.value })}
                    style={{ ...styles.input, marginBottom: 0 }}
                    placeholder="e.g., £50"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddRepair}
                  style={{
                    ...styles.addRepairButton,
                    marginTop: 0,
                    alignSelf: 'end'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                >
                  <FaCheck /> Add
                </button>
              </div>
            )}

            {!showRepairForm && (
              <>
                <button
                  type="button"
                  onClick={() => setShowRepairForm(true)}
                  style={styles.addRepairButton}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                >
                  <FaPlus /> Add Custom Repair
                </button>

                <div style={styles.quickAddContainer}>
                  <label style={{ ...styles.label, marginBottom: '0.5rem' }}>
                    Quick Add Common Repairs:
                  </label>
                  <div style={styles.quickAddGrid}>
                    {(commonRepairs[formData.type] || []).map((repair, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleQuickAddRepair(repair)}
                        style={styles.quickAddButton}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                      >
                        <div style={{ fontWeight: '500' }}>{repair.repair}</div>
                        <div style={{ fontSize: '0.75rem', color: '#059669' }}>{repair.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Show notice for existing devices */}
        {device && (
          <div style={styles.disabledNotice}>
            <FaExclamationCircle />
            <span>To manage repairs for this device, please use the "Repairs" button in the device list or visit the Manage Repairs page.</span>
          </div>
        )}

        <div style={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            style={styles.cancelButton}
            disabled={uploading}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              ...styles.submitButton,
              opacity: uploading ? 0.6 : 1,
              cursor: uploading ? 'not-allowed' : 'pointer'
            }}
            disabled={uploading}
            onMouseEnter={(e) => !uploading && (e.target.style.backgroundColor = '#2563eb')}
            onMouseLeave={(e) => !uploading && (e.target.style.backgroundColor = '#3b82f6')}
          >
            {uploading ? (
              <>Saving...</>
            ) : (
              <>
                <FaCheck /> {device ? 'Update Device' : 'Add Device'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DeviceForm;