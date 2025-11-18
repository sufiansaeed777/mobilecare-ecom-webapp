// src/components/CartIcon.js
import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext'; // your cart context

function CartIcon({ onClick }) {
  // Access cart items from your CartContext
  const { cartItems } = useCart();

  // We'll just show an icon + (optional) item count badge
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        background: 'none',
        border: '1px solid #000',
        borderRadius: '4px',
        padding: '0.4rem 0.6rem',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer'
      }}
    >
      <FaShoppingCart size={20} />
      
      {/* If you want to show how many items in the cart */}
      {cartItems.length > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'red',
            color: '#fff',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '0.8rem',
          }}
        >
          {cartItems.length}
        </span>
      )}
    </button>
  );
}

export default CartIcon;
