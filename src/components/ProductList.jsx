import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import '../styles/ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Slider uchun
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    const response = await axios.get('https://web-production-5ea26.up.railway.app/categories/');
    setCategories(response.data);
  };

  const fetchProducts = async () => {
    const response = await axios.get('https://web-production-5ea26.up.railway.app/products/');
    setProducts(response.data);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category_id === parseInt(selectedCategory)
      : true;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0); // Modal ochilganda birinchi rasm
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} savatga qo‘shildi!`);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextImage = () => {
    if (selectedProduct && selectedProduct.image_urls) {
      setCurrentImageIndex((prev) =>
        prev < selectedProduct.image_urls.length - 1 ? prev + 1 : prev
      );
    }
  };

  return (
    <div className="product-list-container">
      <div className="filter-search-container">
        <div className="category-filter">
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Barcha kategoriyalar</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Mahsulot nomini kiriting..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <p className="no-results">Hech qanday mahsulot topilmadi</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card" onClick={() => handleProductClick(product)}>
              <img src={product.image_urls?.[0] || product.image_url} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price}</p>
              <button
                className="add-to-cart-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>

      {selectedProduct && (
        <div className="product-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeModal}>×</span>
            <div className="image-slider">
              <div
                className="slider-container"
                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
              >
                {(selectedProduct.image_urls || [selectedProduct.image_url]).map((url, index) => (
                  <img key={index} src={url} alt={selectedProduct.name} className="slider-image" />
                ))}
              </div>
              {selectedProduct.image_urls?.length > 1 && (
                <>
                  <button className="slider-btn left" onClick={handlePrevImage}>‹</button>
                  <button className="slider-btn right" onClick={handleNextImage}>›</button>
                </>
              )}
            </div>
            <h2>{selectedProduct.name}</h2>
            <p><strong>Product ID:</strong> {selectedProduct.product_id}</p>
            <p><strong>Narx:</strong> ${selectedProduct.price}</p>
            <p><strong>Tavsif:</strong> {selectedProduct.description}</p>
            <p><strong>Omborda:</strong> {selectedProduct.stock} dona</p>
            <p><strong>Kategoriya:</strong> {categories.find(cat => cat.id === selectedProduct.category_id)?.name}</p>
            <button
              className="add-to-cart-btn modal-btn"
              onClick={() => handleAddToCart(selectedProduct)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;