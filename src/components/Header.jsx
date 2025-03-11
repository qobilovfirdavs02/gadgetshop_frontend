import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Header.css';

const Header = () => {
  const { cart } = useCart();
  const isUserAuthenticated = !!localStorage.getItem('token');
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem('token');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">GadgetShop</Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/cart" className="nav-link">Cart ({cartItemCount})</Link>
          {isUserAuthenticated ? (
            <>
              <Link to="/users/me" className="nav-link">Profil</Link>
              <Link to="/" className="nav-link" onClick={handleLogout}>Chiqish</Link>
            </>
          ) : (
            <>
              <Link to="/users/login" className="nav-link">Login</Link>
              <Link to="/users/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;