// src/context/CartContext.js --- BACKEND INTEGRATED VERSION ---

import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import cartService from '../services/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser, loading: authLoading } = useContext(AuthContext);

  // Check if user is authenticated
  const isAuthenticated = !!currentUser;

  // Load cart items when user is authenticated
  useEffect(() => {
    // Only load cart if user is authenticated, has a token, and auth is not loading
    if (isAuthenticated && currentUser && !authLoading) {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        loadCartItems();
      }
    } else if (!isAuthenticated && !authLoading) {
      // Clear cart when user logs out
      setCart([]);
    }
  }, [isAuthenticated, currentUser, authLoading]);

  /**
   * Load cart items from backend
   */
  const loadCartItems = async () => {
    if (!isAuthenticated) {
      return;
    }
    
    // Check if we have a valid token
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const cartItems = await cartService.getCartItems();
      setCart(cartItems);
    } catch (err) {
      console.error('Failed to load cart items:', err);
      if (err.response?.status === 403) {
        setError('Authentication required. Please log in again.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add item to cart
   * @param {Object} product - Product object with variationId
   * @param {number} quantity - Quantity to add
   */
  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      setError('Please log in to add items to cart');
      return;
    }

    if (!product.variationId) {
      setError('Product variation ID is required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const cartItem = await cartService.addToCart(product.variationId, quantity);
      
      // Update local cart state
      setCart(prevCart => {
        const existingIndex = prevCart.findIndex(item => item.cartItemId === cartItem.cartItemId);
        if (existingIndex >= 0) {
          // Update existing item
          const updatedCart = [...prevCart];
          updatedCart[existingIndex] = cartItem;
          return updatedCart;
        } else {
          // Add new item
          return [...prevCart, cartItem];
        }
      });
    } catch (err) {
      console.error('Failed to add to cart:', err);
      
      // Handle specific error cases
      if (err.response?.status === 409) {
        // Stock conflict - extract the specific error message
        const errorMessage = err.response?.data || err.message;
        if (errorMessage.includes('Insufficient stock')) {
          setError('Sorry, there is not enough stock available for this item. Please try a smaller quantity.');
        } else {
          setError(errorMessage);
        }
      } else if (err.response?.status === 403) {
        setError('Authentication required. Please log in again.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update cart item quantity
   * @param {number} cartItemId - Cart item ID
   * @param {number} quantity - New quantity
   */
  const updateQuantity = async (cartItemId, quantity) => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);
    try {
      const updatedItem = await cartService.updateQuantity(cartItemId, quantity);
      
      if (updatedItem === null) {
        // Item was removed (quantity was 0)
        setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
      } else {
        // Item was updated
        setCart(prevCart => 
          prevCart.map(item => 
            item.cartItemId === cartItemId ? updatedItem : item
          )
        );
      }
    } catch (err) {
      console.error('Failed to update quantity:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove item from cart
   * @param {number} cartItemId - Cart item ID
   */
  const removeFromCart = async (cartItemId) => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);
    try {
      await cartService.removeFromCart(cartItemId);
      setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear entire cart
   */
  const clearCart = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);
    try {
      await cartService.clearCart();
      setCart([]);
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get cart summary (total items and price)
   */
  const getCartSummary = async () => {
    if (!isAuthenticated) return { totalItems: 0, totalPrice: 0 };

    try {
      return await cartService.getCartSummary();
    } catch (err) {
      console.error('Failed to get cart summary:', err);
      return { totalItems: 0, totalPrice: 0 };
    }
  };

  /**
   * Check stock availability
   * @param {number} variationId - Product variation ID
   * @param {number} quantity - Quantity to check
   */
  const checkStock = async (variationId, quantity) => {
    try {
      return await cartService.checkStock(variationId, quantity);
    } catch (err) {
      console.error('Failed to check stock:', err);
      return { hasSufficientStock: false, availableStock: 0 };
    }
  };

  // Calculate cart totals locally for immediate UI updates
  const cartTotal = cart.reduce((total, item) => total + (item.totalPrice || 0), 0);
  const cartItemCount = cart.reduce((count, item) => count + (item.quantity || 0), 0);

  const value = {
    cart,
    loading,
    error,
    cartTotal,
    cartItemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartSummary,
    checkStock,
    loadCartItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};