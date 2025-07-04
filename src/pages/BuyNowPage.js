// src/pages/BuyNowPage.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import SuccessModal from '../components/SuccessModal';
import './AuthPages.css';

function BuyNowPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addOrder } = useOrders();
  const { product, quantity } = location.state || {};
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  if (!product || !quantity) {
    return <div className="container"><h2>Invalid purchase. Please select a product.</h2></div>;
  }

  const total = product.price * quantity;

  const handleBuyNowCheckout = (e) => {
    e.preventDefault();
    addOrder([
      { ...product, quantity }
    ], total);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/order-history');
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleBuyNowCheckout} className="auth-form">
        <h2>Buy Now Checkout</h2>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="address">Shipping Address</label>
          <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} required />
        </div>
        <hr style={{margin: '20px 0'}} />
        <h3>Order Summary</h3>
        <p><strong>Product:</strong> {product.productName}</p>
        <p><strong>Quantity:</strong> {quantity}</p>
        <p><strong>Total Price:</strong> ₱{total.toFixed(2)}</p>
        <button type="submit" className="auth-button" style={{marginTop: '20px'}}>Complete Purchase</button>
      </form>
      <SuccessModal
        open={showSuccess}
        message="Thank you for your purchase!"
        onClose={handleSuccessClose}
        actionLabel="View Orders"
        onAction={handleSuccessClose}
      />
    </div>
  );
}

export default BuyNowPage; 