import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [cancelReason, setCancelReason] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      if (!token) {
        navigate('/users/login');
        return;
      }
      try {
        const userResponse = await axios.get('https://web-production-5ea26.up.railway.app/users/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersResponse = await axios.get('https://web-production-5ea26.up.railway.app/orders/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);
        setOrders(ordersResponse.data);
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/users/login');
      }
    };
    fetchUserAndOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(
        `https://web-production-5ea26.up.railway.app/orders/${orderId}`,
        { status: "cancelled", cancel_reason: cancelReason || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: "cancelled", cancel_reason: cancelReason || null } : order));
      setCancelReason('');
      alert('Buyurtma bekor qilindi');
    } catch (err) {
      alert('Xatolik: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/users/login');
  };

  if (!user) return <p>Yuklanmoqda...</p>;

  return (
    <div className="profile-container">
      <h2>Foydalanuvchi Profili</h2>
      <div className="profile-info">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <button onClick={handleLogout} className="logout-btn">Chiqish</button>
      </div>
      <h3>Buyurtmalar</h3>
      {orders.length === 0 ? (
        <p>Hozircha buyurtma yo‘q</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-item">
              <p><strong>Mahsulot:</strong> {order.product_name}</p>
              <p><strong>Miqdor:</strong> {order.quantity}</p>
              <p><strong>Jami narx:</strong> ${order.total_price}</p>
              <p><strong>Holati:</strong> {order.status}</p>
              {order.cancel_reason && <p><strong>Bekor qilish sababi:</strong> {order.cancel_reason}</p>}
              {order.status === "pending" && (
                <>
                  <input
                    type="text"
                    placeholder="Bekor qilish sababi (ixtiyoriy)"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="cancel-reason-input"
                  />
                  <button onClick={() => handleCancelOrder(order.id)} className="cancel-btn">Bekor qilish</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;