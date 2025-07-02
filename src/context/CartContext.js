// src/context/CartContext.js --- UPGRADED VERSION ---

import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // --- 👇 NEW FUNCTION #1: REMOVE AN ITEM COMPLETELY ---
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // --- 👇 NEW FUNCTION #2: DECREASE QUANTITY BY ONE ---
  const decreaseQuantity = (productId) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        // If quantity is more than 1, decrease it. Otherwise, remove the item.
        return item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : null; // We'll filter out the nulls next
      }
      return item;
    }).filter(Boolean)); // .filter(Boolean) removes any null items from the array
  };
        const clearCart = () => {
    setCart([]);
  };
  // We provide all the functions and the cart state to the app
  const value = {
    cart,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    clearCart,
    // Note: We don't really need a separate 'increaseQuantity'
    // because our addToCart function already does that!
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};