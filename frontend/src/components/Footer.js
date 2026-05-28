import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{
    background: 'var(--bg-card)', borderTop: '1px solid var(--border)',
    padding: '2rem 0', marginTop: '4rem'
  }}>
    <div className="container" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
      <div>
        <div style={{ fontFamily:'Outfit', fontSize:'1.2rem', fontWeight:800, marginBottom:'0.3rem' }}>
          🎓 Learn<span style={{ color:'var(--primary)' }}>Hub</span>
        </div>
        <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>Empowering learners worldwide</p>
      </div>
      <div style={{ display:'flex', gap:'2rem', flexWrap:'wrap' }}>
        <Link to="/" style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>Home</Link>
        <Link to="/courses" style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>Courses</Link>
        <Link to="/about" style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>About</Link>
      </div>
      <p style={{ color:'var(--text-muted)', fontSize:'0.8rem' }}>© {new Date().getFullYear()} LearnHub. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
