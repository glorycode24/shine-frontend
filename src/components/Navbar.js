import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';


function Navbar() {
  const { cartItemCount } = useContext(CartContext);
  const { currentUser, logout } = useAuth();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchNavCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        // Only show the first 4 categories in the main nav for a clean look
        setCategories(data.slice(0, 4)); 
      } catch (error) {
        console.error("Failed to fetch nav categories:", error);
      }
    };
    fetchNavCategories();
  }, []);

  // Helper to get the best display name
  const getDisplayName = (user) => {
    if (!user) return '';
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user.name || user.username || user.email || '';
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">SHINE</Link>

      <div className="nav-links">
        {/* These links are now generated dynamically from the API */}
        {categories.map(category => (
          <NavLink
            key={category.categoryId}
            to={`/?category=${category.categoryId}`}
            className="nav-link"
          >
            {category.categoryName}
          </NavLink>
        ))}
      </div>

      <div className="navbar-right">
        {currentUser ? (
          <div className="user-info">
            <span>Hello, {getDisplayName(currentUser)}!</span>
            <Link to="/profile" className="profile-link">Profile</Link>
            <Link to="/order-history" className="profile-link">My Orders</Link>
            <button onClick={logout} className="logout-button">Logout</button>
          </div>
        ) : (
          <Link to="/login" className="login-link">Login</Link>
        )}

        <Link to="/cart" className="navbar-cart">
          🛒 Cart ({cartItemCount})
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;