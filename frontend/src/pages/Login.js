import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      if (data.user.role === 'admin') navigate('/admin/dashboard');
      else if (data.user.role === 'instructor') navigate('/instructor/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">🎓 Learn<span>Hub</span></div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-sub">Sign in to continue learning</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" name="email"
              placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" name="password"
              placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>
          <button className="btn btn-primary" type="submit" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In →'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Create one free</Link>
        </p>

        <div className="demo-accounts">
          <p>🔑 Demo Accounts:</p>
          <code>admin@lms.com / admin123</code>
        </div>
      </div>
    </div>
  );
};

export default Login;
