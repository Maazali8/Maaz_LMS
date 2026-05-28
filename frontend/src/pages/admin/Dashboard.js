import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../services/api';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getAnalytics().then(res => setAnalytics(res.data.analytics)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  const stats = [
    { icon:'👥', label:'Total Users', value: analytics?.totalUsers, color:'#6c63ff' },
    { icon:'🎓', label:'Students', value: analytics?.totalStudents, color:'#43e97b' },
    { icon:'👨‍🏫', label:'Instructors', value: analytics?.totalInstructors, color:'#f7971e' },
    { icon:'📚', label:'Courses', value: analytics?.totalCourses, color:'#ff6584' },
    { icon:'✅', label:'Published', value: analytics?.publishedCourses, color:'#43e97b' },
    { icon:'📊', label:'Enrollments', value: analytics?.totalEnrollments, color:'#6c63ff' },
  ];

  return (
    <div className="container" style={{ paddingTop:'2rem', paddingBottom:'4rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem', marginBottom:'2rem' }}>
        <div>
          <h1 style={{ fontSize:'1.8rem' }}>🛡️ Admin Dashboard</h1>
          <p style={{ color:'var(--text-secondary)' }}>Platform overview and management</p>
        </div>
        <div style={{ display:'flex', gap:'0.8rem' }}>
          <Link to="/admin/users" className="btn btn-outline btn-sm">Manage Users</Link>
          <Link to="/admin/courses" className="btn btn-primary btn-sm">Manage Courses</Link>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom:'3rem' }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background:`${s.color}20` }}>
              <span style={{ fontSize:'1.5rem' }}>{s.icon}</span>
            </div>
            <div className="stat-info">
              <h3 style={{ color: s.color }}>{s.value ?? 0}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Recent Users */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
            <h3>👥 Recent Users</h3>
            <Link to="/admin/users" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {analytics?.recentUsers?.map(u => (
            <div key={u._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.7rem 0', borderBottom:'1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight:600 }}>{u.name}</div>
                <div style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{u.email}</div>
              </div>
              <span className="badge badge-primary">{u.role}</span>
            </div>
          ))}
        </div>

        {/* Popular Courses */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
            <h3>🔥 Popular Courses</h3>
            <Link to="/admin/courses" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {analytics?.popularCourses?.map(c => (
            <div key={c._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.7rem 0', borderBottom:'1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight:600 }}>{c.title}</div>
                <div style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{c.category}</div>
              </div>
              <span className="badge badge-success">👥 {c.totalStudents}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
