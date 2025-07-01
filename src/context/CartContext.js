import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

// You can keep this export if other files need the raw context
export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // The cart starts as 'null' until we fetch it
  const [cart, setCart] = useState(null);
  const { currentUser } = useAuth();

  // This effect correctly fetches the cart when the user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (currentUser) {
        try {
          const response = await api.get('/api/cart');
          setCart(response.data);
        } catch (error) { 
          console.error("Failed to fetch cart:", error);
          // It's possible a new user doesn't have a cart yet, so an empty cart is also a valid state.
          setCart({ items: [] });
        }
      } else {
        setCart(null); // Clear the cart on logout
      }
    };
    fetchCart();
  }, [currentUser]);

  // --- REWRITTEN CART FUNCTIONS ---

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await api.post('/api/cart/items', { productId, quantity });
      // The backend sends back the updated cart. We use it to update our state.
      setCart(response.data);
      alert('Product added to cart!');
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert('Could not add product. Please try again.');
    }
  };

  const updateItemQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) {
      // If quantity is 0 or less, remove the item instead.
      return removeItem(cartItemId);
    }
    try {
      const response = await api.put(`/api/cart/items/${cartItemId}`, { quantity });
      setCart(response.data);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const removeItem = async (cartItemId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      // Tell the backend to delete the item
      await api.delete(`/api/cart/items/${cartItemId}`);
      // Update the local state to immediately reflect the change
      setCart(prevCart => ({
        ...prevCart,
        items: prevCart.items.filter(item => item.cartItemId !== cartItemId)
      }));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const value = { cart, addToCart, updateItemQuantity, removeItem };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// This is the only hook components should need to use
export function useCart() {
  return useContext(CartContext);
}