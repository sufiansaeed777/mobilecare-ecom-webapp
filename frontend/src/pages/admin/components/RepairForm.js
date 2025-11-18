// src/pages/admin/components/RepairForm.js
import React, { useState, useEffect } from 'react';
import {
  FaWrench, FaFan, FaPlug, FaPowerOff, FaCompactDisc,
  FaTv, FaUsb, FaGamepad, FaTools, FaCameraRetro, FaCamera,
  FaFlask, FaDatabase, FaDollarSign, FaAlignLeft, FaTimes,
  FaSave, FaCheck
} from 'react-icons/fa';

// Map repair types to icons for visual representation
const iconMap = {
  "Digitizer": FaTools, "Battery Replacement": FaPlug, "Battery Replacment": FaPlug,
  "Inner screen": FaTv, "Inner Screen Replacment": FaTv, "Screen Replacment": FaTv,
  "Charging port repair": FaPlug, "Charging Port repair": FaPlug, "Charging Port Repair": FaPlug,
  "Audio Repair": FaUsb, "Camera Repair": FaCameraRetro, "Cameras": FaCamera,
  "Camera Lens": FaCompactDisc, "Diagnostics": FaTools, "Device not turning on": FaPowerOff,
  "Repair Quotation": FaWrench, "Liquid Diagnostics": FaFlask, "Data Recovery": FaDatabase,
  "Overheating/Fan Noise": FaFan, "Overheating": FaFan, "HDMI Port Repair": FaPlug,
  "HDMI Port Replacement": FaPlug, "Console Not Turning On": FaPowerOff,
  "Unable to Insert/ Eject Disc": FaCompactDisc, "No Video Output": FaTv, "USB Repair": FaUsb,
  "Unable to update": FaTools, "Stuck Safe Mode": FaTools, "Blue Light of Death": FaPowerOff,
  "Disc Not Recognised": FaCompactDisc, "Unable to Connect to Internet": FaPowerOff,
  "Loading Screen Stuck": FaTools, "Controller Not Syncing": FaGamepad,
  "System Error (e.g E101)": FaPowerOff, "Screen Replacement": FaTv,
  "Digitizer Repair": FaTools,
  "Card Slot Repair": FaGamepad,
  default: FaWrench
};

function RepairForm({ repair, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    repair: '',
    price: '',
    description: ''
  });
  
  const [error, setError] = useState('');
  const [selectedIconKey, setSelectedIconKey] = useState(''); // Store icon key instead of component
  const [priceType, setPriceType] = useState('fixed'); // 'fixed' or 'quote'
  
  // Common repair types for quick selection
  const commonRepairs = [
    { name: 'Screen Replacement', icon: FaTv, avgPrice: '£120' },
    { name: 'Battery Replacement', icon: FaPlug, avgPrice: '£50' },
    { name: 'Charging Port Repair', icon: FaPlug, avgPrice: '£45' },
    { name: 'Camera Repair', icon: FaCameraRetro, avgPrice: '£60' },
    { name: 'Audio Repair', icon: FaUsb, avgPrice: '£40' },
    { name: 'Diagnostics', icon: FaTools, avgPrice: '£25' },
    { name: 'Data Recovery', icon: FaDatabase, avgPrice: '£80' },
    { name: 'Liquid Diagnostics', icon: FaFlask, avgPrice: '£35' },
    { name: 'Overheating', icon: FaFan, avgPrice: '£45' },
    { name: 'Screen Replacment', icon: FaTv, avgPrice: '£120' }
  ];
  
  useEffect(() => {
    if (repair) {
      // Remove pound sign from price if it exists
      const cleanPrice = repair.price ? repair.price.toString().replace(/[£,]/g, '') : '';
      setFormData({
        repair: repair.repair || '',
        price: cleanPrice,
        description: repair.description || ''
      });
      setSelectedIconKey(repair.repair || ''); // Store the repair name as key
      setPriceType(repair.price?.toLowerCase().includes('quote') ? 'quote' : 'fixed');
    } else {
      setFormData({
        repair: '',
        price: '',
        description: ''
      });
      setSelectedIconKey('');
      setPriceType('fixed');
    }
  }, [repair]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'price' && priceType === 'fixed') {
      // Remove any non-numeric characters except decimal point
      const numericValue = value.replace(/[^0-9.]/g, '');
      // Ensure only one decimal point
      const parts = numericValue.split('.');
      const formattedValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (name === 'repair') {
      setSelectedIconKey(value); // Store the repair name as key
    }
  };
  
  const handleRepairTypeClick = (repairData) => {
    setFormData(prev => ({
      ...prev,
      repair: repairData.name,
      price: priceType === 'fixed' ? repairData.avgPrice.replace('£', '') : 'Contact for Quote'
    }));
    setSelectedIconKey(repairData.name); // Store the repair name as key
  };
  
  const handlePriceTypeChange = (type) => {
    setPriceType(type);
    if (type === 'quote') {
      setFormData(prev => ({
        ...prev,
        price: 'Contact for Quote'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        price: ''
      }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.repair || !formData.price) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Ensure price is clean (no pound sign) before submitting
    const submitData = {
      ...formData,
      price: priceType === 'fixed' 
        ? formData.price.replace(/[£,]/g, '') 
        : formData.price
    };
    
    onSubmit(submitData);
  };
  
  // Get the icon component based on the selected key
  const getSelectedIcon = () => {
    if (!selectedIconKey) return FaWrench;
    return iconMap[selectedIconKey] || iconMap.default || FaWrench;
  };
  
  // Styles for the form
  const styles = {
    container: {
      backgroundColor: '#fff',
      borderRadius: '1rem',
      maxWidth: '600px',
      margin: '0 auto',
      position: 'relative'
    },
    header: {
      padding: 'clamp(1.5rem, 3vw, 2rem)',
      borderBottom: '2px solid #e5e7eb',
      position: 'relative'
    },
    closeButton: {
      position: 'absolute',
      top: '1.5rem',
      right: '1.5rem',
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
    titleIcon: {
      color: '#3b82f6'
    },
    subtitle: {
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      color: '#64748b',
      marginTop: '0.5rem'
    },
    form: {
      padding: 'clamp(1.5rem, 3vw, 2rem)'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      color: '#374151'
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
      backgroundColor: '#f9fafb',
      transition: 'all 0.2s',
      outline: 'none'
    },
    textarea: {
      width: '100%',
      padding: 'clamp(0.75rem, 2vw, 1rem)',
      border: '2px solid #e5e7eb',
      borderRadius: '0.75rem',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      backgroundColor: '#f9fafb',
      minHeight: '120px',
      resize: 'vertical',
      transition: 'all 0.2s',
      outline: 'none',
      fontFamily: 'inherit'
    },
    iconPreview: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginTop: '0.5rem',
      padding: '0.75rem',
      backgroundColor: '#eff6ff',
      borderRadius: '0.5rem',
      border: '1px solid #dbeafe'
    },
    iconPreviewIcon: {
      fontSize: '1.5rem',
      color: '#3b82f6'
    },
    iconPreviewText: {
      fontSize: '0.875rem',
      color: '#1e40af'
    },
    repairTypesSection: {
      marginBottom: '1.5rem'
    },
    repairTypesLabel: {
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.75rem',
      display: 'block'
    },
    repairTypesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '0.75rem'
    },
    repairTypeButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 'clamp(0.75rem, 2vw, 1rem)',
      border: '2px solid #e5e7eb',
      borderRadius: '0.75rem',
      backgroundColor: '#f9fafb',
      cursor: 'pointer',
      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
      transition: 'all 0.2s',
      gap: '0.5rem',
      textAlign: 'center'
    },
    repairTypeButtonActive: {
      backgroundColor: '#eff6ff',
      borderColor: '#3b82f6',
    },
    repairIcon: {
      fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
      color: '#3b82f6'
    },
    repairPrice: {
      fontSize: 'clamp(0.7rem, 1.2vw, 0.75rem)',
      color: '#10b981',
      fontWeight: '600'
    },
    priceTypeToggle: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '0.75rem'
    },
    priceTypeButton: {
      flex: 1,
      padding: 'clamp(0.5rem, 1.5vw, 0.625rem)',
      border: '2px solid #e5e7eb',
      borderRadius: '0.5rem',
      backgroundColor: '#f9fafb',
      cursor: 'pointer',
      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
      fontWeight: '500',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    priceTypeButtonActive: {
      backgroundColor: '#eff6ff',
      borderColor: '#3b82f6',
      color: '#3b82f6'
    },
    error: {
      color: '#ef4444',
      padding: '0.75rem 1rem',
      backgroundColor: '#fee2e2',
      borderRadius: '0.5rem',
      border: '1px solid #fecaca',
      marginBottom: '1.5rem',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)'
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
      paddingTop: '1.5rem',
      borderTop: '2px solid #e5e7eb'
    },
    cancelButton: {
      padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '0.75rem',
      cursor: 'pointer',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      fontWeight: '600',
      transition: 'all 0.2s'
    },
    submitButton: {
      padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '0.75rem',
      cursor: 'pointer',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      fontWeight: '600',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }
  };
  
  const SelectedIcon = getSelectedIcon();
  
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
          <FaWrench style={styles.titleIcon} />
          {repair ? 'Edit Repair Service' : 'Add New Repair Service'}
        </h2>
        <p style={styles.subtitle}>
          Configure repair service details and pricing
        </p>
      </div>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <div style={styles.error}>{error}</div>}
        
        <div style={styles.repairTypesSection}>
          <label style={styles.repairTypesLabel}>Quick Select Common Repairs:</label>
          <div style={styles.repairTypesGrid}>
            {commonRepairs.map(repairType => {
              const RepairIcon = repairType.icon;
              const isActive = formData.repair === repairType.name;
              
              return (
                <button
                  key={repairType.name}
                  type="button"
                  onClick={() => handleRepairTypeClick(repairType)}
                  style={{
                    ...styles.repairTypeButton,
                    ...(isActive ? styles.repairTypeButtonActive : {})
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }
                  }}
                >
                  <RepairIcon style={styles.repairIcon} />
                  <span>{repairType.name}</span>
                  <span style={styles.repairPrice}>{repairType.avgPrice}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="repair" style={styles.label}>
            Repair Type <span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="repair"
            name="repair"
            value={formData.repair}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="e.g., Screen Replacement"
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          {selectedIconKey && SelectedIcon && (
            <div style={styles.iconPreview}>
              <SelectedIcon style={styles.iconPreviewIcon} />
              <span style={styles.iconPreviewText}>Icon preview for this repair type</span>
            </div>
          )}
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="price" style={styles.label}>
            Price <span style={styles.required}>*</span>
          </label>
          <div style={styles.priceTypeToggle}>
            <button
              type="button"
              onClick={() => handlePriceTypeChange('fixed')}
              style={{
                ...styles.priceTypeButton,
                ...(priceType === 'fixed' ? styles.priceTypeButtonActive : {})
              }}
            >
              <FaDollarSign /> Fixed Price
            </button>
            <button
              type="button"
              onClick={() => handlePriceTypeChange('quote')}
              style={{
                ...styles.priceTypeButton,
                ...(priceType === 'quote' ? styles.priceTypeButtonActive : {})
              }}
            >
              <FaAlignLeft /> Quote Required
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            {priceType === 'fixed' && formData.price && (
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                color: '#6b7280',
                pointerEvents: 'none',
                zIndex: 1
              }}>£</span>
            )}
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              style={{
                ...styles.input,
                paddingLeft: priceType === 'fixed' && formData.price ? '28px' : '12px'
              }}
              placeholder={priceType === 'fixed' ? "120.00" : "Contact for Quote"}
              disabled={priceType === 'quote'}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            style={styles.textarea}
            placeholder="Add any additional details about this repair service..."
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>
        
        <div style={styles.actions}>
          <button 
            type="button" 
            onClick={onCancel} 
            style={styles.cancelButton}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            style={styles.submitButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FaSave />
            {repair ? 'Update Repair' : 'Add Repair'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RepairForm;