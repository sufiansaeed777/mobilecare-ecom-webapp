// src/pages/Cart.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, removeFromCart, totalPrice, clearCart } = useCart();

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto' }}>
      <h2 style={{ color: '#1a73e8' }}>My Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty. Go select some repairs!</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cartItems.map((item, idx) => (
              <li
                key={`${item.id}-${idx}`}
                style={{
                  border: '1px solid #c2d7f8',
                  padding: '1rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                }}
              >
                <div>
                  <strong style={{ color: '#333' }}>{item.name}</strong>
                </div>
                <div>
                  <span style={{ color: '#1a73e8', fontWeight: '500' }}>£{item.cost}</span>
                  <button
                    style={{
                      marginLeft: '1rem',
                      background: '#1a73e8',
                      color: '#fff',
                      border: 'none',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'background 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#0d47a1'}
                    onMouseOut={(e) => e.target.style.background = '#1a73e8'}
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <h3 style={{ color: '#1a73e8' }}>Total: £{totalPrice}</h3>

          <div style={{ marginTop: '1rem' }}>
            <button 
              onClick={clearCart} 
              style={{ 
                marginRight: '1rem',
                background: '#fff',
                color: '#1a73e8',
                padding: '0.5rem 1rem',
                border: '1px solid #1a73e8',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#e8f0fe';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#fff';
              }}
            >
              Clear Cart
            </button>

            {/* "Book a Repair" leads to booking page */}
            <Link
              to="/booking"
              style={{
                display: 'inline-block',
                background: '#1a73e8',
                color: '#fff',
                padding: '0.5rem 1rem',
                textDecoration: 'none',
                borderRadius: '4px',
                border: '1px solid #1a73e8',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#0d47a1';
                e.target.style.borderColor = '#0d47a1';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#1a73e8';
                e.target.style.borderColor = '#1a73e8';
              }}
            >
              Book a Repair
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;