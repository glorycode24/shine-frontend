import axios from 'axios';

// Create a new Axios instance with a custom configuration
const api = axios.create({
  // 1. Set the base URL for all requests
  baseURL: 'http://localhost:8080', // Your backend server's address
});

/*
  2. The Magic of Interceptors (for when you add login)

  Interceptors allow you to run code before a request is sent or after a response is received.
  This is the perfect place to automatically add your JWT token to the headers.
*/
api.interceptors.request.use(
  (config) => {
    // Get the token from wherever you store it (e.g., localStorage)
    const token = localStorage.getItem('jwt_token'); 
    
    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config; // Return the modified config
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Cart API endpoints
export const cartAPI = {
  // Add item to cart
  addToCart: (variationId, quantity) => 
    api.post('/api/cart/add', { variationId, quantity }),
  
  // Get current user's cart items
  getCartItems: () => 
    api.get('/api/cart/items'),
  
  // Update cart item quantity
  updateQuantity: (cartItemId, quantity) => 
    api.put('/api/cart/update-quantity', { cartItemId, quantity }),
  
  // Remove item from cart
  removeFromCart: (cartItemId) => 
    api.delete(`/api/cart/remove/${cartItemId}`),
  
  // Clear entire cart
  clearCart: () => 
    api.delete('/api/cart/clear'),
  
  // Get cart summary
  getCartSummary: () => 
    api.get('/api/cart/summary'),
};

// Stock API endpoints
export const stockAPI = {
  // Get available stock for a product variation
  getStock: (variationId) => 
    api.get(`/api/stock/${variationId}`),
  
  // Check stock availability for a quantity
  checkStock: (variationId, quantity) => 
    api.get(`/api/stock/${variationId}/check?quantity=${quantity}`),
};

// Export the configured instance to be used throughout your app
export default api;