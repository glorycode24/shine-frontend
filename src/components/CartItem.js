// src/components/CartItem.js --- BACKEND INTEGRATED VERSION ---
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './CartItem.css';

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useContext(CartContext);

  // Handle quantity increase
  const handleIncrease = () => {
    updateQuantity(item.cartItemId, item.quantity + 1);
  };

  // Handle quantity decrease
  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.cartItemId, item.quantity - 1);
    } else {
      // Remove item if quantity would become 0
      removeFromCart(item.cartItemId);
    }
  };

  // Handle remove item
  const handleRemove = () => {
    removeFromCart(item.cartItemId);
  };

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        {item.productImage && (
          <img src={item.productImage} alt={item.productName} className="cart-item-image" />
        )}
        <div>
          <h4>{item.productName}</h4>
          <p className="cart-item-category">
            {item.sizeName && item.colorName 
              ? `${item.sizeName} - ${item.colorName}`
              : item.sizeName || item.colorName || 'Standard'
            }
          </p>
          <p>Price: ₱{item.productPrice?.toFixed(2) || '0.00'}</p>
          <p className="stock-info">
            Available: {item.availableStock || 0} units
          </p>
          <div className="quantity-controls">
            <button 
              onClick={handleDecrease} 
              className="quantity-btn"
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button 
              onClick={handleIncrease} 
              className="quantity-btn"
              disabled={item.quantity >= (item.availableStock || 0)}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="cart-item-actions">
        <p>Total: ₱{item.totalPrice?.toFixed(2) || '0.00'}</p>
        <button onClick={handleRemove} className="remove-btn">Remove</button>
      </div>
    </div>
  );
}

export default CartItem;