// src/pages/OrderHistoryPage.js
import React from 'react';
import { useOrders } from '../context/OrderContext';
import './OrderHistoryPage.css'; // We'll create this

function OrderHistoryPage() {
  const { getUserOrders } = useOrders();
  const orders = getUserOrders();

  return (
    <div className="container">
      <h2 className="order-history-title">Your Order History</h2>
      {orders.length === 0 ? (
        <p style={{textAlign: 'center'}}>You have no past orders.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <h3>Order ID: {order.id}</h3>
              <p><strong>Date:</strong> {order.date}</p>
              <p><strong>Total:</strong> ₱{order.total.toFixed(2)}</p>
              <h4>Items:</h4>
              <ul>
                {order.items.map(item => (
                  <li key={item.id}>
                    {item.name} (x{item.quantity})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistoryPage;