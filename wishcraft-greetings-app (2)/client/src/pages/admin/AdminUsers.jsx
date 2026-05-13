import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosInstance.get('/analytics/users');
        setUsers(data);
      } catch (err) {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main"><div className="admin-loading">Loading users...</div></main>
    </div>
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="admin-main__title">User Management</h1>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Type</th><th>Subscription</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div className="admin-user-cell">
                        <img src={u.profilePicture || '/default-avatar.svg'} alt="" className="admin-user-avatar" />
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email || 'N/A'}</td>
                    <td>
                      {u.isAdmin ? <span className="admin-badge admin-badge--premium">Admin</span> :
                       u.isGuest ? <span className="admin-badge admin-badge--free">Guest</span> :
                       <span className="admin-badge" style={{background:'var(--primary-glow)',color:'var(--primary)'}}>User</span>}
                    </td>
                    <td>{u.subscription?.plan || 'Free'}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminUsers;
