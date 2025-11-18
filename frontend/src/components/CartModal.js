// src/components/CartModal.js
import React, { useState, useEffect } from 'react';
import { FaTrash, FaShoppingCart, FaTimes, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Custom hook to detect mobile screens
function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}

function CartModal({ show, onClose }) {
  const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();
  const isMobile = useIsMobile();
  const [removingItems, setRemovingItems] = useState(new Set());

  if (!show) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRemoveItem = (itemId) => {
    // Add removing animation
    setRemovingItems(prev => new Set(prev).add(itemId));
    
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 300);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
    }
  };

  const formattedTotalPrice = totalPrice.toFixed(2);

  return (
    <>
      {/* Add custom styles */}
      <style>
        {`
          @keyframes cartModalSlideIn {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes cartBackdropFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideOutRight {
            from {
              opacity: 1;
              transform: translateX(0);
            }
            to {
              opacity: 0;
              transform: translateX(100px);
            }
          }
          
          .cart-modal-backdrop {
            animation: cartBackdropFadeIn 0.2s ease-out;
          }
          
          .cart-modal-content {
            animation: cartModalSlideIn 0.3s ease-out;
          }
          
          .cart-item {
            transition: all 0.3s ease;
          }
          
          .cart-item.removing {
            animation: slideOutRight 0.3s ease-out forwards;
          }
          
          .cart-item:hover {
            background-color: #f8fbff !important;
            transform: translateX(-2px);
          }
          
          .remove-btn:hover {
            background-color: #fee2e2 !important;
            border-color: #dc2626 !important;
            color: #dc2626 !important;
            transform: scale(1.05);
          }
          
          .clear-btn:hover {
            background-color: #fee2e2 !important;
            border-color: #dc2626 !important;
            color: #dc2626 !important;
          }
          
          .book-btn:hover {
            background-color: #1d4ed8 !important;
            transform: translateY(-1px);
            box-shadow: 0 8px 20px rgba(30, 58, 138, 0.3) !important;
          }
          
          .close-btn:hover {
            background-color: #fee2e2 !important;
            color: #dc2626 !important;
          }
        `}
      </style>

      <div
        className="cart-modal-backdrop"
        style={backdropStyle}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-modal-title"
      >
        <div className="cart-modal-content" style={{
          ...modalContentStyle,
          width: isMobile ? '95%' : '520px',
          maxHeight: isMobile ? '95vh' : '85vh',
        }}>
          {/* Enhanced Header */}
          <div style={headerStyle}>
            <div style={headerContentStyle}>
              <div style={cartIconStyle}>
                <FaShoppingCart size={24} color="white" />
              </div>
              <div>
                <h2 id="cart-modal-title" style={titleStyle}>My Cart</h2>
                <p style={itemCountStyle}>
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              className="close-btn"
              style={closeButtonStyle}
              onClick={onClose}
              aria-label="Close cart"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Cart Content */}
          {cartItems.length === 0 ? (
            <div style={emptyCartContainerStyle}>
              <div style={emptyCartIconStyle}>
                <FaShoppingCart size={64} color="#D1D5DB" />
              </div>
              <h3 style={emptyCartTitleStyle}>Your cart is empty</h3>
              <p style={emptyCartTextStyle}>
                Add some repairs to get started with your booking
              </p>
              <button
                style={continueShoppingStyle}
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div style={itemsContainerStyle}>
                <div style={itemsListStyle}>
                  {cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className={`cart-item ${removingItems.has(item.id) ? 'removing' : ''}`}
                      style={{
                        ...itemRowStyle,
                        padding: isMobile ? '1rem' : '1.25rem',
                      }}
                    >
                      {item.image && (
                        <div style={imageContainerStyle}>
                          <img 
                            src={item.image} 
                            alt="" 
                            style={{
                              ...itemImageStyle,
                              width: isMobile ? '50px' : '60px',
                              height: isMobile ? '50px' : '60px',
                            }} 
                          />
                        </div>
                      )}
                      
                      <div style={{
                        ...itemDetailsStyle,
                        flex: 1,
                        minWidth: 0,
                      }}>
                        <h4 style={itemNameStyle}>{item.name}</h4>
                        <div style={itemMetaStyle}>
                          <span style={itemPriceStyle}>£{item.cost.toFixed(2)}</span>
                          <FaCheckCircle size={14} style={{ color: '#10B981', marginLeft: '0.5rem' }} />
                        </div>
                      </div>
                      
                      <button
                        className="remove-btn"
                        style={removeButtonStyle}
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Total Section */}
              <div style={totalSectionStyle}>
                <div style={totalRowStyle}>
                  <span style={totalLabelStyle}>Subtotal:</span>
                  <span style={totalAmountStyle}>£{formattedTotalPrice}</span>
                </div>
                <div style={totalInfoStyle}>
                  <p style={totalInfoTextStyle}>
                    💡 Final pricing will be confirmed after device inspection
                  </p>
                </div>
              </div>

              {/* Enhanced Footer Actions */}
              <div style={footerStyle}>
                <div style={{
                  ...actionsContainerStyle,
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '0.75rem' : '1rem',
                }}>
                  <button
                    className="clear-btn"
                    style={{
                      ...clearCartButtonStyle,
                      width: isMobile ? '100%' : 'auto',
                    }}
                    onClick={handleClearCart}
                    disabled={cartItems.length === 0}
                  >
                    <FaTrash style={{ marginRight: '0.5rem' }} size={14} />
                    Clear Cart
                  </button>

                  <Link 
                    to="/booking" 
                    className="book-btn"
                    style={{
                      ...bookRepairButtonStyle,
                      width: isMobile ? '100%' : 'auto',
                      textAlign: 'center',
                    }} 
                    onClick={onClose}
                  >
                    Book Repairs
                    <FaArrowRight style={{ marginLeft: '0.5rem' }} size={14} />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ===== ENHANCED STYLES =====
const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(30, 58, 138, 0.1)',
  backdropFilter: 'blur(8px)',
  zIndex: 1050,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1rem',
};

const modalContentStyle = {
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
  borderRadius: '20px',
  maxWidth: '100%',
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '0 25px 50px rgba(30, 58, 138, 0.15), 0 0 0 1px rgba(30, 58, 138, 0.05)',
  border: '1px solid rgba(30, 58, 138, 0.1)',
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle = {
  background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
  color: 'white',
  padding: '1.5rem 2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
};

const headerContentStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  flex: 1,
};

const cartIconStyle = {
  width: '50px',
  height: '50px',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
};

const titleStyle = {
  margin: '0 0 0.25rem 0',
  fontSize: '1.4rem',
  fontWeight: '600',
  color: 'white',
};

const itemCountStyle = {
  margin: 0,
  fontSize: '0.9rem',
  color: 'rgba(255, 255, 255, 0.8)',
  fontWeight: '400',
};

const closeButtonStyle = {
  background: 'rgba(255, 255, 255, 0.15)',
  border: 'none',
  borderRadius: '8px',
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'white',
  transition: 'all 0.2s ease',
  backdropFilter: 'blur(10px)',
};

const emptyCartContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem 2rem',
  textAlign: 'center',
  minHeight: '300px',
};

const emptyCartIconStyle = {
  marginBottom: '1.5rem',
  opacity: 0.5,
};

const emptyCartTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#1E3A8A',
  margin: '0 0 0.5rem 0',
};

const emptyCartTextStyle = {
  fontSize: '1rem',
  color: '#6B7280',
  margin: '0 0 2rem 0',
  lineHeight: 1.5,
};

const continueShoppingStyle = {
  background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  padding: '0.75rem 2rem',
  fontSize: '1rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)',
};

const itemsContainerStyle = {
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const itemsListStyle = {
  flex: 1,
  overflowY: 'auto',
  maxHeight: '400px',
};

const itemRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  borderBottom: '1px solid rgba(30, 58, 138, 0.05)',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
};

const imageContainerStyle = {
  flexShrink: 0,
};

const itemImageStyle = {
  objectFit: 'cover',
  borderRadius: '12px',
  border: '2px solid rgba(30, 58, 138, 0.1)',
  backgroundColor: '#f8fbff',
};

const itemDetailsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const itemNameStyle = {
  fontSize: '1rem',
  fontWeight: '500',
  color: '#1E3A8A',
  margin: 0,
  lineHeight: 1.3,
};

const itemMetaStyle = {
  display: 'flex',
  alignItems: 'center',
};

const itemPriceStyle = {
  fontSize: '1.1rem',
  fontWeight: '600',
  color: '#059669',
};

const removeButtonStyle = {
  background: 'rgba(239, 68, 68, 0.1)',
  color: '#EF4444',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  borderRadius: '8px',
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  flexShrink: 0,
};

const totalSectionStyle = {
  background: 'linear-gradient(135deg, #f8fbff 0%, #e8f0fe 100%)',
  padding: '1.5rem 2rem',
  borderTop: '1px solid rgba(30, 58, 138, 0.1)',
  flexShrink: 0,
};

const totalRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
};

const totalLabelStyle = {
  fontSize: '1.2rem',
  fontWeight: '500',
  color: '#1E3A8A',
};

const totalAmountStyle = {
  fontSize: '1.5rem',
  fontWeight: '700',
  color: '#1E3A8A',
};

const totalInfoStyle = {
  borderTop: '1px solid rgba(30, 58, 138, 0.1)',
  paddingTop: '1rem',
};

const totalInfoTextStyle = {
  fontSize: '0.85rem',
  color: '#6B7280',
  margin: 0,
  textAlign: 'center',
  lineHeight: 1.4,
};

const footerStyle = {
  background: 'white',
  padding: '1.5rem 2rem',
  borderTop: '1px solid rgba(30, 58, 138, 0.1)',
  flexShrink: 0,
};

const actionsContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const clearCartButtonStyle = {
  background: 'rgba(239, 68, 68, 0.1)',
  color: '#EF4444',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  borderRadius: '10px',
  padding: '0.75rem 1.5rem',
  fontSize: '0.9rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const bookRepairButtonStyle = {
  background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  padding: '0.75rem 2rem',
  fontSize: '1rem',
  fontWeight: '500',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)',
};

export default CartModal;