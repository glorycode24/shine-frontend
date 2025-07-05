import { cartAPI, stockAPI } from './api';

class CartService {
  /**
   * Add item to cart
   * @param {number} variationId - Product variation ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise<Object>} Cart item response
   */
  async addToCart(variationId, quantity) {
    try {
      const response = await cartAPI.addToCart(variationId, quantity);
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw new Error(error.response?.data || 'Failed to add item to cart');
    }
  }

  /**
   * Get current user's cart items
   * @returns {Promise<Array>} Array of cart items
   */
  async getCartItems() {
    try {
      const response = await cartAPI.getCartItems();
      return response.data;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw new Error(error.response?.data || 'Failed to fetch cart items');
    }
  }

  /**
   * Update cart item quantity
   * @param {number} cartItemId - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Promise<Object|null>} Updated cart item or null if removed
   */
  async updateQuantity(cartItemId, quantity) {
    try {
      const response = await cartAPI.updateQuantity(cartItemId, quantity);
      return response.data;
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw new Error(error.response?.data || 'Failed to update quantity');
    }
  }

  /**
   * Remove item from cart
   * @param {number} cartItemId - Cart item ID
   * @returns {Promise<boolean>} Success status
   */
  async removeFromCart(cartItemId) {
    try {
      await cartAPI.removeFromCart(cartItemId);
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw new Error(error.response?.data || 'Failed to remove item from cart');
    }
  }

  /**
   * Clear entire cart
   * @returns {Promise<boolean>} Success status
   */
  async clearCart() {
    try {
      await cartAPI.clearCart();
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw new Error(error.response?.data || 'Failed to clear cart');
    }
  }

  /**
   * Get cart summary
   * @returns {Promise<Object>} Cart summary with total items and price
   */
  async getCartSummary() {
    try {
      const response = await cartAPI.getCartSummary();
      return response.data;
    } catch (error) {
      console.error('Error fetching cart summary:', error);
      throw new Error(error.response?.data || 'Failed to fetch cart summary');
    }
  }

  /**
   * Check stock availability
   * @param {number} variationId - Product variation ID
   * @param {number} quantity - Quantity to check
   * @returns {Promise<Object>} Stock availability info
   */
  async checkStock(variationId, quantity) {
    try {
      const response = await stockAPI.checkStock(variationId, quantity);
      return response.data;
    } catch (error) {
      console.error('Error checking stock:', error);
      throw new Error(error.response?.data || 'Failed to check stock availability');
    }
  }

  /**
   * Get available stock for a variation
   * @param {number} variationId - Product variation ID
   * @returns {Promise<number>} Available stock quantity
   */
  async getStock(variationId) {
    try {
      const response = await stockAPI.getStock(variationId);
      return response.data.availableStock;
    } catch (error) {
      console.error('Error fetching stock:', error);
      throw new Error(error.response?.data || 'Failed to fetch stock information');
    }
  }
}

export default new CartService(); 