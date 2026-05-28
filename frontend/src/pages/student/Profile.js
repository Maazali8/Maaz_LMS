import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(form);
      updateUser(res.data.user);
      toast.success('Profile updated! ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container" style={{ paddingTop:'2rem', paddingBottom:'4rem', maxWidth:'700px' }}>
      <div className="page-header">
        <h1>👤 My Profile</h1>
        <p>Manage your personal information</p>
      </div>

      <div className="card">
        <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', marginBottom:'2rem', paddingBottom:'1.5rem', borderBottom:'1px solid var(--border)' }}>
          <div style={{
            width:'80px', height:'80px', borderRadius:'50%',
            background: form.avatar ? `url(${form.avatar}) center/cover` : 'linear-gradient(135deg, var(--primary), var(--accent))',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', flexShrink:0
          }}>
            {!form.avatar && '👤'}
          </div>
          <div>
            <h2 style={{ marginBottom:'0.3rem' }}>{user?.name}</h2>
            <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>{user?.email}</p>
            <span className="badge badge-primary" style={{ marginTop:'0.3rem' }}>{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Avatar URL</label>
            <input className="form-control" placeholder="https://example.com/avatar.jpg"
              value={form.avatar} onChange={e => setForm({...form, avatar: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea className="form-control" rows={4} placeholder="Tell us about yourself..."
              value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Email (read-only)</label>
            <input className="form-control" value={user?.email} disabled style={{ opacity:0.5 }} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : '💾 Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
