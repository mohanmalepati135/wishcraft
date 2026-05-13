import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';
import StatsCard from '../../components/admin/StatsCard';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get('/analytics/dashboard');
        setStats(data);
      } catch (err) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main"><div className="admin-loading">Loading dashboard...</div></main>
    </div>
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="admin-main__title">Dashboard Overview</h1>

          <div className="admin-stats-grid">
            <StatsCard title="Total Views" value={stats?.totalViews || 0} icon="👁️" color="#7C3AED" delay={0} />
            <StatsCard title="Total Shares" value={stats?.totalShares || 0} icon="🔗" color="#3B82F6" delay={0.1} />
            <StatsCard title="Downloads" value={stats?.totalDownloads || 0} icon="⬇️" color="#10B981" delay={0.2} />
            <StatsCard title="Total Users" value={stats?.totalUsers || 0} icon="👥" color="#F59E0B" delay={0.3} />
            <StatsCard title="Guest Users" value={stats?.totalGuests || 0} icon="👤" color="#EC4899" delay={0.4} />
            <StatsCard title="Templates" value={stats?.totalTemplates || 0} icon="🎨" color="#14B8A6" delay={0.5} />
          </div>

          <div className="admin-sections">
            <div className="admin-section">
              <h2 className="admin-section__title">Top Templates</h2>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr><th>Title</th><th>Category</th><th>Views</th><th>Shares</th><th>Downloads</th></tr>
                  </thead>
                  <tbody>
                    {stats?.topTemplates?.map(t => (
                      <tr key={t._id}>
                        <td>{t.title}</td>
                        <td><span className="admin-tag">{t.category}</span></td>
                        <td>{t.viewCount}</td>
                        <td>{t.shareCount}</td>
                        <td>{t.downloadCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="admin-section">
              <h2 className="admin-section__title">Category Breakdown</h2>
              <div className="admin-categories">
                {stats?.categoryStats?.map(c => (
                  <div key={c._id} className="admin-category-bar">
                    <div className="admin-category-bar__label">
                      <span>{c._id || 'Unknown'}</span>
                      <span>{c.count} views</span>
                    </div>
                    <div className="admin-category-bar__track">
                      <motion.div className="admin-category-bar__fill" initial={{ width: 0 }} animate={{ width: `${Math.min((c.count / (stats?.totalViews || 1)) * 100 * 5, 100)}%` }} transition={{ duration: 0.8, delay: 0.2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
