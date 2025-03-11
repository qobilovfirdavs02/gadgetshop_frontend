import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/admin/login/',
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      localStorage.setItem('isAuthenticated', 'true'); // Faqat autentifikatsiya belgisi
      localStorage.setItem('admin_id', response.data.admin_id); // Admin ID saqlanadi
      navigate('/admin/panel');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Noto‘g‘ri username yoki parol');
      } else {
        setError('Xatolik yuz berdi: ' + err.message);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Admin Login</h2>
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
        <button onClick={handleLogin} className="login-btn">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;