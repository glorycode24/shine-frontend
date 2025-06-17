// src/components/ProductCard.js --- FINAL UPGRADED VERSION ---

import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product }) {
  
  // This can be a real URL to a generic image, or a local file in your /public folder
  const placeholderImageUrl = 'https://via.placeholder.com/300x300.png?text=No+Image';

  // Safeguard in case product data is not yet loaded
  if (!product) {
    return null; // Or render a loading skeleton
  }

  return (
    // The Link now goes to the correct productId from your entity
    <Link to={`/products/${product.productId}`} className="product-card-link">
      <div className="product-card">
        
        {/* 👇 THE BIG CHANGE IS HERE 👇 */}
        <div className="product-image-container">
          <img 
            // If product.imageUrl exists and is not empty, use it. Otherwise, use the placeholder.
            src={product.imageUrl || placeholderImageUrl} 
            alt={product.productName}
            className="product-image"
          />
        </div>
        
        {/* These all correctly match your entity's field names */}
        <h3 className="product-name">{product.productName}</h3>
        <p className="product-category">{product.category?.categoryName}</p>
        <p className="product-price">₱{product.price?.toFixed(2)}</p>
        
        <button className="add-to-cart-btn">
          View Details
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;