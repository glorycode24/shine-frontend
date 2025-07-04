// src/pages/OrderHistoryPage.js
import React from 'react';
import { useOrders } from '../context/OrderContext';
import OrderStatus from '../components/OrderStatus';
import { Link } from 'react-router-dom';
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
              <div className="order-header">
                <h3>Order ID: {order.id}</h3>
                <OrderStatus status={order.status} />
              </div>
              <div className="order-details">
                <p><strong>Date:</strong> {order.date}</p>
                <p><strong>Total:</strong> ₱{order.total.toFixed(2)}</p>
                {order.estimatedDelivery && (
                  <p><strong>Estimated Delivery:</strong> {order.estimatedDelivery}</p>
                )}
              </div>
              <div className="order-items">
                <h4>Items:</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} (x{item.quantity}) - ₱{(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-actions">
                <Link to={`/track-order/${order.id}`} className="track-order-btn">
                  Track Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistoryPage;