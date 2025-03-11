import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Login.css';

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const payload = { username, password };
      console.log('Yuborilayotgan ma’lumotlar:', payload); // Tekshirish uchun
      const response = await axios.post(
        'http://localhost:8000/users/login/',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Javob:', response.data); // Javobni tekshirish
      localStorage.setItem('token', response.data.access_token);
      navigate('/users/me');
    } catch (err) {
      console.error('Xato:', err.response?.data || err.message); // Xato detalini ko‘rish
      if (err.response && err.response.status === 401) {
        setError('Noto‘g‘ri username yoki parol');
      } else {
        setError('Xatolik yuz berdi: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Foydalanuvchi Login</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button onClick={handleLogin} className="login-btn">Login</button>
        <p>
          Hisobingiz yo‘qmi? <a href="/users/register">Ro‘yxatdan o‘ting</a>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;