import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    enrollmentAPI.getMyCourses()
      .then(res => setEnrollments(res.data.enrollments || []))
      .finally(() => setLoading(false));
  }, []);

  const completed = enrollments.filter(e => e.status === 'completed').length;
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length)
    : 0;

  const stats = [
    { icon:'📚', label:'Enrolled Courses', value: enrollments.length, color:'#6c63ff' },
    { icon:'✅', label:'Completed', value: completed, color:'#43e97b' },
    { icon:'📊', label:'Avg Progress', value: `${avgProgress}%`, color:'#f7971e' },
  ];

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="container" style={{ paddingTop:'2rem', paddingBottom:'4rem' }}>
      <div className="page-header">
        <h1>👋 Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p>Track your learning progress and continue where you left off.</p>
      </div>

      <div className="grid-4" style={{ marginBottom:'2.5rem' }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background:`${s.color}20` }}>
              <span style={{ fontSize:'1.5rem' }}>{s.icon}</span>
            </div>
            <div className="stat-info">
              <h3 style={{ color: s.color }}>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <h2 style={{ fontSize:'1.3rem' }}>📖 My Recent Courses</h2>
        <Link to="/student/my-courses" className="btn btn-outline btn-sm">View All</Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="empty-state card">
          <div className="icon">🎓</div>
          <h3>No courses yet</h3>
          <p>Start your learning journey today!</p>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop:'1rem' }}>Browse Courses</Link>
        </div>
      ) : (
        <div className="grid-3">
          {enrollments.slice(0, 3).map(e => (
            <div key={e._id} className="card">
              <h3 style={{ fontSize:'1rem', marginBottom:'0.5rem' }}>{e.course?.title}</h3>
              <p style={{ color:'var(--text-secondary)', fontSize:'0.85rem', marginBottom:'1rem' }}>
                👨‍🏫 {e.course?.instructor?.name}
              </p>
              <div className="progress-bar" style={{ marginBottom:'0.5rem' }}>
                <div className="progress-fill" style={{ width:`${e.progress}%` }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.8rem', color:'var(--text-muted)' }}>
                <span>{e.progress}% complete</span>
                <span className={`badge ${e.status === 'completed' ? 'badge-success' : 'badge-primary'}`}>{e.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop:'2.5rem', display:'flex', gap:'1rem' }}>
        <Link to="/courses" className="btn btn-primary">Explore More Courses</Link>
        <Link to="/student/profile" className="btn btn-outline">Edit Profile</Link>
      </div>
    </div>
  );
};

export default StudentDashboard;
