// src/pages/ProductDetailPage.js --- UPGRADED VERSION ---

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useReviews } from '../context/ReviewContext'; // 👈 Import our new hook
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  // --- 👇 Review System State and Functions 👇 ---
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
  // --- 👆 End of Review System Logic 👆 ---

    useEffect(() => {
    // The proxy will handle the domain, we just need the path
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="container"><h2>Loading product...</h2></div>;
  }

  if (!product) {
    return <div className="container"><h2>Product not found!</h2></div>;
  }

  return (
    <div className="container">
      <div className="product-detail-layout">
        <div className="product-detail-image-placeholder">Image of {product.name}</div>
        <div className="product-detail-info">
          {/* Use productName */}
          <h1>{product.productName}</h1>
          {/* Use category.name */}
          <p className="product-detail-category">{product.category.name}</p>
          {/* 'description' is the same */}
          <p className="product-detail-description">{product.description}</p>
          {/* 'price' is the same */}
          <p className="product-detail-price">₱{product.price.toFixed(2)}</p>
          <button onClick={() => addToCart(product)} className="add-to-cart-btn-large">Add to Cart</button>
          <Link to="/" className="back-to-shop-link">← Back to all products</Link>
        </div>
      </div>

      {/* --- 👇 REVIEW SECTION UI 👇 --- */}
      <div className="reviews-section">
        <h3>Customer Reviews</h3>
        {/* --- Review Form --- */}
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

        {/* --- Review List --- */}
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
      {/* --- 👆 END OF REVIEW SECTION UI 👆 --- */}
    </div>
  );
}

export default ProductDetailPage;