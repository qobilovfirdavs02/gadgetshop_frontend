import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/AdminPanel.css';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrls, setImageUrls] = useState(['']);
  const [productId, setProductId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  useEffect(() => {
    if (isAuthenticated !== 'true') {
      navigate('/admin');
      return;
    }
    fetchProducts();
    fetchCategories();
    fetchOrders();
  }, [navigate, isAuthenticated]);

  const fetchProducts = async () => {
    const response = await axios.get('https://web-production-5ea26.up.railway.app/products/');
    console.log("Products:", response.data);
    setProducts(response.data);
  };

  const fetchCategories = async () => {
    const response = await axios.get('https://web-production-5ea26.up.railway.app/categories/');
    setCategories(response.data);
  };

  const fetchOrders = async () => {
    const response = await axios.get('https://web-production-5ea26.up.railway.app/admin/orders/');
    setOrders(response.data);
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  const addImageUrlField = () => {
    if (imageUrls.length < 6) {
      setImageUrls([...imageUrls, '']);
    }
  };

  const removeImageUrlField = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      product_id: productId,
      name,
      price: parseFloat(price),
      description,
      stock: parseInt(stock),
      image_urls: imageUrls.filter(url => url),
      category_id: parseInt(categoryId),
    };
    
    try {
      if (editingId) {
        await axios.put(`https://web-production-5ea26.up.railway.app/products/${editingId}`, productData);
        alert('Mahsulot tahrirlandi');
      } else {
        await axios.post('https://web-production-5ea26.up.railway.app/products/', productData);
        alert('Mahsulot qo‘shildi');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      alert('Xatolik: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleEdit = (product) => {
    console.log("Editing product:", product);
    setEditingId(product.product_id);
    setProductId(product.product_id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setStock(product.stock);
    // image_urls massiv ekanligini ta'minlash
    const urls = Array.isArray(product.image_urls) ? product.image_urls : [];
    setImageUrls(urls.length > 0 ? urls : ['']);
    setCategoryId(product.category_id);
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`https://web-production-5ea26.up.railway.app/products/${productId}`);
      alert('Mahsulot o‘chirildi');
      fetchProducts();
    } catch (err) {
      alert('Xatolik: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleOrderUpdate = async (orderId, status) => {
    try {
      if (status === "cancelled" && !cancelReason) {
        alert('Bekor qilish sababi majburiy');
        return;
      }
      await axios.put(
        `https://web-production-5ea26.up.railway.app/admin/orders/${orderId}`,
        { status, cancel_reason: status === "cancelled" ? cancelReason : null }
      );
      setCancelReason('');
      fetchOrders();
      alert(`Buyurtma ${status === "accepted" ? "qabul qilindi" : "bekor qilindi"}`);
    } catch (err) {
      alert('Xatolik: ' + (err.response?.data?.detail || err.message));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setProductId('');
    setName('');
    setPrice('');
    setDescription('');
    setStock('');
    setImageUrls(['']);
    setCategoryId('');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('admin_id');
    navigate('/admin');
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2 className="admin-title">Admin Panel</h2>
        <button onClick={handleLogout} className="logout-btn">Chiqish</button>
      </div>
      
      <h3>Mahsulot qo‘shish/tahrirlash</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <input type="text" placeholder="Product ID" value={productId} onChange={(e) => setProductId(e.target.value)} className="admin-input" />
        <input type="text" placeholder="Mahsulot nomi" value={name} onChange={(e) => setName(e.target.value)} className="admin-input" />
        <input type="number" placeholder="Narxi" value={price} onChange={(e) => setPrice(e.target.value)} className="admin-input" />
        <textarea placeholder="Tavsif" value={description} onChange={(e) => setDescription(e.target.value)} className="admin-input" />
        <input type="number" placeholder="Omborda" value={stock} onChange={(e) => setStock(e.target.value)} className="admin-input" />
        {imageUrls.map((url, index) => (
          <div key={index} className="image-url-input">
            <input
              type="text"
              placeholder={`Cloudinary URL ${index + 1}`}
              value={url}
              onChange={(e) => handleImageUrlChange(index, e.target.value)}
              className="admin-input"
            />
            {imageUrls.length > 1 && (
              <button type="button" onClick={() => removeImageUrlField(index)} className="remove-image-btn">O‘chirish</button>
            )}
          </div>
        ))}
        {imageUrls.length < 6 && (
          <button type="button" onClick={addImageUrlField} className="add-image-btn">Yana rasm qo‘shish</button>
        )}
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="admin-input">
          <option value="">Kategoriyani tanlang</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit" className="admin-btn">{editingId ? 'Tahrirlash' : 'Qo‘shish'}</button>
      </form>

      <h3>Mahsulotlar</h3>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <img src={product.image_urls?.[0]} alt={product.name} className="product-img" />
            <div>
              <p><strong>{product.name}</strong> ({product.product_id})</p>
              <p>Narx: ${product.price} | Omborda: {product.stock}</p>
              <p>{product.description}</p>
            </div>
            <button onClick={() => handleEdit(product)} className="edit-btn">Tahrirlash</button>
            <button onClick={() => handleDelete(product.product_id)} className="delete-btn">O‘chirish</button>
          </div>
        ))}
      </div>

      <h3>Buyurtmalar</h3>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-item">
            <p><strong>User ID:</strong> {order.user_id}</p>
            <p><strong>Mahsulot:</strong> {order.product_name}</p>
            <p><strong>Miqdor:</strong> {order.quantity}</p>
            <p><strong>Jami:</strong> ${order.total_price}</p>
            <p><strong>Holati:</strong> {order.status}</p>
            {order.cancel_reason && <p><strong>Bekor qilish sababi:</strong> {order.cancel_reason}</p>}
            {order.status === "pending" && (
              <>
                <input
                  type="text"
                  placeholder="Bekor qilish sababi (majburiy)"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="cancel-reason-input"
                />
                <button onClick={() => handleOrderUpdate(order.id, "accepted")} className="accept-btn">Qabul qilish</button>
                <button onClick={() => handleOrderUpdate(order.id, "cancelled")} className="cancel-btn">Bekor qilish</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;