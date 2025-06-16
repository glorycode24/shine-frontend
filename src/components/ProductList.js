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
      .then(response => response.json()) // Convert the response to JSON
      .then(data => {
        setProducts(data);
        setLoading(false);

      })

      .catch(error => {

        console.error("Error fetching data:", error);
        setLoading(false);

      });
  }, []); 

     const categories = [...new Set(products.map(p => p.category))];

  // Filter the products based on the current searchTerm and selectedCategory
   const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div className="list-title">Loading products...</div>;
  }

  return (
    <div>
      <h2 className="list-title">Our Products</h2>

      <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
      
      <div className="product-search-filter">
      <input
        type="text"
        placeholder="Search products..."
        className="search-input"
        value={searchTerm} // 👈 Connect the value to state
        onChange={e => setSearchTerm(e.target.value)}
      />
      <select
  className="category-select"
  value={selectedCategory}
  onChange={e => setSelectedCategory(e.target.value)}
>
  <option value="all">All Categories</option>
  {categories.map((category, idx) => (
    <option key={idx} value={category}>
      {category}
    </option>
  ))}
</select>
    </div>

      {/* 👇 Now, map over the FILTERED products instead of the original ones 👇 */}
      <div className="product-list-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
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