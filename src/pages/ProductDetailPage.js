import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import { useReviews } from '../context/ReviewContext';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 👇 2. GET CONTEXT VALUES FROM THE CORRECT HOOKS
  const { addToCart } = useCart(); 
  const { currentUser } = useAuth();
  const { addReview, getReviewsForProduct } = useReviews();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const productReviews = getReviewsForProduct(id);

  // --- HANDLER FUNCTIONS ---

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      alert('Please select a rating and write a comment.');
      return;
    }
    addReview(id, rating, comment);
    setRating(0);
    setComment('');
  };

  const handleBuyNow = async () => {
    if (!product) return;
    await addToCart(product.productId);
    navigate('/checkout');
  };

  // --- DATA FETCHING EFFECT ---

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="container"><h2>Loading product...</h2></div>;
  }

  if (!product) {
    return <div className="container"><h2>Product not found!</h2></div>;
  }

  // --- THE SINGLE, FINAL RETURN STATEMENT ---
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
          
          {/* 👇 3. CLEANED UP THE ACTION BUTTONS SECTION 👇 */}
          <div className="product-actions">
            {currentUser ? (
              // If logged in, show the buttons
              <>
                <button onClick={() => addToCart(product.productId)} className="add-to-cart-btn-large">
                  Add to Cart
                </button>
                <button onClick={handleBuyNow} className="buy-now-btn">
                  Buy Now
                </button>
              </>
            ) : (
              // If not logged in, show the prompt
              <div className="login-prompt">
                <p>Please <Link to="/login">log in</Link> to add items to your cart.</p>
              </div>
            )}
          </div>
          
          {/* The duplicate button has been removed */}
          <Link to="/" className="back-to-shop-link">← Back to all products</Link>
        </div>
      </div>

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