import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Login.css'; // Login bilan bir xil stil ishlatamiz

const UserRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(
        'https://web-production-5ea26.up.railway.app/users/register/',
        { username, email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert('Ro‘yxatdan o‘tish muvaffaqiyatli! Endi login qiling.');
      navigate('/users/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Xatolik yuz berdi');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Ro‘yxatdan o‘tish</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button onClick={handleRegister} className="login-btn">Ro‘yxatdan o‘tish</button>
        <p>
          Hisobingiz bormi? <a href="/users/login">Login qiling</a>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;