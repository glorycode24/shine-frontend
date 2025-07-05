# Backend Cart Integration Guide

This document explains how the React frontend has been integrated with the Spring Boot backend cart system.

## Overview

The frontend now uses the backend cart APIs instead of local state management. This provides:
- Persistent cart data across sessions
- Real-time stock validation
- Server-side cart management
- User-specific carts

## Backend APIs Used

### Cart Endpoints
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart/items` - Get current user's cart
- `PUT /api/cart/update-quantity` - Update item quantity
- `DELETE /api/cart/remove/{cartItemId}` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart
- `GET /api/cart/summary` - Get cart summary

### Stock Endpoints
- `GET /api/stock/{variationId}` - Get available stock
- `GET /api/stock/{variationId}/check?quantity={qty}` - Check stock availability

## Frontend Changes

### 1. API Service (`src/services/api.js`)
Added cart and stock API endpoints with proper error handling.

### 2. Cart Service (`src/services/cartService.js`)
New service class that handles all cart operations:
- `addToCart(variationId, quantity)`
- `getCartItems()`
- `updateQuantity(cartItemId, quantity)`
- `removeFromCart(cartItemId)`
- `clearCart()`
- `getCartSummary()`
- `checkStock(variationId, quantity)`

### 3. Product Service (`src/services/productService.js`)
New service to handle product operations and provide fallback for products without variations:
- `getProducts()`
- `getProduct(productId)`
- `getProductVariations(productId)`
- `getDefaultVariation(product)`
- `prepareProductForCart(product)`

### 4. Updated CartContext (`src/context/CartContext.js`)
- Now uses backend APIs instead of local state
- Includes loading and error states
- Automatically loads cart when user logs in
- Clears cart when user logs out
- Provides real-time cart totals

### 5. Updated Components

#### CartItem (`src/components/CartItem.js`)
- Uses new backend data structure
- Shows stock information
- Disables quantity buttons when appropriate
- Uses cartItemId instead of productId

#### CartPage (`src/pages/CartPage.js`)
- Shows loading and error states
- Displays cart header with item count
- Clear cart functionality
- Uses backend cart totals

#### ProductDetailPage (`src/pages/ProductDetailPage.js`)
- Quantity selectors for both Add to Cart and Buy Now
- Uses product service for variation handling
- Shows error messages from cart operations

#### Navbar (`src/components/Navbar.js`)
- Uses cartItemCount from context
- Real-time cart count updates

## Data Structure Changes

### Backend Cart Item Structure
```javascript
{
  cartItemId: number,
  productId: number,
  productName: string,
  productImage: string,
  productPrice: number,
  variationId: number,
  sizeName: string,
  colorName: string,
  quantity: number,
  availableStock: number,
  totalPrice: number
}
```

### Frontend Cart Context
```javascript
{
  cart: CartItem[],
  loading: boolean,
  error: string | null,
  cartTotal: number,
  cartItemCount: number,
  addToCart: (product, quantity) => Promise,
  updateQuantity: (cartItemId, quantity) => Promise,
  removeFromCart: (cartItemId) => Promise,
  clearCart: () => Promise,
  getCartSummary: () => Promise,
  checkStock: (variationId, quantity) => Promise,
  loadCartItems: () => Promise
}
```

## Authentication Requirements

The cart system requires user authentication. The frontend:
- Automatically adds JWT tokens to API requests
- Redirects unauthenticated users to login
- Shows appropriate error messages for auth failures

## Error Handling

The system handles various error scenarios:
- Network errors
- Authentication failures
- Insufficient stock
- Invalid product variations
- Server errors

Error messages are displayed to users and logged for debugging.

## Stock Management

The frontend now includes stock validation:
- Shows available stock for each cart item
- Disables quantity increase when stock is insufficient
- Validates stock before adding to cart
- Updates stock information in real-time

## Product Variations

For products without variations, the system:
- Creates default variations using product data
- Uses productId as variationId
- Sets default size and color values
- Provides fallback stock values

## Usage Examples

### Adding to Cart
```javascript
const { addToCart } = useContext(CartContext);

const handleAddToCart = async (product, quantity) => {
  try {
    const preparedProduct = productService.prepareProductForCart(product);
    await addToCart(preparedProduct, quantity);
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
};
```

### Updating Quantity
```javascript
const { updateQuantity } = useContext(CartContext);

const handleQuantityChange = async (cartItemId, newQuantity) => {
  try {
    await updateQuantity(cartItemId, newQuantity);
  } catch (error) {
    console.error('Failed to update quantity:', error);
  }
};
```

### Checking Stock
```javascript
const { checkStock } = useContext(CartContext);

const handleStockCheck = async (variationId, quantity) => {
  try {
    const stockInfo = await checkStock(variationId, quantity);
    if (!stockInfo.hasSufficientStock) {
      alert(`Only ${stockInfo.availableStock} units available`);
    }
  } catch (error) {
    console.error('Failed to check stock:', error);
  }
};
```

## Configuration

### Backend URL
Update the base URL in `src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8080', // Your backend server's address
});
```

### Authentication
Ensure JWT tokens are stored in localStorage as 'jwt_token':
```javascript
localStorage.setItem('jwt_token', 'your-jwt-token');
```

## Testing

To test the integration:

1. Start your Spring Boot backend server
2. Ensure authentication is working
3. Try adding products to cart
4. Test quantity updates
5. Verify stock validation
6. Test cart persistence across sessions

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend allows requests from frontend origin
2. **Authentication Errors**: Check JWT token storage and format
3. **Stock Validation Errors**: Verify stock endpoints are working
4. **Cart Not Loading**: Check user authentication status

### Debug Steps

1. Check browser network tab for API calls
2. Verify JWT token in localStorage
3. Check backend logs for errors
4. Test API endpoints directly with Postman

## Future Enhancements

Potential improvements:
- Real-time cart updates using WebSockets
- Cart sharing between devices
- Wishlist functionality
- Advanced stock notifications
- Cart abandonment recovery 