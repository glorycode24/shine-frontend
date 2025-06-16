// src/context/OrderContext.js
import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  // We'll store orders in an object, keyed by username,
  // to simulate a multi-user database.
  const [orders, setOrders] = useState({});
  const { currentUser } = useAuth();

  const addOrder = (cart, total) => {
    if (!currentUser) return; // Can't add an order if not logged in

    const newOrder = {
      id: `SHINE-${Date.now()}`, // Simple unique ID
      date: new Date().toLocaleDateString(),
      items: cart,
      total: total,
    };

    // Get the current user's existing orders, or an empty array
    const userOrders = orders[currentUser.username] || [];
    
    // Add the new order to this user's list
    const updatedUserOrders = [...userOrders, newOrder];

    // Update the main orders state
    setOrders({
      ...orders,
      [currentUser.username]: updatedUserOrders,
    });
  };
  
  // Get orders only for the currently logged-in user
  const getUserOrders = () => {
    if (!currentUser) return [];
    return orders[currentUser.username] || [];
  };

  const value = { addOrder, getUserOrders };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook for easy access
export const useOrders = () => {
  return useContext(OrderContext);
};