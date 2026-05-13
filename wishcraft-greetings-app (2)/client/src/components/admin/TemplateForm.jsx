import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';
import './TemplateForm.css';

const categories = ['Shayari', 'Birthday', 'Anniversary', 'Festivals', 'Joke', 'Updesh', 'Love', 'Friendship', 'Motivation', 'More'];

const TemplateForm = ({ onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || '')
      };
    }
    return {
      title: '', category: 'Shayari', backgroundImage: '', quoteText: '', isPremium: false, trending: false, tags: ''
    };
  });
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'backgroundImage') {
      setImageError(false);
      setImageLoading(true);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (initialData) {
        await axiosInstance.put(`/templates/${initialData._id}`, payload);
        toast.success('Template updated!');
      } else {
        await axiosInstance.post('/templates', payload);
        toast.success('Template created!');
      }
      onSuccess();
    } catch (err) {
      console.error('Template save error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save template';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form className="template-form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="template-form__title">{initialData ? 'Edit Template' : 'Add New Template'}</h2>

      <div className="template-form__group">
        <label className="template-form__label">Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} className="template-form__input" placeholder="Template title" required />
      </div>

      <div className="template-form__group">
        <label className="template-form__label">Category</label>
        <select name="category" value={formData.category} onChange={handleChange} className="template-form__input">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="template-form__group">
        <label className="template-form__label">Background Image URL</label>
        <input 
          type="url" 
          name="backgroundImage" 
          value={formData.backgroundImage} 
          onChange={handleChange} 
          className="template-form__input" 
          placeholder="https://example.com/image.jpg" 
          required 
        />
        <small style={{ color: '#999', fontSize: '12px' }}>Use URLs from services like: picsum.photos, unsplash.com, pexels.com</small>

        {/* Image Preview */}
        {formData.backgroundImage && (
          <div className="template-form__preview">
            {imageLoading && <div className="template-form__preview-loading">Loading preview...</div>}
            {imageError && (
              <div className="template-form__preview-error">
                ⚠️ Unable to load preview (may be CORS blocked). Image will still be saved if URL is valid.
              </div>
            )}
            <img 
              src={formData.backgroundImage} 
              alt="Preview" 
              className={`template-form__preview-img ${imageLoading || imageError ? 'hidden' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              crossOrigin="anonymous"
            />
          </div>
        )}
      </div>

      <div className="template-form__group">
        <label className="template-form__label">Quote Text</label>
        <textarea name="quoteText" value={formData.quoteText} onChange={handleChange} className="template-form__textarea" placeholder="Enter the quote/wish text..." rows="3" required />
      </div>

      <div className="template-form__group">
        <label className="template-form__label">Tags (comma separated)</label>
        <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="template-form__input" placeholder="love, romantic, birthday" />
      </div>

      <div className="template-form__checkboxes">
        <label className="template-form__checkbox">
          <input type="checkbox" name="isPremium" checked={formData.isPremium} onChange={handleChange} />
          <span>Premium Template</span>
        </label>
        <label className="template-form__checkbox">
          <input type="checkbox" name="trending" checked={formData.trending} onChange={handleChange} />
          <span>Trending</span>
        </label>
      </div>

      <button type="submit" className="template-form__submit" disabled={loading || imageLoading}>
        {loading ? 'Saving...' : (initialData ? 'Update Template' : 'Create Template')}
      </button>
    </motion.form>
  );
};

export default TemplateForm;
