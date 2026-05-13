import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';
import TemplateForm from '../../components/admin/TemplateForm';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Modal from '../../components/common/Modal';
import './AdminTemplates.css';

const AdminTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/templates');
      setTemplates(data);
    } catch (err) {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      await axiosInstance.delete(`/templates/${id}`);
      toast.success('Template deleted');
      fetchTemplates();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate({ ...template, tags: template.tags?.join(', ') || '' });
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTemplate(null);
    fetchTemplates();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="admin-header">
            <h1 className="admin-main__title">Template Manager</h1>
            <button className="admin-btn admin-btn--primary" onClick={() => { setEditingTemplate(null); setShowForm(true); }}>
              + Add Template
            </button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table admin-table--templates">
              <thead>
                <tr>
                  <th>Image</th><th>Title</th><th>Category</th><th>Type</th><th>Views</th><th>Shares</th><th>Downloads</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map(t => (
                  <tr key={t._id}>
                    <td><img src={t.backgroundImage} alt="" className="admin-template-thumb" /></td>
                    <td>{t.title}</td>
                    <td><span className="admin-tag">{t.category}</span></td>
                    <td>{t.isPremium ? <span className="admin-badge admin-badge--premium">Premium</span> : <span className="admin-badge admin-badge--free">Free</span>}</td>
                    <td>{t.viewCount}</td>
                    <td>{t.shareCount}</td>
                    <td>{t.downloadCount}</td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-action-btn" onClick={() => handleEdit(t)}>✏️</button>
                        <button className="admin-action-btn admin-action-btn--danger" onClick={() => handleDelete(t._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <TemplateForm onSuccess={handleFormSuccess} initialData={editingTemplate} />
      </Modal>
    </div>
  );
};

export default AdminTemplates;
