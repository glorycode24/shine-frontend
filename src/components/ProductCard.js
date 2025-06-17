// src/components/ProductCard.js --- CORRECTED VERSION ---

import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product }) {
  
  const handleButtonClick = (e) => {
    // This stops the click from "bubbling up" to the parent Link
    // and navigating to the detail page.
    e.stopPropagation();
    e.preventDefault(); // Also prevent the default link behavior
    
    // You could later implement a toast notification here
    alert(`${product.productName} can be added to the cart on its own page!`);
  };

  // Safeguard in case product data is not yet loaded
  if (!product) {
    return null; // Or render a loading skeleton
  }

  return (
    <Link to={`/products/${product.productId}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image-placeholder">
          {/* You can later replace this with an <img> tag */}
          Image of {product.productName}
        </div>
        <h3 className="product-name">{product.productName}</h3>
        
        {/*  👇 THE FIX IS HERE 👇 (using optional chaining for safety) */}
        <p className="product-category">{product.category?.categoryName}</p>

        <p className="product-price">₱{product.price?.toFixed(2)}</p>
        
        <button className="add-to-cart-btn" onClick={handleButtonClick}>
          View Details
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;