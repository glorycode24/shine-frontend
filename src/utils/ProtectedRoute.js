// src/utils/ProtectedRoute.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

// This component will receive another component as a 'children' prop
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth(); // Get the current user from our AuthContext
  const location = useLocation(); // Get the current URL location

  // Check if there is a logged-in user
  if (!currentUser) {
    // If not, redirect them to the /login page.
    // We also pass the 'location' they were trying to access.
    // This allows us to redirect them back to the correct page after they log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If there IS a user, render the children component (the page they wanted to see)
  return children;
}

export default ProtectedRoute;