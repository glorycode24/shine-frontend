// src/components/CartItem.js --- UPGRADED VERSION ---
import React from 'react';
import './CartItem.css';

// 👇 Receive the new functions as props
function CartItem({ item, onAddToCart, onDecrease, onRemove }) {
  const itemTotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <h4>{item.name}</h4>
        <p>Price: ₱{item.price.toFixed(2)}</p>
        <div className="quantity-controls">
          <button onClick={() => onDecrease(item.id)} className="quantity-btn">-</button>
          <span>{item.quantity}</span>
          <button onClick={() => onAddToCart(item)} className="quantity-btn">+</button>
        </div>
      </div>
      <div className="cart-item-actions">
        <p>Total: ₱{itemTotal.toFixed(2)}</p>
        <button onClick={() => onRemove(item.id)} className="remove-btn">Remove</button>
      </div>
    </div>
  );
}

export default CartItem;