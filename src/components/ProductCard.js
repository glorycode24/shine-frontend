// src/components/ProductCard.js --- UPGRADED VERSION ---

import React from 'react';
import { Link } from 'react-router-dom'; // 👈 IMPORT LINK
import './ProductCard.css';

// We no longer need to receive onAddToCart here, as it's on the detail page now
function ProductCard({ product }) {
  
  const handleAddToCartClick = (e) => {
    // This stops the click from "bubbling up" to the parent Link
    // and navigating to the detail page.
    e.stopPropagation();
    e.preventDefault(); // Also prevent the default link behavior
    
    // We can't add to cart from here anymore.
    // For now, let's just log a message.
    // A better UX would be to show a small "Added!" confirmation.
    console.log(`(This would add ${product.name} to cart)`);
    alert(`${product.name} can be added to the cart on its own page!`);
  };

  return (
    // 👇 WRAP THE ENTIRE CARD IN A LINK
    <Link to={`/products/${product.productId}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image-placeholder">
          Image of {product.productName}
        </div>
        <h3 className="product-name">{product.productName}</h3>
        <p className="product-category">{product.category.name}</p>
        <p className="product-price">₱{product.price.toFixed(2)}</p>
        {/* The button is now inside the link, so we must stop its click */}
        <button className="add-to-cart-btn" onClick={handleAddToCartClick}>
          View Details
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;