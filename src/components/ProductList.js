import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard'; // Assuming your paths are correct
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [searchParams, setSearchParams] = useSearchParams();

  // This useEffect for fetching data is correct
  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsResponse, categoriesResponse] = await Promise.all([
              fetch('/api/products'),
              fetch('/api/categories')
            ]);
            const productsData = await productsResponse.json();
            const categoriesData = await categoriesResponse.json();
            setProducts(Array.isArray(productsData) ? productsData : []);
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
          } catch (error) {
            console.error('Failed to fetch data:', error);
          } finally {
            setLoading(false);
          }
    };
    fetchData();
  }, []);

  // This is the new handler function for your dropdown
  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    const newParams = new URLSearchParams(searchParams);

    if (newCategory === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', newCategory);
    }
    setSearchParams(newParams);
  };

  // The selected category is derived directly from the URL, NOT from useState
  const selectedCategory = searchParams.get('category') || 'all';
  
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category.categoryId == selectedCategory;
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
          onChange={handleCategoryChange} // Ensure this uses the correct handler
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div className="product-list-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;