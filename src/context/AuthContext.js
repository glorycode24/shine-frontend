// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the context
export const AuthContext = createContext(null);

// A simple, fake user database for demonstration
let fakeUsers = {
  'testuser': { password: 'password123', name: 'Test User' },
};

// Create the provider component
export const AuthProvider = ({ children }) => {
  // State to hold the currently logged-in user, starts as null
  const [currentUser, setCurrentUser] = useState(null);

const register = (username, password) => {
    // Check if the username already exists
    if (fakeUsers[username]) {
      return { success: false, message: 'Username already taken.' };
    }
    fakeUsers[username] = { password: password, name: username };
    setCurrentUser({ username: username, name: username });

    console.log("Updated fake users:", fakeUsers); // For debugging
    return { success: true };
  };

  const login = (username, password) => {
    // In a real app, this would be a fetch() call to a backend API
    const user = fakeUsers[username];
    if (user && user.password === password) {
      setCurrentUser({ username: username, name: user.name }); // Set the current user
      return true; // Login successful
    }
    return false; // Login failed
  };

  const logout = () => {
    // In a real app, you might also call a backend endpoint
    setCurrentUser(null); // Clear the user from state
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily use the auth context in other components
export const useAuth = () => {
  return useContext(AuthContext);
};