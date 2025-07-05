// src/pages/CheckOutPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { CartContext } from '../context/CartContext';
import SuccessModal from '../components/SuccessModal';
import './AuthPages.css';

function CheckoutPage() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const { addOrder } = useOrders();
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    addOrder(cart, cartTotal);
    clearCart();
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/order-history');
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleCheckout} className="auth-form">
        <h2>Checkout</h2>
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
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul style={{textAlign: 'left', marginBottom: '1rem'}}>
            {cart.map(item => (
              <li key={item.id}>
                {item.name} (x{item.quantity}) - ₱{(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
        )}
        <p><strong>Total Price: ₱{cartTotal.toFixed(2)}</strong></p>
        <button type="submit" className="auth-button" style={{marginTop: '20px'}}>Complete Order</button>
      </form>
      <SuccessModal
        open={showSuccess}
        message="Thank you for your order!"
        onClose={handleSuccessClose}
        actionLabel="View Orders"
        onAction={handleSuccessClose}
      />
    </div>
  );
}

export default CheckoutPage;