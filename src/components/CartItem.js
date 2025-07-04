// src/components/CartItem.js --- UPGRADED VERSION ---
import React from 'react';
import './CartItem.css';

// 👇 Receive the new functions as props
function CartItem({ item, onAddToCart, onDecrease, onRemove }) {
  const itemTotal = item.price * item.quantity;
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
    <div className="cart-item">
      <div className="cart-item-info">
        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
        )}
        <div>
          <h4>{item.name}</h4>
          {categoryText && <p className="cart-item-category">{categoryText}</p>}
          <p>Price: ₱{item.price.toFixed(2)}</p>
          <div className="quantity-controls">
            <button onClick={() => onDecrease(item.id)} className="quantity-btn">-</button>
            <span>{item.quantity}</span>
            <button onClick={() => onAddToCart(item)} className="quantity-btn">+</button>
          </div>
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