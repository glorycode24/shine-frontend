// src/pages/LoginPage.js --- FINAL UPGRADED VERSION ---

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../services/api'; // Import your central API service
import './AuthPages.css'; // Your shared styles for login/register

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, currentUser, loading } = useAuth(); // Get the login function, user, and loading
  const navigate = useNavigate();
  const location = useLocation();

  // This line intelligently finds where the user came from.
  // If they came from a protected route, it will redirect them back there.
  // Otherwise, it defaults to the homepage ('/').
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (!loading && currentUser) {
      navigate('/'); // Redirect to home if already logged in
    }
  }, [loading, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      // 1. Send the login request to your backend
      const response = await api.post('/api/auth/login', { email, password });

      // 2. Extract the JWT token from the successful response
      const { token } = response.data;
      
      // 3. Update your global state by calling the login function from your AuthContext
      login(token);
      
      // 4. 👇 THIS IS THE REDIRECT LOGIC 👇
      // Navigate the user to the page they were trying to access, or the homepage.
      // { replace: true } prevents the user from clicking the "back" button
      // and ending up on the login page again after they are logged in.
      navigate(from, { replace: true });

    } catch (err) {
      // If the API call fails (e.g., wrong password), show an error.
      setError('Invalid email or password. Please try again.');
      console.error("Login failed:", err);
    }
  };

  if (loading) {
    return <div style={{textAlign: 'center', marginTop: '2rem'}}>Loading...</div>;
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Welcome Back!</h2>
        {error && <p className="auth-error">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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