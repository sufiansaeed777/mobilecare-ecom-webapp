// src/components/RepairsModal.js
import React from 'react';
import { useCart } from '../context/CartContext';
import {
  FaPlus, FaWrench, FaFan, FaPlug, FaPowerOff, FaCompactDisc,
  FaTv, FaUsb, FaGamepad, FaTools, FaCameraRetro, FaCamera,
  FaFlask, FaDatabase, FaTimes
} from 'react-icons/fa';

// Icon map
const iconMap = {
  "Digitizer": FaTools, "Battery Replacement": FaPlug, "Battery Replacment": FaPlug,
  "Inner screen": FaTv, "Inner Screen Replacment": FaTv, "Screen Replacment": FaTv,
  "Charging port repair": FaPlug, "Charging Port repair": FaPlug, "Charging Port Repair": FaPlug,
  "Audio Repair": FaUsb, "Camera Repair": FaCameraRetro, "Cameras": FaCamera,
  "Camera Lens": FaCompactDisc, "Diagnostics": FaTools, "Device not turning on": FaPowerOff,
  "Repair Quotation": FaPlus, "Liquid Diagnostics": FaFlask, "Data Recovery": FaDatabase,
  "Overheating/Fan Noise": FaFan, "Overheating": FaFan, "HDMI Port Repair": FaPlug,
  "HDMI Port Replacement": FaPlug, "Console Not Turning On": FaPowerOff,
  "Unable to Insert/ Eject Disc": FaCompactDisc, "No Video Output": FaTv, "USB Repair": FaUsb,
  "Unable to update": FaTools, "Stuck Safe Mode": FaTools, "Blue Light of Death": FaPowerOff,
  "Disc Not Recognised": FaCompactDisc, "Unable to Connect to Internet": FaPowerOff,
  "Loading Screen Stuck": FaTools, "Controller Not Syncing": FaGamepad,
  "System Error (e.g E101)": FaPowerOff, "Screen Replacement": FaTv,
  "Digitizer Repair": FaTools, "Card Slot Repair": FaGamepad,
  default: FaWrench
};

function RepairsModal({ show, onClose, watchModel, isLoading, error }) {
  const { addToCart } = useCart();

  if (!show) return null;

  // Simple fly-to-cart animation
  const flyToCart = (startElem) => {
    const cartIconDesktop = document.getElementById('cart-icon-desktop');
    const cartIconMobile = document.getElementById('cart-icon-mobile');

    let targetCartIcon = null;

    if (cartIconDesktop && cartIconDesktop.offsetParent !== null && cartIconDesktop.getBoundingClientRect().width > 0) {
        targetCartIcon = cartIconDesktop;
    } else if (cartIconMobile && cartIconMobile.offsetParent !== null && cartIconMobile.getBoundingClientRect().width > 0) {
        targetCartIcon = cartIconMobile;
    }

    if (!targetCartIcon || !startElem) {
        console.warn("Fly-to-cart: Could not find a visible target cart icon or start element.");
        return;
    }

    const startRect = startElem.getBoundingClientRect();
    const endRect = targetCartIcon.getBoundingClientRect();

    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top + endRect.height / 2;

    const duration = 700;
    let startTime;

    // Create simple floating element matching website theme
    const flyElem = document.createElement('div');
    flyElem.innerHTML = `
      <div style="
        position: fixed;
        background: #1E3A8A;
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        pointer-events: none;
        z-index: 999999;
        box-shadow: 0 4px 8px rgba(30, 58, 138, 0.3);
      ">+1</div>
    `;
    const flyingItem = flyElem.firstElementChild;

    flyingItem.style.left = `${startX - 14}px`;
    flyingItem.style.top = `${startY - 14}px`;
    document.body.appendChild(flyingItem);

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / duration, 1);

      const currentX = (1 - t) * startX + t * endX;
      const currentY = (1 - t) * startY + t * endY;

      const scale = 1 - 0.7 * t;
      flyingItem.style.left = `${currentX - 14 * scale}px`;
      flyingItem.style.top = `${currentY - 14 * scale}px`;
      flyingItem.style.transform = `scale(${scale})`;
      flyingItem.style.opacity = `${1 - t}`;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        if (flyingItem.parentNode) {
          flyingItem.parentNode.removeChild(flyingItem);
        }
        window.dispatchEvent(new Event('cartPulse'));
      }
    };

    requestAnimationFrame(animate);
  };

  const handleAddRepair = (repair, e) => {
    const cartItem = {
      id: `${watchModel.name}-${repair.repair}-${Date.now()}`,
      name: `${watchModel.name} - ${repair.repair}`,
      cost: parseFloat(String(repair.price).replace(/[^0-9.]/g, '')) || 0,
      image: watchModel.image,
    };
    addToCart(cartItem);
    flyToCart(e.currentTarget);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      style={backdropStyle}
      onClick={handleBackdropClick}
    >
      <div
        style={modalContentStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clean Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            Repairs for {watchModel?.name || 'Selected Device'}
          </h2>
          <button
            onClick={onClose}
            style={closeButtonStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
            aria-label="Close repairs modal"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {isLoading ? (
            <div style={loadingStateStyle}>
              <p>Loading repairs...</p>
            </div>
          ) : error ? (
            <div style={errorStateStyle}>
              <p>Error loading repairs: {error}</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                Please try again or contact us for assistance.
              </p>
            </div>
          ) : !watchModel?.repairs || watchModel.repairs.length === 0 ? (
            <p style={emptyStateStyle}>
              No specific repairs listed for this device. Please contact us for details.
            </p>
          ) : (
            <ul style={repairListStyle}>
              {watchModel.repairs.map((repair, index) => {
                const RepairIcon = iconMap[repair.repair] || iconMap.default;
                const displayPrice = repair.price 
                  ? (String(repair.price).toLowerCase().includes('quote') 
                    ? repair.price 
                    : `£${String(repair.price).replace(/[£,]/g, '')}`)
                  : 'Inquire';
                
                return (
                  <li 
                    key={index}
                    style={{
                      ...repairItemStyle,
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fbff',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#e8f0fe';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8fbff';
                    }}
                  >
                    <div style={repairInfoStyle}>
                      <RepairIcon size={20} style={{ color: '#1E3A8A', marginRight: '0.75rem' }} />
                      <span style={repairNameStyle}>{repair.repair}</span>
                    </div>
                    <div style={repairActionsStyle}>
                      <strong style={repairPriceStyle}>{displayPrice}</strong>
                      <button
                        style={addButtonStyle}
                        onClick={(e) => handleAddRepair(repair, e)}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor='#1d4ed8'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor='#1E3A8A'}
                        aria-label={`Add ${repair.repair} repair to cart`}
                      >
                        <FaPlus size={14}/>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Simple Footer */}
        <div style={footerStyle}>
          <button
            style={footerButtonStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== CLEAN STYLES MATCHING WEBSITE THEME =====
const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(3px)',
};

const modalContentStyle = {
  background: '#fff',
  borderRadius: '12px',
  width: '450px',
  maxWidth: '90%',
  maxHeight: '85vh',
  overflowY: 'auto',
  position: 'relative',
  color: '#1f2937',
  boxShadow: '0 5px 25px rgba(0,0,0,0.15)',
  border: '1px solid #e5e7eb',
};

const headerStyle = {
  padding: '1.5rem 2rem',
  borderBottom: '1px solid #e5e7eb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#f8fbff',
};

const titleStyle = {
  margin: 0,
  fontSize: '1.3rem',
  fontWeight: '600',
  color: '#1E3A8A',
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '1.2rem',
  cursor: 'pointer',
  color: '#6b7280',
  padding: '0.5rem',
  borderRadius: '6px',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const contentStyle = {
  padding: '0',
  maxHeight: 'calc(85vh - 140px)',
  overflowY: 'auto',
};

const emptyStateStyle = {
  textAlign: 'center',
  color: '#6b7280',
  padding: '2rem',
  fontSize: '1rem',
  lineHeight: 1.5,
};

const loadingStateStyle = {
  textAlign: 'center',
  color: '#1E3A8A',
  padding: '3rem',
  fontSize: '1rem',
};

const errorStateStyle = {
  textAlign: 'center',
  color: '#dc2626',
  padding: '2rem',
  fontSize: '1rem',
  lineHeight: 1.5,
};

const repairListStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const repairItemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem 1.5rem',
  borderBottom: '1px solid #e5e7eb',
  transition: 'background-color 0.2s ease',
};

const repairInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  flex: 1,
};

const repairNameStyle = {
  fontSize: '1rem',
  fontWeight: '500',
  color: '#1f2937',
};

const repairActionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
};

const repairPriceStyle = {
  color: '#1E3A8A',
  fontSize: '0.95rem',
  minWidth: '70px',
  textAlign: 'right',
};

const addButtonStyle = {
  backgroundColor: '#1E3A8A',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  width: '28px',
  height: '28px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const footerStyle = {
  padding: '1.5rem 2rem',
  borderTop: '1px solid #e5e7eb',
  backgroundColor: '#ffffff',
  display: 'flex',
  justifyContent: 'center',
};

const footerButtonStyle = {
  background: '#ffffff',
  color: '#1f2937',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '0.7rem 1.5rem',
  fontSize: '0.95rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

export default RepairsModal;