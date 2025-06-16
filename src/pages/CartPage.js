// src/pages/CartPage.js --- UPGRADED VERSION ---
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { Link } from 'react-router-dom';
import './CartPage.css';

function CartPage() {
  // 👇 Get all our new functions from the context
  const { cart, addToCart, decreaseQuantity, removeFromCart } = useContext(CartContext);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

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
              // 👇 Pass the functions down as props to each CartItem
              <CartItem
                key={item.id}
                item={item}
                onAddToCart={addToCart}
                onDecrease={decreaseQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <div className="cart-summary">
            <h3>Total: ₱{cartTotal.toFixed(2)}</h3>
            <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;