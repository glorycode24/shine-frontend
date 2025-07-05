import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

function AuthCheck() {
  const { currentUser, token } = useContext(AuthContext);
  
  const checkAuth = () => {
    const storedToken = localStorage.getItem('jwt_token');
    console.log('=== AUTH CHECK ===');
    console.log('Stored token:', storedToken);
    console.log('Current user:', currentUser);
    
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        console.log('Decoded token:', decoded);
        console.log('User role:', decoded.role);
        console.log('User ID:', decoded.userId);
      } catch (error) {
        console.log('Failed to decode token:', error);
      }
    }
    console.log('==================');
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      left: '10px', 
      background: '#f0f0f0', 
      padding: '10px', 
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      <h4>Auth Check</h4>
      <p>User: {currentUser ? currentUser.firstName + ' ' + currentUser.lastName : 'Not logged in'}</p>
      <p>Role: {currentUser ? currentUser.role : 'None'}</p>
      <p>Token: {token ? 'Present' : 'Missing'}</p>
      <button onClick={checkAuth} style={{ fontSize: '10px' }}>
        Check Auth (see console)
      </button>
    </div>
  );
}

export default AuthCheck; 