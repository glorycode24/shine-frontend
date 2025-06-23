// src/pages/LoginPage.js --- UPGRADED VERSION ---

import React, { useState, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../services/api'; // 👈 1. IMPORT YOUR CENTRAL API SERVICE
import './AuthPages.css';

function LoginPage() {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  
  // 👇 2. RENAME STATE TO `email`
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const { login } = useAuth(); // login(token) from your context
  const navigate = useNavigate();

  // 👇 3. REWRITE handleSubmit TO BE ASYNC AND CALL THE API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      // Send the email and password to your backend's login endpoint
      const response = await api.post('/api/auth/login', { email, password });

      // The backend will send back an object like { "token": "..." } on success
      const { token } = response.data;
      
      // Pass the received JWT token to your AuthContext's login function
      // The context will be responsible for saving the token and user info
      login(token);
      
      // Redirect to the intended page or homepage
      navigate(from, { replace: true });

    } catch (err) {
      // If the API call fails (e.g., 401 Unauthorized), set an error message
      setError('Invalid email or password. Please try again.');
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Welcome Back!</h2>
        {error && <p className="auth-error">{error}</p>}
        
        {/* 👇 4. UPDATE THE FORM TO ASK FOR EMAIL 👇 */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email" // Helps browsers with autofill
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password" // Helps browsers with autofill
          />
        </div>
        
        <button type="submit" className="auth-button">Sign In</button>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;