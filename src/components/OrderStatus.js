import React from 'react';
import './OrderStatus.css';

function OrderStatus({ status, showLabel = true }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#ffc107'; // Yellow
      case 'Processing':
        return '#17a2b8'; // Blue
      case 'Shipped':
        return '#28a745'; // Green
      case 'Delivered':
        return '#6f42c1'; // Purple
      case 'Cancelled':
        return '#dc3545'; // Red
      default:
        return '#6c757d'; // Gray
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return '⏳';
      case 'Processing':
        return '⚙️';
      case 'Shipped':
        return '📦';
      case 'Delivered':
        return '✅';
      case 'Cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  return (
    <div className="order-status" style={{ color: getStatusColor(status) }}>
      <span className="status-icon">{getStatusIcon(status)}</span>
      {showLabel && <span className="status-label">{status}</span>}
    </div>
  );
}

export default OrderStatus; 