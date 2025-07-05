// src/pages/ProductDetailPage.js --- BACKEND INTEGRATED VERSION ---

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useReviews } from '../context/ReviewContext';
import productService from '../services/productService';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addToCartQty, setAddToCartQty] = useState(1);
  const [buyNowQty, setBuyNowQty] = useState(1);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const { addToCart, error: cartError } = useContext(CartContext);
  const navigate = useNavigate();

  // Review System State and Functions
  const { addReview, getReviewsForProduct } = useReviews();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const productReviews = getReviewsForProduct(id);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      alert('Please select a rating and write a comment.');
      return;
    }
    addReview(id, rating, comment);
    // Reset form after submission
    setRating(0);
    setComment('');
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await productService.getProduct(id);
        setProduct(productData);
        
        // Try to get variations from backend first
        let variationsData = await productService.getProductVariations(id);
        
        // If no variations from backend, try to extract from product data
        if (variationsData.length === 0) {
          variationsData = productService.extractVariationsFromProduct(productData);
        }
        
        setVariations(variationsData);
        
        // Set the first variation as default if available
        if (variationsData.length > 0) {
          setSelectedVariation(variationsData[0]);
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    // If no variations exist, use the product itself
    if (variations.length === 0) {
      setAddToCartLoading(true);
      try {
        const productWithVariation = {
          ...product,
          variationId: product.productId, // Use productId as variationId for products without variations
          sizeName: 'Standard',
          colorName: 'Default',
          availableStock: product.stockQuantity
        };
        
        await addToCart(productWithVariation, addToCartQty);
      } catch (err) {
        console.error('Failed to add to cart:', err);
      } finally {
        setAddToCartLoading(false);
      }
      return;
    }
    
    // If variations exist but none selected, show error
    if (!selectedVariation) {
      alert('Please select a size and color before adding to cart.');
      return;
    }
    
    setAddToCartLoading(true);
    try {
      // Create product object with the selected variation
      const productWithVariation = {
        ...product,
        variationId: selectedVariation.variationId,
        sizeName: selectedVariation.sizeName,
        colorName: selectedVariation.colorName,
        availableStock: selectedVariation.additionalStock || selectedVariation.stockQuantity
      };
      
      await addToCart(productWithVariation, addToCartQty);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAddToCartLoading(false);
    }
  };

  const handleBuyNow = () => {
    navigate('/buy-now', { state: { product, quantity: buyNowQty } });
  };

  if (loading) {
    return <div className="container"><h2>Loading product...</h2></div>;
  }

  if (!product) {
    return <div className="container"><h2>Product not found!</h2></div>;
  }

  return (
    <div className="container">
      <div className="product-detail-layout">
        <div className="product-detail-image-wrapper">
            <img 
                src={product.imageUrl || 'https://via.placeholder.com/400x400.png?text=No+Image'} 
                alt={product.productName}
                className="product-detail-image"
            />
        </div>
        <div className="product-detail-info">
          <h1>{product.productName}</h1>
          <p className="product-detail-category">{product.category?.categoryName}</p>
          <p className="product-detail-description">{product.description}</p>
          <p className="product-detail-price">₱{product.price?.toFixed(2)}</p>
          
          {/* Variation Selection */}
          {variations.length > 0 && (
            <div className="variation-selection">
              <h3>Select Options</h3>
              
              {/* Size Selection */}
              {variations.some(v => v.sizeName && v.sizeName !== 'Standard') && (
                <div className="option-group">
                  <label>Size:</label>
                  <div className="option-buttons">
                    {Array.from(new Set(variations.map(v => v.sizeName).filter(size => size !== 'Standard'))).map(size => (
                      <button
                        key={size}
                        type="button"
                        className={`option-btn ${selectedVariation?.sizeName === size ? 'selected' : ''}`}
                        onClick={() => {
                          const variation = variations.find(v => v.sizeName === size && v.colorName === selectedVariation?.colorName) || 
                                          variations.find(v => v.sizeName === size);
                          setSelectedVariation(variation);
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Color Selection */}
              {variations.some(v => v.colorName && v.colorName !== 'Default') && (
                <div className="option-group">
                  <label>Color:</label>
                  <div className="option-buttons">
                    {Array.from(new Set(variations.map(v => v.colorName).filter(color => color !== 'Default'))).map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`option-btn ${selectedVariation?.colorName === color ? 'selected' : ''}`}
                        onClick={() => {
                          const variation = variations.find(v => v.colorName === color && v.sizeName === selectedVariation?.sizeName) || 
                                          variations.find(v => v.colorName === color);
                          setSelectedVariation(variation);
                        }}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Selected Variation Info */}
              {selectedVariation && (
                <div className="selected-variation-info">
                  <p>
                    <strong>Selected:</strong> {selectedVariation.sizeName !== 'Standard' ? selectedVariation.sizeName : ''} 
                    {selectedVariation.sizeName !== 'Standard' && selectedVariation.colorName !== 'Default' ? ' - ' : ''}
                    {selectedVariation.colorName !== 'Default' ? selectedVariation.colorName : ''}
                    {(selectedVariation.sizeName === 'Standard' && selectedVariation.colorName === 'Default') ? 'Standard' : ''}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Stock Information */}
          <div className="stock-info">
            <p className={`stock-status ${selectedVariation ? (selectedVariation.additionalStock > 0 || selectedVariation.stockQuantity > 0) : (product.stockQuantity > 0) ? 'in-stock' : 'out-of-stock'}`}>
              {selectedVariation 
                ? (selectedVariation.additionalStock > 0 || selectedVariation.stockQuantity > 0)
                  ? `In Stock (${selectedVariation.additionalStock || selectedVariation.stockQuantity} available)`
                  : 'Out of Stock'
                : product.stockQuantity > 0 
                  ? `In Stock (${product.stockQuantity} available)` 
                  : 'Out of Stock'
              }
            </p>
            {variations.length === 0 && (
              <p className="no-variations-note">
                This product comes in one standard size and color.
              </p>
            )}
          </div>
          
          {/* Add to Cart Section */}
          <div className="add-to-cart-section">
            <div className="quantity-selector">
              <label htmlFor="add-to-cart-qty">Quantity:</label>
              <input
                id="add-to-cart-qty"
                type="number"
                min={1}
                max={selectedVariation ? (selectedVariation.additionalStock || selectedVariation.stockQuantity || 1) : (product.stockQuantity || 1)}
                value={addToCartQty}
                onChange={e => {
                  const maxStock = selectedVariation ? (selectedVariation.additionalStock || selectedVariation.stockQuantity || 1) : (product.stockQuantity || 1);
                  setAddToCartQty(Math.max(1, Math.min(maxStock, Number(e.target.value))));
                }}
                className="quantity-input"
              />
              {(selectedVariation ? (selectedVariation.additionalStock > 0 || selectedVariation.stockQuantity > 0) : product.stockQuantity > 0) && (
                <span className="stock-hint">
                  Max: {selectedVariation ? (selectedVariation.additionalStock || selectedVariation.stockQuantity) : product.stockQuantity}
                </span>
              )}
            </div>
            <button 
              onClick={handleAddToCart} 
              className="add-to-cart-btn-large"
              disabled={addToCartLoading || (variations.length === 0 ? product.stockQuantity <= 0 : (selectedVariation ? (selectedVariation.additionalStock <= 0 && selectedVariation.stockQuantity <= 0) : true))}
            >
              {addToCartLoading ? 'Adding...' : (variations.length === 0 ? (product.stockQuantity <= 0 ? 'Out of Stock' : 'Add to Cart') : (selectedVariation ? (selectedVariation.additionalStock <= 0 && selectedVariation.stockQuantity <= 0 ? 'Out of Stock' : 'Add to Cart') : 'Select Options'))}
            </button>
          </div>

          {/* Buy Now Section */}
          <div className="buy-now-section">
            <div className="quantity-selector">
              <label htmlFor="buy-now-qty">Quantity:</label>
              <input
                id="buy-now-qty"
                type="number"
                min={1}
                max={selectedVariation ? (selectedVariation.additionalStock || selectedVariation.stockQuantity || 1) : (product.stockQuantity || 1)}
                value={buyNowQty}
                onChange={e => {
                  const maxStock = selectedVariation ? (selectedVariation.additionalStock || selectedVariation.stockQuantity || 1) : (product.stockQuantity || 1);
                  setBuyNowQty(Math.max(1, Math.min(maxStock, Number(e.target.value))));
                }}
                className="quantity-input"
              />
              {(selectedVariation ? (selectedVariation.additionalStock > 0 || selectedVariation.stockQuantity > 0) : product.stockQuantity > 0) && (
                <span className="stock-hint">
                  Max: {selectedVariation ? (selectedVariation.additionalStock || selectedVariation.stockQuantity) : product.stockQuantity}
                </span>
              )}
            </div>
            <button 
              onClick={handleBuyNow} 
              className="buy-now-btn"
              disabled={variations.length === 0 ? product.stockQuantity <= 0 : (selectedVariation ? (selectedVariation.additionalStock <= 0 && selectedVariation.stockQuantity <= 0) : true)}
            >
              {variations.length === 0 ? (product.stockQuantity <= 0 ? 'Out of Stock' : 'Buy Now') : (selectedVariation ? (selectedVariation.additionalStock <= 0 && selectedVariation.stockQuantity <= 0 ? 'Out of Stock' : 'Buy Now') : 'Select Options')}
            </button>
          </div>

          {cartError && (
            <div className="error-message">
              <p>{cartError}</p>
            </div>
          )}

          <Link to="/" className="back-to-shop-link">← Back to all products</Link>
        </div>
      </div>

      {/* Review Section */}
      <div className="reviews-section">
        <h3>Customer Reviews</h3>
        {/* Review Form */}
        <form onSubmit={handleReviewSubmit} className="review-form">
          <h4>Leave a Review</h4>
          <div className="star-rating-input">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <label key={ratingValue}>
                  <input type="radio" name="rating" value={ratingValue} onClick={() => setRating(ratingValue)} />
                  <span className={ratingValue <= rating ? 'star-filled' : 'star-empty'}>★</span>
                </label>
              );
            })}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            required
          ></textarea>
          <button type="submit">Submit Review</button>
        </form>

        {/* Review List */}
        <div className="review-list">
          {productReviews.length > 0 ? (
            productReviews.map((review, index) => (
              <div key={index} className="review-item">
                <p><strong>{review.author}</strong> - {new Date(review.date).toLocaleDateString()}</p>
                <div className="review-stars-display">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;