import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import OrderStatus from '../components/OrderStatus';
import './TrackOrderPage.css';

function TrackOrderPage() {
  const { orderId } = useParams();
  const { getOrderById } = useOrders();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundOrder = getOrderById(orderId);
    setOrder(foundOrder);
    setLoading(false);
  }, [orderId, getOrderById]);

  if (loading) {
    return <div className="container"><h2>Loading order details...</h2></div>;
  }

  if (!order) {
    return (
      <div className="container">
        <h2>Order Not Found</h2>
        <p>The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link to="/order-history" className="back-link">← Back to Order History</Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container">
      <div className="track-order-header">
        <h2>Track Order</h2>
        <Link to="/order-history" className="back-link">← Back to Order History</Link>
      </div>

      <div className="order-tracking-container">
        {/* Order Summary */}
        <div className="order-summary-card">
          <h3>Order Summary</h3>
          <div className="order-info">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Order Date:</strong> {order.date}</p>
            <p><strong>Estimated Delivery:</strong> {order.estimatedDelivery}</p>
            <p><strong>Total Amount:</strong> ₱{order.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Current Status */}
        <div className="current-status-card">
          <h3>Current Status</h3>
          <div className="status-display">
            <OrderStatus status={order.status} />
          </div>
        </div>

        {/* Order Items */}
        <div className="order-items-card">
          <h3>Order Items</h3>
          <div className="order-items-list">
            {order.items.map((item, index) => {
              // Ensure category is always a string for display
              let categoryText = '';
              if (item.category) {
                if (typeof item.category === 'object') {
                  categoryText = item.category.categoryName || '';
                } else {
                  categoryText = item.category;
                }
              }
              
              return (
                <div key={index} className="order-item">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    {categoryText && <p className="item-category">{categoryText}</p>}
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ₱{item.price.toFixed(2)}</p>
                  </div>
                  <div className="item-total">
                    <strong>₱{(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="status-timeline-card">
          <h3>Status Timeline</h3>
          <div className="status-timeline">
            {order.statusHistory.map((statusUpdate, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <OrderStatus status={statusUpdate.status} showLabel={false} />
                </div>
                <div className="timeline-content">
                  <h4>{statusUpdate.status}</h4>
                  <p>{statusUpdate.message}</p>
                  <small>{formatDate(statusUpdate.date)}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackOrderPage; 