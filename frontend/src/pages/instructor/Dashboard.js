import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseAPI.getMyCourses()
      .then(res => setCourses(res.data.courses || []))
      .finally(() => setLoading(false));
  }, []);

  const totalStudents = courses.reduce((acc, c) => acc + (c.totalStudents || 0), 0);
  const published = courses.filter(c => c.isPublished).length;

  const stats = [
    { icon:'📚', label:'Total Courses', value: courses.length, color:'#6c63ff' },
    { icon:'✅', label:'Published', value: published, color:'#43e97b' },
    { icon:'👥', label:'Total Students', value: totalStudents, color:'#f7971e' },
  ];

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="container" style={{ paddingTop:'2rem', paddingBottom:'4rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem', marginBottom:'2rem' }}>
        <div>
          <h1 style={{ fontSize:'1.8rem', marginBottom:'0.3rem' }}>👨‍🏫 Instructor Dashboard</h1>
          <p style={{ color:'var(--text-secondary)' }}>Welcome back, {user?.name?.split(' ')[0]}!</p>
        </div>
        <Link to="/instructor/create-course" className="btn btn-primary">+ Create Course</Link>
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
        <h2 style={{ fontSize:'1.2rem' }}>📋 My Courses</h2>
        <Link to="/instructor/courses" className="btn btn-outline btn-sm">Manage All</Link>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state card">
          <div className="icon">🎓</div>
          <h3>No courses yet</h3>
          <p>Create your first course and start teaching!</p>
          <Link to="/instructor/create-course" className="btn btn-primary" style={{ marginTop:'1rem' }}>Create Course</Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Category</th><th>Students</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {courses.slice(0, 5).map(c => (
                <tr key={c._id}>
                  <td><strong>{c.title}</strong></td>
                  <td><span className="badge badge-warning">{c.category}</span></td>
                  <td>👥 {c.totalStudents}</td>
                  <td><span className={`badge ${c.isPublished ? 'badge-success' : 'badge-danger'}`}>{c.isPublished ? 'Published' : 'Draft'}</span></td>
                  <td><Link to="/instructor/courses" className="btn btn-outline btn-sm">Manage</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
