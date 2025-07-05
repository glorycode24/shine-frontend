// src/pages/CartPage.js --- BACKEND INTEGRATED VERSION ---
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { Link } from 'react-router-dom';
import './CartPage.css';

function CartPage() {
  const { 
    cart, 
    loading, 
    error, 
    cartTotal, 
    cartItemCount,
    clearCart 
  } = useContext(CartContext);

  // Calculate VAT and total
  const taxRate = 0.12; // 12% VAT
  const taxAmount = cartTotal * taxRate;
  const totalAmount = cartTotal + taxAmount;

  if (loading) {
    return (
      <div className="container">
        <div className="loading-message">
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="cart-page-title">Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="empty-cart-message">
          <p>Your cart is currently empty.</p>
          <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
        </div>
      ) : (
        <div>
          <div className="cart-header">
            <p>Total Items: {cartItemCount}</p>
            <button onClick={clearCart} className="clear-cart-btn">
              Clear Cart
            </button>
          </div>

          <div className="cart-items-list">
            {cart.map(item => (
              <CartItem
                key={item.cartItemId}
                item={item}
              />
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({cartItemCount} items)</span>
              <span>₱{cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>VAT (12%)</span>
              <span>₱{taxAmount.toFixed(2)}</span>
            </div>
            <hr />
            <div className="summary-row total-row">
              <strong>Total</strong>
              <strong>₱{totalAmount.toFixed(2)}</strong>
            </div>
            <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;