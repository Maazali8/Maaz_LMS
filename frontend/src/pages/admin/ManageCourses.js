import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { courseAPI } from '../../services/api';

const AdminManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetch = () => {
    setLoading(true);
    courseAPI.getAll().then(res => setCourses(res.data.courses || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete course "${title}"?`)) return;
    try {
      await courseAPI.delete(id);
      toast.success('Course deleted');
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="container" style={{ paddingTop:'2rem', paddingBottom:'4rem' }}>
      <div className="page-header">
        <h1>📚 Manage All Courses</h1>
        <p>{courses.length} total courses on platform</p>
      </div>

      <input className="form-control" placeholder="Search by title or category..."
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ marginBottom:'1.5rem', maxWidth:'400px' }} />

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Title</th><th>Instructor</th><th>Category</th><th>Students</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c._id}>
                <td><strong>{c.title}</strong></td>
                <td style={{ color:'var(--text-secondary)' }}>{c.instructor?.name}</td>
                <td><span className="badge badge-warning">{c.category}</span></td>
                <td>👥 {c.totalStudents}</td>
                <td><span className={`badge ${c.isPublished ? 'badge-success' : 'badge-danger'}`}>{c.isPublished ? 'Published' : 'Draft'}</span></td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id, c.title)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state" style={{ padding:'2rem' }}><p>No courses found</p></div>}
      </div>
    </div>
  );
};

export default AdminManageCourses;
