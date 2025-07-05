import api from './api';

class ProductService {
  /**
   * Get all products
   * @returns {Promise<Array>} Array of products
   */
  async getProducts() {
    try {
      const response = await api.get('/api/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  /**
   * Get product by ID
   * @param {number} productId - Product ID
   * @returns {Promise<Object>} Product object
   */
  async getProduct(productId) {
    try {
      const response = await api.get(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    }
  }

  /**
   * Get products by category
   * @param {number} categoryId - Category ID
   * @returns {Promise<Array>} Array of products
   */
  async getProductsByCategory(categoryId) {
    try {
      const response = await api.get(`/api/products?category=${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw new Error('Failed to fetch products by category');
    }
  }

  /**
   * Get product variations
   * @param {number} productId - Product ID
   * @returns {Promise<Array>} Array of product variations
   */
  async getProductVariations(productId) {
    try {
      // Try the variations endpoint first
      const response = await api.get(`/api/product_variations/by-product/${productId}`);
      return response.data;
    } catch (error) {
      // Endpoint doesn't exist yet - return empty array
      return [];
    }
  }

  /**
   * Extract variations from product data if available
   * @param {Object} product - Product object
   * @returns {Array} Array of variations
   */
  extractVariationsFromProduct(product) {
    const variations = [];
    
    // Check if product has size and color arrays
    if (product.sizes && product.colors) {
      // Create variations for each size/color combination
      product.sizes.forEach(size => {
        product.colors.forEach(color => {
          variations.push({
            variationId: `${product.productId}-${size}-${color}`,
            sizeName: size,
            colorName: color,
            additionalStock: product.stockQuantity || 0,
            price: product.price
          });
        });
      });
    } else if (product.sizes) {
      // Only sizes available
      product.sizes.forEach(size => {
        variations.push({
          variationId: `${product.productId}-${size}`,
          sizeName: size,
          colorName: 'Default',
          additionalStock: product.stockQuantity || 0,
          price: product.price
        });
      });
    } else if (product.colors) {
      // Only colors available
      product.colors.forEach(color => {
        variations.push({
          variationId: `${product.productId}-${color}`,
          sizeName: 'Standard',
          colorName: color,
          additionalStock: product.stockQuantity || 0,
          price: product.price
        });
      });
    }
    
    // For demonstration purposes, add some sample variations to certain products
    // This would normally come from your backend database
    if (product.productId === 5 || product.productId === 6 || product.productId === 7) {
      // Add sample variations for these products
      const sampleSizes = ['Small', 'Medium', 'Large'];
      const sampleColors = ['Red', 'Blue', 'Black'];
      
      sampleSizes.forEach(size => {
        sampleColors.forEach(color => {
          variations.push({
            variationId: `${product.productId}-${size}-${color}`,
            sizeName: size,
            colorName: color,
            additionalStock: Math.floor(Math.random() * 20) + 5, // Random stock between 5-25
            price: product.price
          });
        });
      });
    }
    
    return variations;
  }

  /**
   * Get default variation for a product (fallback for products without variations)
   * @param {Object} product - Product object
   * @returns {Object} Default variation object
   */
  getDefaultVariation(product) {
    // If product has variations, return the first one
    if (product.variations && product.variations.length > 0) {
      return product.variations[0];
    }

    // Create a default variation using product data
    return {
      variationId: product.productId,
      sizeName: 'Standard',
      colorName: 'Default',
      additionalStock: product.stock || 999, // Default high stock
      price: product.price,
      product: product
    };
  }

  /**
   * Prepare product for cart (adds variationId if needed)
   * @param {Object} product - Product object
   * @returns {Object} Product with variationId
   */
  prepareProductForCart(product) {
    const defaultVariation = this.getDefaultVariation(product);
    return {
      ...product,
      variationId: defaultVariation.variationId,
      sizeName: defaultVariation.sizeName,
      colorName: defaultVariation.colorName,
      availableStock: defaultVariation.additionalStock
    };
  }

  /**
   * Get variation by size and color
   * @param {Array} variations - Array of variations
   * @param {string} sizeName - Size name
   * @param {string} colorName - Color name
   * @returns {Object|null} Variation object or null
   */
  getVariationBySizeAndColor(variations, sizeName, colorName) {
    return variations.find(v => v.sizeName === sizeName && v.colorName === colorName) || null;
  }
}

export default new ProductService(); 