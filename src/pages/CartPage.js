import React from 'react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { Link } from 'react-router-dom';
import './CartPage.css';
import api from '../services/api';

function CartPage() {
  const { cart } = useCart();

  // Use optional chaining (?.) for safety while data is loading
  const cartItems = cart?.items || [];

  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const taxRate = 0.12;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  // A better check for an empty or loading cart
  if (!cart || cartItems.length === 0) {
    return (
      <div className="container empty-cart-message">
        <h2>Your Shopping Cart is Empty</h2>
        <Link to="/" className="continue-shopping-btn">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h2 className="cart-page-title">Your Shopping Cart</h2>

      <div className="cart-items-list">
        {/* We map over cartItems, which is cart.items */}
        {cartItems.map(item => (
          // No more functions passed as props!
          <CartItem key={item.cartItemId} item={item} />
        ))}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₱{subtotal.toFixed(2)}</span>
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
  );
}

export default CartPage;