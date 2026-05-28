import React from 'react';

const About = () => (
  <div className="container" style={{ paddingTop:'3rem', paddingBottom:'5rem' }}>
    <div style={{ textAlign:'center', marginBottom:'4rem' }}>
      <h1 style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>
        About <span style={{ color:'var(--primary)' }}>LearnHub</span>
      </h1>
      <p style={{ color:'var(--text-secondary)', maxWidth:'600px', margin:'0 auto', fontSize:'1.05rem', lineHeight:1.8 }}>
        LearnHub is a modern Learning Management System built on the MERN stack, designed to connect
        passionate instructors with eager learners worldwide.
      </p>
    </div>

    <div className="grid-3" style={{ marginBottom:'4rem' }}>
      {[
        { icon:'🎯', title:'Our Mission', desc:'To make quality education accessible to everyone, everywhere, by providing a powerful platform for knowledge sharing.' },
        { icon:'👁️', title:'Our Vision', desc:'A world where anyone can learn any skill from the best teachers, regardless of geography or background.' },
        { icon:'💡', title:'Our Values', desc:'Integrity, innovation, and inclusion drive everything we do. We believe in lifelong learning for all.' },
      ].map((item, i) => (
        <div key={i} className="card" style={{ textAlign:'center', padding:'2rem' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>{item.icon}</div>
          <h3 style={{ marginBottom:'0.8rem' }}>{item.title}</h3>
          <p style={{ color:'var(--text-secondary)', lineHeight:1.7 }}>{item.desc}</p>
        </div>
      ))}
    </div>

    <div className="card" style={{ padding:'3rem', textAlign:'center', background:'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(67,233,123,0.05))' }}>
      <h2 style={{ marginBottom:'0.8rem' }}>Built with MERN Stack</h2>
      <p style={{ color:'var(--text-secondary)', marginBottom:'2rem' }}>Powered by industry-standard technologies</p>
      <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center', flexWrap:'wrap' }}>
        {['MongoDB','Express.js','React JS','Node.js','JWT Auth','Mongoose'].map(tech => (
          <span key={tech} className="badge badge-primary" style={{ padding:'0.5rem 1.2rem', fontSize:'0.9rem' }}>{tech}</span>
        ))}
      </div>
    </div>
  </div>
);

export default About;
