import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api'; // Ensure this path is correct

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('jwt_token')); // Use function to read only once

  // This effect runs whenever the 'token' state changes
  useEffect(() => {
    // 👇 DEFINE AN ASYNC FUNCTION INSIDE THE EFFECT 👇
    const fetchUserProfile = async () => {
      if (token) {
        try {
          // The interceptor in api.js automatically adds the token to this request
          const response = await api.get('/api/users/me');
          
          // If successful, the user data from the API is our currentUser
          setCurrentUser(response.data);
        } catch (error) {
          // If the API call fails, it means the token is likely invalid or expired.
          console.error("Failed to fetch user profile, logging out:", error);
          logout(); // Log out the user to clear the invalid state
        }
      } else {
        // If there's no token, ensure currentUser is null
        setCurrentUser(null);
      }
    };

    fetchUserProfile();
  }, [token]); // The dependency array ensures this runs when the token changes

  // The login function takes the token from the API response
  const login = (newToken) => {
    localStorage.setItem('jwt_token', newToken);
    setToken(newToken); // This will trigger the useEffect above
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null); // This will also trigger the useEffect
  };

  // The value provided to all consuming components
  const value = { currentUser, login, logout, token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Create a custom hook for easy access to the context
export function useAuth() {
  return useContext(AuthContext);
}