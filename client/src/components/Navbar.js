import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fab fa-twitter me-2 text-primary"></i>
          Twitter Clone
        </Link>
        
        <div className="navbar-nav ms-auto">
          {currentUser ? (
            <div className="d-flex align-items-center">
              <Link className="nav-link me-3" to="/">
                <i className="fas fa-home me-1"></i> Home
              </Link>
              <Link className="nav-link me-3" to="/profile">
                <i className="fas fa-user me-1"></i> Profile
              </Link>
              <span className="navbar-text me-3">Welcome, {currentUser.name}</span>
              <button className="btn btn-outline-primary btn-sm" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-1"></i> Logout
              </button>
            </div>
          ) : (
            <div>
              <Link className="nav-link me-3" to="/login">
                Login
              </Link>
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;