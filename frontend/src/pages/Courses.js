import React, { useState, useEffect, useCallback } from 'react';
import { courseAPI } from '../services/api';
import CourseCard from '../components/CourseCard';
import '../components/CourseCard.css';

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Design', 'Business', 'Marketing', 'Mobile', 'DevOps'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');

  const fetchCourses = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category !== 'All') params.category = category;
    if (level !== 'All') params.level = level;
    courseAPI.getAll(params)
      .then(res => setCourses(res.data.courses || []))
      .finally(() => setLoading(false));
  }, [search, category, level]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleSearch = (e) => { e.preventDefault(); fetchCourses(); };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="page-header">
        <h1>Explore Courses</h1>
        <p>Find the perfect course to level up your skills</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ display:'flex', gap:'0.8rem', marginBottom:'1.5rem' }}>
        <input className="form-control" placeholder="Search courses..." value={search}
          onChange={e => setSearch(e.target.value)} style={{ flex:1 }} />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {/* Filters */}
      <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'2rem' }}>
        {CATEGORIES.map(c => (
          <button key={c} className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'2rem' }}>
        {LEVELS.map(l => (
          <button key={l} className={`btn btn-sm ${level === l ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setLevel(l)}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div className="loading-page"><div className="spinner"></div></div>
      ) : courses.length > 0 ? (
        <div className="grid-3">{courses.map(c => <CourseCard key={c._id} course={c} />)}</div>
      ) : (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>No courses found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
