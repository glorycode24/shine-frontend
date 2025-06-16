// src/context/ReviewContext.js
import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  // Storing reviews like: { "productId": [review1, review2], "productId2": [...] }
  const [reviews, setReviews] = useState({});
  const { currentUser } = useAuth();

  const addReview = (productId, rating, comment) => {
    // A user must be logged in to leave a review
    if (!currentUser) {
      alert("You must be logged in to leave a review.");
      return;
    }

    const newReview = {
      author: currentUser.name, // Use the display name
      rating: parseInt(rating, 10), // Ensure rating is a number
      comment: comment,
      date: new Date().toISOString(),
    };

    const productReviews = reviews[productId] || [];
    const updatedReviews = [...productReviews, newReview];

    setReviews({
      ...reviews,
      [productId]: updatedReviews,
    });
  };

  const getReviewsForProduct = (productId) => {
    return reviews[productId] || [];
  };

  const value = { addReview, getReviewsForProduct };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};

// Custom hook for easy access
export const useReviews = () => {
  return useContext(ReviewContext);
};