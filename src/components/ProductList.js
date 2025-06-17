import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import ProductCard from './ProductCard';
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
  fetch('/api/products')
    .then((response) => response.json())
    .then((data) => {
      console.log('Fetched products:', data);
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.error("Unexpected response format:", data);
        setProducts([]);
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching products:', error);
      setProducts([]);
      setLoading(false);
    });
}, []);


  // Extract unique categories
  // Extract unique categories correctly
const categories = products.reduce((uniqueCategories, product) => {
  // Check if we've already added a category with this ID
  if (!uniqueCategories.some(cat => cat.categoryId === product.category.categoryId)) {
    uniqueCategories.push(product.category);
  }
  return uniqueCategories;
}, []);

  // Filter the products based on search term and selected category
  const filteredProducts = products.filter((product) => {
const matchesCategory = selectedCategory === 'all' || product.category.categoryId === selectedCategory;
  
  // You have product.name, but your card uses product.productName. Be consistent!
  // Assuming it should be productName:
  const matchesSearch = product.productName?.toLowerCase().includes(searchTerm.toLowerCase());
  return matchesCategory && matchesSearch;
});

  if (loading) {
    return <div className="list-title">Loading products...</div>;
  }

  return (
    <div>
      <h2 className="list-title">Our Products</h2>

      <div className="product-search-filter">
        <input
          type="text"
          placeholder="Search products..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
  className="category-filter"
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
>
  {/* Change the value to 'all' to match your logic */}
  <option value="all">All Categories</option> 
  ...
</select>
      </div>

      <div className="product-list-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))
        ) : (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
            No products found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductList;
