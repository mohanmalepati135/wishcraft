import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import CanvasEditor from '../components/editor/CanvasEditor';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import './EditorPage.css';

const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const { data } = await axiosInstance.get(`/templates/${id}`);
        setTemplate(data);
      } catch (err) {
        toast.error('Template not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="editor-page__loading">
        <div className="editor-page__spinner" />
        <p>Loading template...</p>
      </div>
    );
  }

  return (
    <motion.div className="editor-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="editor-page__header">
        <button className="editor-page__back" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Back
        </button>
        <h1 className="editor-page__title">Personalize Your Greeting</h1>
        <div className="editor-page__spacer" />
      </div>
      <div className="container">
        <CanvasEditor template={template} user={user} />
      </div>
    </motion.div>
  );
};

export default EditorPage;
