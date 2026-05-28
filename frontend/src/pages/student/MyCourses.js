import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentAPI } from '../../services/api';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    enrollmentAPI.getMyCourses()
      .then(res => setEnrollments(res.data.enrollments || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="container" style={{ paddingTop:'2rem', paddingBottom:'4rem' }}>
      <div className="page-header">
        <h1>📚 My Courses</h1>
        <p>All your enrolled courses in one place</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="empty-state card">
          <div className="icon">📭</div>
          <h3>No enrolled courses</h3>
          <p>Browse our catalog and start learning today!</p>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop:'1.2rem' }}>Browse Courses</Link>
        </div>
      ) : (
        <div className="grid-3">
          {enrollments.map(e => (
            <div key={e._id} className="card" style={{ padding:0, overflow:'hidden' }}>
              <div style={{
                height:'120px',
                background: e.course?.thumbnail
                  ? `url(${e.course.thumbnail}) center/cover`
                  : 'linear-gradient(135deg, rgba(108,99,255,0.3), rgba(67,233,123,0.15))',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem'
              }}>
                {!e.course?.thumbnail && '📚'}
              </div>
              <div style={{ padding:'1.2rem' }}>
                <span className={`badge ${e.status === 'completed' ? 'badge-success' : 'badge-primary'}`} style={{ marginBottom:'0.6rem', display:'inline-block' }}>
                  {e.status}
                </span>
                <h3 style={{ fontSize:'1rem', marginBottom:'0.4rem', lineHeight:1.3 }}>{e.course?.title}</h3>
                <p style={{ color:'var(--text-secondary)', fontSize:'0.8rem', marginBottom:'1rem' }}>
                  👨‍🏫 {e.course?.instructor?.name}
                </p>
                <div className="progress-bar" style={{ marginBottom:'0.4rem' }}>
                  <div className="progress-fill" style={{ width:`${e.progress}%` }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.8rem', color:'var(--text-muted)' }}>
                  <span>{e.progress}% complete</span>
                  <Link to={`/courses/${e.course?._id}`} style={{ color:'var(--primary-light)' }}>Continue →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
