// src/pages/CheckoutPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { CartContext } from '../context/CartContext';
import './AuthPages.css'; // We can reuse the auth form styles

function CheckoutPage() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const { addOrder } = useOrders();
  const { cart, clearCart } = useContext(CartContext); // We need a 'clearCart' function
  const navigate = useNavigate();

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Add the order to our "database"
    addOrder(cart, cartTotal);

    // Clear the shopping cart
    clearCart();

    // Redirect to a "Thank You" or "Order History" page
    alert("Thank you for your order!");
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
        <p>Total Items: {cart.length}</p>
        <p><strong>Total Price: ₱{cartTotal.toFixed(2)}</strong></p>
        <button type="submit" className="auth-button" style={{marginTop: '20px'}}>Complete Order</button>
      </form>
    </div>
  );
}

export default CheckoutPage;