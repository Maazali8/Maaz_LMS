import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import CourseCard from '../components/CourseCard';
import '../components/CourseCard.css';
import './Home.css';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseAPI.getAll().then(res => setCourses(res.data.courses?.slice(0, 6) || [])).finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: '🎓', value: '10,000+', label: 'Students' },
    { icon: '📚', value: '500+', label: 'Courses' },
    { icon: '👨‍🏫', label: 'Instructors', value: '200+' },
    { icon: '⭐', label: 'Avg Rating', value: '4.8' },
  ];

  const features = [
    { icon: '🚀', title: 'Learn at Your Pace', desc: 'Access course content anytime, anywhere at your own speed.' },
    { icon: '🎯', title: 'Expert Instructors', desc: 'Learn from industry professionals with real-world experience.' },
    { icon: '📜', title: 'Get Certified', desc: 'Earn certificates upon course completion to boost your career.' },
    { icon: '💬', title: 'Community Support', desc: 'Join a thriving community of learners and mentors.' },
  ];

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-badge">🔥 #1 Learning Platform</div>
          <h1>Unlock Your <span className="gradient-text">Potential</span><br />Start Learning Today</h1>
          <p>Join thousands of learners and take your skills to the next level with expert-led courses.</p>
          <div className="hero-actions">
            <Link to="/courses" className="btn btn-primary">Explore Courses</Link>
            <Link to="/register" className="btn btn-outline">Get Started Free</Link>
          </div>
          <div className="hero-stats">
            {stats.map((s, i) => (
              <div key={i} className="hero-stat">
                <span className="hero-stat-val">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose <span className="gradient-text">LearnHub</span>?</h2>
            <p>Everything you need to learn, grow and succeed</p>
          </div>
          <div className="grid-4">
            {features.map((f, i) => (
              <div key={i} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Featured <span className="gradient-text">Courses</span></h2>
            <p>Start learning from our top-rated courses</p>
          </div>
          {loading ? (
            <div className="loading-page"><div className="spinner"></div></div>
          ) : courses.length > 0 ? (
            <>
              <div className="grid-3">
                {courses.map(c => <CourseCard key={c._id} course={c} />)}
              </div>
              <div style={{ textAlign:'center', marginTop:'2rem' }}>
                <Link to="/courses" className="btn btn-outline">View All Courses →</Link>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="icon">📚</div>
              <h3>No courses yet</h3>
              <p>Be the first to create a course!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to Start Learning?</h2>
            <p>Join over 10,000 students already learning on LearnHub</p>
            <Link to="/register" className="btn btn-primary">Create Free Account →</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
