// src/components/DeviceSaleDetailModal.js
import React from 'react';
import {
    FaTimes,
    FaShoppingCart,
    FaTag,
    FaMobileAlt,
    FaRulerCombined,
    FaPalette,
    FaShieldAlt,
    FaInfoCircle,
    FaBoxOpen,
    FaListUl
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const DeviceSaleDetailModal = ({ device, show, onClose }) => {
    const { addToCart } = useCart();

    if (!show || !device) {
        return null;
    }

    const handleAddToCart = (e) => {
        // Create flying item animation
        const button = e.currentTarget;
        const buttonRect = button.getBoundingClientRect();
        const cartIcon = document.querySelector('#cart-icon-desktop') || document.querySelector('#cart-icon-mobile');
        
        if (cartIcon) {
            const cartRect = cartIcon.getBoundingClientRect();
            
            // Create flying element
            const flyingItem = document.createElement('div');
            flyingItem.style.cssText = `
                position: fixed;
                z-index: 9999;
                width: 40px;
                height: 40px;
                background-color: #28a745;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: none;
                left: ${buttonRect.left + buttonRect.width / 2 - 20}px;
                top: ${buttonRect.top + buttonRect.height / 2 - 20}px;
                transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            `;
            
            // Add cart icon to flying element
            flyingItem.innerHTML = '<svg style="width: 20px; height: 20px; fill: white;" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>';
            
            document.body.appendChild(flyingItem);
            
            // Force browser to calculate initial position
            void flyingItem.offsetHeight;
            
            // Animate to cart
            flyingItem.style.transform = `translate(${cartRect.left - buttonRect.left - buttonRect.width / 2 + cartRect.width / 2}px, ${cartRect.top - buttonRect.top - buttonRect.height / 2 + cartRect.height / 2}px) scale(0.3)`;
            flyingItem.style.opacity = '0';
            
            // Remove element after animation
            setTimeout(() => {
                flyingItem.remove();
            }, 800);
        }
        
        // Add item to cart
        const cartItem = {
            id: `${device._id}-${Date.now()}`,
            name: device.name,
            cost: device.price,
            image: device.image,
            type: 'product',
            condition: device.condition,
            deviceType: device.deviceType
        };
        addToCart(cartItem);
        
        // Trigger cart pulse animation
        window.dispatchEvent(new Event('cartPulse'));
        
        // Show success feedback
        const originalText = button.innerHTML;
        button.innerHTML = '<svg style="width: 20px; height: 20px; fill: white; margin-right: 10px;" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg> Added!';
        button.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.backgroundColor = '#1E3A8A';
        }, 1500);
        
        // Close modal after a short delay
        setTimeout(() => {
            onClose();
        }, 1000);
    };

    const getConditionTextStyle = (condition) => {
        let color = '#495057'; // Default
        if (condition) {
            const lowerCondition = condition.toLowerCase();
            if (lowerCondition === 'new') color = '#155724';
            else if (lowerCondition === 'excellent') color = '#004085';
            else if (lowerCondition === 'good') color = '#856404';
            else if (lowerCondition === 'fair') color = '#721c24';
        }
        return { fontWeight: '600', color };
    };

    const stockStatusStyle = {
        fontWeight: '600',
        color: device.stockStatus?.toLowerCase() === 'in stock' ? '#28a745' : (device.stockStatus?.toLowerCase() === 'low stock' ? '#ffc107' : '#dc3545')
    };

    const isOutOfStock = device.stockStatus === 'Out of Stock';

    return (
        <div style={modalOverlayStyle} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="deviceDetailModalTitle">
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={closeButtonStyle} aria-label="Close device details modal">
                    <FaTimes />
                </button>

                <div style={modalBodyStyle}>
                    <div style={imageSectionStyle}>
                        {device.image ? (
                            <img src={device.image} alt={device.name} style={modalImageStyle} />
                        ) : (
                            <div style={modalPlaceholderImageStyle}><FaMobileAlt style={{ fontSize: '4rem', opacity: 0.4 }}/></div>
                        )}
                    </div>

                    <div style={detailsSectionStyle}>
                        <h2 id="deviceDetailModalTitle" style={deviceNameStyle}>{device.name}</h2>
                        {device.brand && <p style={brandNameStyle}><FaTag style={detailIconStyle} /> {device.brand}</p>}

                        <div style={priceAndStockRowStyle}>
                            <p style={priceTagStyle}>£{device.price}</p>
                            {device.stockStatus && (
                                <p style={stockStatusStyle}><FaBoxOpen style={detailIconStyle} /> {device.stockStatus}</p>
                            )}
                        </div>

                        <div style={infoGridStyle}>
                            <div style={infoItemStyle}>
                                <FaShieldAlt style={detailIconStyle} />
                                <div>
                                    <span style={infoLabelStyle}>Condition</span>
                                    <span style={getConditionTextStyle(device.condition)}>{device.condition}</span>
                                </div>
                            </div>
                            {device.deviceType && (
                                <div style={infoItemStyle}>
                                    <FaInfoCircle style={detailIconStyle} />
                                    <div>
                                        <span style={infoLabelStyle}>Type</span>
                                        <span>{device.deviceType}</span>
                                    </div>
                                </div>
                            )}
                            {device.storage && (
                                <div style={infoItemStyle}>
                                    <FaRulerCombined style={detailIconStyle} />
                                    <div>
                                        <span style={infoLabelStyle}>Storage</span>
                                        <span>{device.storage}</span>
                                    </div>
                                </div>
                            )}
                            {device.color && (
                                <div style={infoItemStyle}>
                                    <FaPalette style={detailIconStyle} />
                                    <div>
                                        <span style={infoLabelStyle}>Color</span>
                                        <span>{device.color}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {device.description && (
                            <div style={descriptionSectionStyle}>
                                <h4 style={sectionTitleStyle}>Description</h4>
                                <p style={descriptionTextStyle}>{device.description}</p>
                            </div>
                        )}

                        {device.keyFeatures && device.keyFeatures.length > 0 && (
                            <div style={featuresSectionStyle}>
                                <h4 style={sectionTitleStyle}><FaListUl style={{marginRight: '8px'}}/>Key Features</h4>
                                <ul style={featuresListStyle}>
                                    {device.keyFeatures.map((feature, index) => (
                                        <li key={index} style={featureItemStyle}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div style={modalFooterStyle}>
                    <button 
                        style={isOutOfStock ? addToCartButtonDisabledStyle : addToCartButtonStyle} 
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                    >
                        <FaShoppingCart style={{ marginRight: '10px' }}/> 
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Styles for DeviceSaleDetailModal
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
    fontFamily: "'Poppins', sans-serif",
};

const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    color: '#1E3A8A',
};

const closeButtonStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    color: '#888',
    cursor: 'pointer',
    padding: '0.5rem',
    transition: 'color 0.2s ease'
};

const modalBodyStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    '@media (min-width: 600px)': {
        flexDirection: 'row',
    }
};

const imageSectionStyle = {
    flex: '1 1 40%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '1rem',
    border: '1px solid #e9ecef',
    minHeight: '250px',
};

const modalImageStyle = {
    maxWidth: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    borderRadius: '8px',
};

const modalPlaceholderImageStyle = {
    width: '100%',
    height: '250px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#adb5bd',
    backgroundColor: '#e9ecef',
    borderRadius: '8px',
};

const detailsSectionStyle = {
    flex: '1 1 60%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
};

const deviceNameStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: '0.25rem',
    lineHeight: 1.2,
};

const brandNameStyle = {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#555',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
};

const priceAndStockRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.75rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #e9ecef',
};

const priceTagStyle = {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1E3A8A',
};

const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '0.75rem',
    marginBottom: '0.5rem',
};

const infoItemStyle = {
    backgroundColor: '#f8f9fa',
    padding: '0.6rem 0.8rem',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
};

const infoLabelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    color: '#6c757d',
    marginBottom: '0.15rem',
    fontWeight: '500',
};

const detailIconStyle = {
    color: '#1E3A8A',
    opacity: 0.8,
    fontSize: '1rem',
    marginRight: '0.2rem',
};

const sectionTitleStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: '0.5rem',
    paddingBottom: '0.3rem',
    borderBottom: '2px solid #e0e7ff',
    display: 'flex',
    alignItems: 'center',
};

const descriptionSectionStyle = {
    marginTop: '0.5rem',
};

const descriptionTextStyle = {
    fontSize: '0.9rem',
    lineHeight: 1.6,
    color: '#3B5998',
    whiteSpace: 'pre-wrap',
};

const featuresSectionStyle = {
    marginTop: '0.5rem',
};

const featuresListStyle = {
    listStyle: 'none',
    paddingLeft: 0,
    margin: 0,
};

const featureItemStyle = {
    fontSize: '0.9rem',
    color: '#3B5998',
    marginBottom: '0.3rem',
    paddingLeft: '1.5rem',
    position: 'relative',
    lineHeight: 1.5,
};
// Add bullet point before each feature
featureItemStyle['::before'] = {
    content: '"•"',
    position: 'absolute',
    left: '0.5rem',
    color: '#1E3A8A',
    fontWeight: 'bold',
};

const modalFooterStyle = {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e9ecef',
    display: 'flex',
    justifyContent: 'flex-end',
};

const addToCartButtonStyle = {
    backgroundColor: '#1E3A8A',
    color: '#fff',
    border: 'none',
    padding: '0.8rem 1.8rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    fontFamily: "'Poppins', sans-serif",
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const addToCartButtonDisabledStyle = {
    ...addToCartButtonStyle,
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
};

export default DeviceSaleDetailModal;