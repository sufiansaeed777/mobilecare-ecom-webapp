// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add a repair item to the cart
  function addToCart(item) {
    setCartItems((prev) => [...prev, item]);
  }

  // Remove a repair item from the cart
  function removeFromCart(itemId) {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  // Clear the cart
  function clearCart() {
    setCartItems([]);
  }

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.cost, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
