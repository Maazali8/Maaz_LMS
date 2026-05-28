import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const data = await register(form);
      toast.success(`Account created! Welcome, ${data.user.name} 🎉`);
      if (data.user.role === 'instructor') navigate('/instructor/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">🎓 Learn<span>Hub</span></div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Join thousands of learners today</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-control" name="name" placeholder="John Doe"
              value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" name="password" placeholder="Min 6 characters"
              value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>I want to join as</label>
            <select className="form-control" name="role" value={form.role} onChange={handleChange}>
              <option value="student">🎓 Student – I want to learn</option>
              <option value="instructor">👨‍🏫 Instructor – I want to teach</option>
            </select>
          </div>
          <button className="btn btn-primary" type="submit" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
