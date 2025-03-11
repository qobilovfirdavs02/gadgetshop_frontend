import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import UserLogin from './components/user/Login';
import UserRegister from './components/user/Register';
import UserProfile from './components/user/UserProfile';
import Login from './components/admin/Login';
import AdminPanel from './components/admin/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/index.css';

const App = () => {
  return (
    <CartProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/users/login" element={<UserLogin />} />
              <Route path="/users/register" element={<UserRegister />} />
              <Route path="/users/me" element={<UserProfile />} />
              <Route path="/admin" element={<Login />} />
              <Route
                path="/admin/panel"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;