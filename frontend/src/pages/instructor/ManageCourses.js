import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { courseAPI } from '../../services/api';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCourse, setEditCourse] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    setLoading(true);
    courseAPI.getMyCourses().then(res => setCourses(res.data.courses || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    try {
      await courseAPI.delete(id);
      toast.success('Course deleted');
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const handleTogglePublish = async (course) => {
    try {
      await courseAPI.update(course._id, { isPublished: !course.isPublished });
      toast.success(`Course ${!course.isPublished ? 'published' : 'unpublished'}!`);
      fetch();
    } catch (err) { toast.error('Update failed'); }
  };

  const handleEdit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      await courseAPI.update(editCourse._id, editCourse);
      toast.success('Course updated!'); setEditCourse(null); fetch();
    } catch (err) { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="container" style={{ paddingTop:'2rem', paddingBottom:'4rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'1.8rem' }}>📋 Manage Courses</h1>
          <p style={{ color:'var(--text-secondary)' }}>{courses.length} course(s) total</p>
        </div>
        <Link to="/instructor/create-course" className="btn btn-primary">+ New Course</Link>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state card">
          <div className="icon">📭</div>
          <h3>No courses yet</h3>
          <Link to="/instructor/create-course" className="btn btn-primary" style={{ marginTop:'1rem' }}>Create First Course</Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Title</th><th>Category</th><th>Level</th><th>Students</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c._id}>
                  <td><strong>{c.title}</strong></td>
                  <td><span className="badge badge-warning">{c.category}</span></td>
                  <td>{c.level}</td>
                  <td>👥 {c.totalStudents}</td>
                  <td>
                    <span className={`badge ${c.isPublished ? 'badge-success' : 'badge-danger'}`}>
                      {c.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => setEditCourse({...c})}>Edit</button>
                      <button className="btn btn-outline btn-sm" onClick={() => handleTogglePublish(c)}>
                        {c.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editCourse && (
        <div className="modal-overlay" onClick={() => setEditCourse(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Edit Course</h2>
              <button className="modal-close" onClick={() => setEditCourse(null)}>✕</button>
            </div>
            <form onSubmit={handleEdit}>
              <div className="form-group">
                <label>Title</label>
                <input className="form-control" value={editCourse.title}
                  onChange={e => setEditCourse({...editCourse, title:e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows={3} value={editCourse.description}
                  onChange={e => setEditCourse({...editCourse, description:e.target.value})} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input className="form-control" type="number" min="0" value={editCourse.price}
                    onChange={e => setEditCourse({...editCourse, price:Number(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label>Level</label>
                  <select className="form-control" value={editCourse.level}
                    onChange={e => setEditCourse({...editCourse, level:e.target.value})}>
                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
