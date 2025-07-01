import React from 'react';
import { useCart } from '../context/CartContext';
import './CartItem.css';

function CartItem({ item }) {
  // Get the functions directly from the context! No more props drilling.
  const { updateItemQuantity, removeItem } = useCart();

  // Safety check in case product data is missing
  if (!item || !item.product) {
    return null;
  }
  
  const itemTotal = item.product.price * item.quantity;

  return (
    <div className="cart-item">
      <img src={item.product.imageUrl || 'https://via.placeholder.com/100'} alt={item.product.productName} className="cart-item-image" />
      <div className="cart-item-details">
        <h4 className="item-name">{item.product.productName}</h4>
        <p className="item-price">₱{item.product.price.toFixed(2)}</p>
      </div>
      <div className="quantity-controls">
        <button onClick={() => updateItemQuantity(item.cartItemId, item.quantity - 1)} className="quantity-btn">-</button>
        <span>{item.quantity}</span>
        <button onClick={() => updateItemQuantity(item.cartItemId, item.quantity + 1)} className="quantity-btn">+</button>
      </div>
      <div className="cart-item-total">
        <p>₱{itemTotal.toFixed(2)}</p>
      </div>
      <button onClick={() => removeItem(item.cartItemId)} className="remove-btn">×</button>
    </div>
  );
}

export default CartItem;