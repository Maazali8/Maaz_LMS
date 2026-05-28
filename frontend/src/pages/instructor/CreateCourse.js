import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { courseAPI } from '../../services/api';

const CATEGORIES = ['Web Development','Data Science','Design','Business','Marketing','Mobile','DevOps','Other'];

const CreateCourse = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', description:'', category:'Web Development', price:0, thumbnail:'', level:'Beginner', isPublished: false });
  const [lessons, setLessons] = useState([]);
  const [lessonForm, setLessonForm] = useState({ title:'', content:'', videoUrl:'', duration:'30 min' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [courseId, setCourseId] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await courseAPI.create(form);
      setCourseId(res.data.course._id);
      toast.success('Course created! Now add lessons.');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally { setLoading(false); }
  };

  const addLesson = async e => {
    e.preventDefault();
    if (!lessonForm.title) { toast.error('Lesson title required'); return; }
    setLoading(true);
    try {
      await courseAPI.addLesson(courseId, lessonForm);
      setLessons([...lessons, lessonForm]);
      setLessonForm({ title:'', content:'', videoUrl:'', duration:'30 min' });
      toast.success('Lesson added! ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add lesson');
    } finally { setLoading(false); }
  };

  const finish = () => { toast.success('Course published! 🎉'); navigate('/instructor/courses'); };

  return (
    <div className="container" style={{ paddingTop:'2rem', paddingBottom:'4rem', maxWidth:'800px' }}>
      <div className="page-header">
        <h1>✏️ Create New Course</h1>
        <p>Step {step} of 2 – {step === 1 ? 'Course Details' : 'Add Lessons'}</p>
      </div>

      {/* Step indicator */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'2rem' }}>
        {[1,2].map(s => (
          <div key={s} style={{ flex:1, height:'4px', borderRadius:'999px', background: step >= s ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }} />
        ))}
      </div>

      {step === 1 && (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Course Title *</label>
              <input className="form-control" placeholder="e.g. Complete React JS Bootcamp"
                value={form.title} onChange={e => setForm({...form, title:e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea className="form-control" rows={5} placeholder="Describe what students will learn..."
                value={form.description} onChange={e => setForm({...form, description:e.target.value})} required />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div className="form-group">
                <label>Category</label>
                <select className="form-control" value={form.category} onChange={e => setForm({...form, category:e.target.value})}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Level</label>
                <select className="form-control" value={form.level} onChange={e => setForm({...form, level:e.target.value})}>
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div className="form-group">
                <label>Price ($) – 0 for free</label>
                <input className="form-control" type="number" min="0"
                  value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
              </div>
              <div className="form-group">
                <label>Thumbnail URL</label>
                <input className="form-control" placeholder="https://..." value={form.thumbnail}
                  onChange={e => setForm({...form, thumbnail:e.target.value})} />
              </div>
            </div>
            <div className="form-group" style={{ display:'flex', alignItems:'center', gap:'0.8rem' }}>
              <input type="checkbox" id="publish" checked={form.isPublished}
                onChange={e => setForm({...form, isPublished:e.target.checked})} />
              <label htmlFor="publish" style={{ margin:0 }}>Publish immediately</label>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Course & Add Lessons →'}
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div>
          {lessons.length > 0 && (
            <div className="card" style={{ marginBottom:'1.5rem' }}>
              <h3 style={{ marginBottom:'1rem' }}>📋 Lessons Added ({lessons.length})</h3>
              {lessons.map((l, i) => (
                <div key={i} style={{ padding:'0.8rem', background:'rgba(108,99,255,0.08)', borderRadius:'var(--radius)', marginBottom:'0.5rem', display:'flex', justifyContent:'space-between' }}>
                  <span>📄 Lesson {i+1}: {l.title}</span>
                  <span style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{l.duration}</span>
                </div>
              ))}
            </div>
          )}

          <div className="card">
            <h3 style={{ marginBottom:'1.5rem' }}>➕ Add Lesson</h3>
            <form onSubmit={addLesson}>
              <div className="form-group">
                <label>Lesson Title *</label>
                <input className="form-control" placeholder="e.g. Introduction to React"
                  value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title:e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Content / Notes</label>
                <textarea className="form-control" rows={3} placeholder="Lesson content or notes..."
                  value={lessonForm.content} onChange={e => setLessonForm({...lessonForm, content:e.target.value})} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div className="form-group">
                  <label>Video URL</label>
                  <input className="form-control" placeholder="https://youtube.com/..."
                    value={lessonForm.videoUrl} onChange={e => setLessonForm({...lessonForm, videoUrl:e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input className="form-control" placeholder="e.g. 15 min"
                    value={lessonForm.duration} onChange={e => setLessonForm({...lessonForm, duration:e.target.value})} />
                </div>
              </div>
              <div style={{ display:'flex', gap:'1rem' }}>
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? 'Adding...' : '+ Add Lesson'}
                </button>
                <button className="btn btn-outline" type="button" onClick={finish}>
                  ✅ Done – Finish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCourse;
