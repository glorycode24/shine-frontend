import { useAuth } from '../context/AuthContext';
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom'; // This import is crucial
import './Navbar.css';

function Navbar() {
  const { cart } = useContext(CartContext); // Use the correct CartContext
    const { currentUser, logout } = useAuth(); // 👈 GET USER AND LOGOUT
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar">
      {/* This MUST be a <Link> component */}
      <Link to="/" className="navbar-logo">SHINE</Link>

      <div className="nav-links">
        {/* These can stay as 'a' tags for now */}
        <a href="#">Shirts</a>
        <a href="#">Pants</a>
        <a href="#">Dresses</a>
      </div>

<div className="navbar-right"> {/* Create a wrapper for right-side items */}
  {/* 👇 DYNAMICALLY RENDER BASED ON LOGIN STATUS 👇 */}
  {currentUser ? (
    <div className="user-info">
      <span>Hello, {currentUser.name}!</span>
      <Link to="/profile" className="profile-link">Profile</Link>
      <Link to="/order-history" className="profile-link">My Orders</Link>
      <button onClick={logout} className="logout-button">Logout</button>
    </div>
  ) : (
    <Link to="/login" className="login-link">Login</Link>
  )}

  {/* This MUST be a <Link> component */}
  <Link to="/cart" className="navbar-cart">
    🛒 Cart ({totalItems})
  </Link>
</div>
    </nav>
  );
}

export default Navbar;