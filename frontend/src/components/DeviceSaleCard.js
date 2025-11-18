// src/components/DeviceSaleCard.js
import React, { useState } from 'react';
import { FaShieldAlt, FaInfoCircle, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

function DeviceSaleCard({ device, onDetailsClick }) {
    const [isHovered, setIsHovered] = useState(false);
    const { addToCart } = useCart();

    const formatPrice = (price) => `£${price}`;

    const conditionColors = {
        'New': '#10b981',
        'Excellent': '#3b82f6',
        'Very Good': '#60a5fa',
        'Good': '#93c5fd',
        'Fair': '#fbbf24'
    };

    const handleQuickAdd = (e) => {
        e.stopPropagation();
        
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
                background-color: #1E3A8A;
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
    };

    const isOutOfStock = device.stockStatus === 'Out of Stock';

    return (
        <div
            style={{
                ...cardStyle,
                transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                boxShadow: isHovered ? '0 10px 30px rgba(30, 58, 138, 0.15)' : '0 5px 15px rgba(30, 58, 138, 0.08)',
                opacity: isOutOfStock ? 0.7 : 1,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Section */}
            <div style={imageContainerStyle}>
                {device.image ? (
                    <img
                        src={device.image}
                        alt={device.name}
                        style={imageStyle}
                        loading="lazy"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div style={{ ...placeholderStyle, display: device.image ? 'none' : 'flex' }}>
                    <span>No Image</span>
                </div>
                {isOutOfStock && (
                    <div style={outOfStockOverlayStyle}>
                        <span>Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div style={contentStyle}>
                <h3 style={nameStyle}>{device.name}</h3>
                
                {/* Condition Badge */}
                <div style={conditionBadgeStyle(conditionColors[device.condition])}>
                    <FaShieldAlt size={12} />
                    <span>{device.condition}</span>
                </div>

                {/* Price and Type */}
                <div style={priceContainerStyle}>
                    <span style={priceStyle}>{formatPrice(device.price)}</span>
                    <span style={deviceTypeStyle}>{device.deviceType}</span>
                </div>

                {/* Action Buttons */}
                <div style={actionButtonsStyle}>
                    <button
                        style={detailsButtonStyle}
                        onClick={() => onDetailsClick(device)}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                        <FaInfoCircle size={14} />
                        <span>Details</span>
                    </button>
                    <button
                        style={isOutOfStock ? quickAddButtonDisabledStyle : quickAddButtonStyle}
                        onClick={handleQuickAdd}
                        disabled={isOutOfStock}
                        onMouseOver={(e) => !isOutOfStock && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                        onMouseOut={(e) => !isOutOfStock && (e.currentTarget.style.backgroundColor = '#1E3A8A')}
                    >
                        <FaShoppingCart size={14} />
                        <span>{isOutOfStock ? 'Out of Stock' : 'Add'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// Styles
const cardStyle = { backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', height: '100%' };
const imageContainerStyle = { position: 'relative', height: '220px', backgroundColor: '#f8fbff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' };
const imageStyle = { width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' };
const placeholderStyle = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', color: '#9ca3af', fontSize: '0.9rem' };
const outOfStockOverlayStyle = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: '600' };
const contentStyle = { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1 };
const nameStyle = { fontSize: '1rem', fontWeight: '600', color: '#1E3A8A', lineHeight: 1.4, minHeight: '2.8rem' };
const conditionBadgeStyle = (color) => ({ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: color, color: '#fff', padding: '0.25rem 0.6rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: '500', alignSelf: 'flex-start' });
const priceContainerStyle = { display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: 'auto' };
const priceStyle = { fontSize: '1.5rem', fontWeight: '700', color: '#1E3A8A' };
const deviceTypeStyle = { fontSize: '0.85rem', color: '#6b7280' };
const actionButtonsStyle = { display: 'flex', gap: '0.5rem', marginTop: '0.75rem' };
const detailsButtonStyle = { flex: 1, backgroundColor: '#ffffff', color: '#1E3A8A', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.5rem', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' };
const quickAddButtonStyle = { flex: 1, backgroundColor: '#1E3A8A', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' };
const quickAddButtonDisabledStyle = { ...quickAddButtonStyle, backgroundColor: '#9ca3af', cursor: 'not-allowed' };

export default DeviceSaleCard;