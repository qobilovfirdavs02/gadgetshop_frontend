import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleOrder = async () => {
    if (!token) {
      navigate('/users/login');
      return;
    }
    try {
      for (const item of cart) {
        await axios.post(
          'https://web-production-5ea26.up.railway.app/orders/',
          { product_id: item.id, quantity: item.quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      clearCart();
      alert('Buyurtma muvaffaqiyatli yuborildi!');
      navigate('/users/me');
    } catch (err) {
      alert('Xatolik yuz berdi: ' + (err.response?.data?.detail || err.message));
    }
  };

  const confirmOrder = () => {
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    handleOrder();
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="cart-container">
      <h2>Savat</h2>
      {cart.length === 0 ? (
        <p>Savatda mahsulot yo‘q</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image_url} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Narx: ${item.price}</p>
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <p>Jami: ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  O‘chirish
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Umumiy narx: ${totalPrice.toFixed(2)}</h3>
            <button className="order-btn" onClick={confirmOrder}>Buyurtma berish</button>
          </div>
        </>
      )}

      {showConfirmModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Buyurtmani tasdiqlash</h3>
            <p>Buyurtma berishni xohlaysizmi? Umumiy narx: ${totalPrice.toFixed(2)}</p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleConfirm}>Ha</button>
              <button className="cancel-btn" onClick={handleCancel}>Yo‘q</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;