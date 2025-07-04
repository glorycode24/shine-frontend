// src/pages/CartPage.js --- FINAL UPGRADED VERSION ---
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { Link } from 'react-router-dom';
import './CartPage.css';

function CartPage() {
  const { cart, addToCart, decreaseQuantity, removeFromCart } = useContext(CartContext);

  // --- 👇 NEW CALCULATION LOGIC STARTS HERE 👇 ---

  // 1. The subtotal is the same as your old cartTotal. Let's rename for clarity.
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // 2. Define the VAT rate for the Philippines.
  const taxRate = 0.12; // 12%

  // 3. Calculate the tax amount based on the subtotal.
  const taxAmount = subtotal * taxRate;

  // 4. Calculate the final total.
  const totalAmount = subtotal + taxAmount;
  
  // --- 👆 NEW CALCULATION LOGIC ENDS HERE 👆 ---

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
          <div className="cart-items-list">
            {cart.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onAddToCart={addToCart}
                onDecrease={decreaseQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          {/* 👇 UPDATED SUMMARY SECTION 👇 */}
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
      )}
    </div>
  );
}

export default CartPage;