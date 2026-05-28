import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { userAPI } from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetch = () => {
    setLoading(true);
    userAPI.getAll().then(res => setUsers(res.data.users || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await userAPI.delete(id);
      toast.success('User deleted');
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="container" style={{ paddingTop:'2rem', paddingBottom:'4rem' }}>
      <div className="page-header">
        <h1>👥 Manage Users</h1>
        <p>{users.length} total users registered</p>
      </div>

      <input className="form-control" placeholder="Search by name or email..."
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ marginBottom:'1.5rem', maxWidth:'400px' }} />

      <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {['all','student','instructor','admin'].map(r => (
          <span key={r} className="badge badge-primary" style={{ padding:'0.4rem 0.9rem', cursor:'default' }}>
            {r}: {r === 'all' ? users.length : users.filter(u => u.role === r).length}
          </span>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id}>
                <td><strong>{u.name}</strong></td>
                <td style={{ color:'var(--text-secondary)' }}>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'instructor' ? 'badge-warning' : 'badge-primary'}`}>
                    {u.role}
                  </span>
                </td>
                <td style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id, u.name)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state" style={{ padding:'2rem' }}>
            <p>No users match your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
