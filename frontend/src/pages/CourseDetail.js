import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { courseAPI, enrollmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeLesson, setActiveLesson] = useState(0);

  useEffect(() => {
    courseAPI.getOne(id).then(res => setCourse(res.data.course)).finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'student') { toast.error('Only students can enroll'); return; }
    setEnrolling(true);
    try {
      await enrollmentAPI.enroll(id);
      toast.success('Enrolled successfully! 🎉');
      navigate('/student/my-courses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally { setEnrolling(false); }
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
  if (!course) return <div className="container" style={{padding:'4rem 1.5rem', textAlign:'center'}}><h2>Course not found</h2></div>;

  return (
    <div className="container" style={{ paddingTop:'2rem', paddingBottom:'4rem' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'2rem', alignItems:'start' }}>
        {/* Left */}
        <div>
          <span className="badge badge-warning" style={{marginBottom:'0.8rem', display:'inline-block'}}>{course.category}</span>
          <h1 style={{ fontSize:'2rem', marginBottom:'1rem', lineHeight:1.3 }}>{course.title}</h1>
          <p style={{ color:'var(--text-secondary)', marginBottom:'1.5rem', lineHeight:1.7 }}>{course.description}</p>
          <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap', marginBottom:'2rem' }}>
            <span>👨‍🏫 <strong>{course.instructor?.name}</strong></span>
            <span>📖 <strong>{course.lessons?.length || 0} lessons</strong></span>
            <span>🎯 <strong>{course.level}</strong></span>
            <span>👥 <strong>{course.totalStudents} students</strong></span>
          </div>

          {/* Lessons */}
          {course.lessons?.length > 0 && (
            <div className="card" style={{padding:'1.5rem'}}>
              <h2 style={{marginBottom:'1rem', fontSize:'1.2rem'}}>📋 Course Curriculum</h2>
              {course.lessons.map((lesson, i) => (
                <div key={i}
                  onClick={() => setActiveLesson(i)}
                  style={{
                    padding:'0.9rem 1rem', marginBottom:'0.5rem',
                    background: activeLesson === i ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${activeLesson === i ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius:'var(--radius)', cursor:'pointer', transition:'all 0.2s',
                    display:'flex', justifyContent:'space-between', alignItems:'center'
                  }}>
                  <span>📄 Lesson {i + 1}: {lesson.title}</span>
                  <span style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{lesson.duration}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="card" style={{ position:'sticky', top:'90px' }}>
          <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
            <div style={{ fontSize:'2.5rem', fontWeight:800, color:'var(--accent)', marginBottom:'0.3rem' }}>
              {course.price === 0 ? 'FREE' : `$${course.price}`}
            </div>
            <span className="badge badge-primary">{course.level}</span>
          </div>
          <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', marginBottom:'0.8rem' }}
            onClick={handleEnroll} disabled={enrolling}>
            {enrolling ? 'Enrolling...' : '🚀 Enroll Now'}
          </button>
          <div style={{ fontSize:'0.85rem', color:'var(--text-muted)', textAlign:'center' }}>
            30-day money-back guarantee
          </div>
          <hr style={{ border:'none', borderTop:'1px solid var(--border)', margin:'1rem 0' }} />
          <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem', fontSize:'0.9rem' }}>
            <div>📚 {course.lessons?.length || 0} lessons</div>
            <div>🎯 Level: {course.level}</div>
            <div>👥 {course.totalStudents} enrolled</div>
            <div>📂 Category: {course.category}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
