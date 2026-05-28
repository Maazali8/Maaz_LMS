import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'instructor') return '/instructor/dashboard';
    return '/student/dashboard';
  };

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🎓</span>
          <span>Learn<span className="logo-accent">Hub</span></span>
        </Link>

        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/courses" onClick={() => setMenuOpen(false)}>Courses</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>

          {user ? (
            <>
              <Link to={getDashboardLink()} className="btn btn-outline btn-sm" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <button className="btn btn-primary btn-sm" onClick={handleLogout}>Logout</button>
              <span className="nav-user">👤 {user.name.split(' ')[0]}</span>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
