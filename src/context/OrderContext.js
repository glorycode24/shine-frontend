// src/context/OrderContext.js
import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';

export const OrderContext = createContext();

// Order status constants
export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing', 
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

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
      status: ORDER_STATUS.PENDING,
      statusHistory: [
        {
          status: ORDER_STATUS.PENDING,
          date: new Date().toISOString(),
          message: 'Order placed successfully'
        }
      ],
      // Simulate some status updates over time
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString() // 7 days from now
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

    // Simulate status updates for demo purposes
    setTimeout(() => {
      updateOrderStatus(newOrder.id, ORDER_STATUS.PROCESSING, 'Order is being processed');
    }, 2000);

    setTimeout(() => {
      updateOrderStatus(newOrder.id, ORDER_STATUS.SHIPPED, 'Order has been shipped');
    }, 5000);
  };
  
  // Get orders only for the currently logged-in user
  const getUserOrders = () => {
    if (!currentUser) return [];
    return orders[currentUser.username] || [];
  };

  // Get a specific order by ID
  const getOrderById = (orderId) => {
    if (!currentUser) return null;
    const userOrders = orders[currentUser.username] || [];
    return userOrders.find(order => order.id === orderId);
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus, message = '') => {
    if (!currentUser) return;
    
    setOrders(prevOrders => {
      const userOrders = prevOrders[currentUser.username] || [];
      const updatedUserOrders = userOrders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            statusHistory: [
              ...order.statusHistory,
              {
                status: newStatus,
                date: new Date().toISOString(),
                message: message || `Order status updated to ${newStatus}`
              }
            ]
          };
        }
        return order;
      });

      return {
        ...prevOrders,
        [currentUser.username]: updatedUserOrders
      };
    });
  };

  const value = { 
    addOrder, 
    getUserOrders, 
    getOrderById, 
    updateOrderStatus,
    ORDER_STATUS 
  };

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