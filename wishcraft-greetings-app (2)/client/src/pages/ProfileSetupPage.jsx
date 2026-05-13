import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import './ProfileSetupPage.css';

const ProfileSetupPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [preview, setPreview] = useState(user?.profilePicture || '');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (fileRef.current?.files[0]) formData.append('profilePicture', fileRef.current.files[0]);
      const { data } = await axiosInstance.put('/auth/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(data);
      toast.success('Profile updated!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-setup">
      <motion.div className="profile-setup__card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="profile-setup__title">Set Up Your Profile</h1>
        <p className="profile-setup__subtitle">Personalize your greeting cards</p>
        <form onSubmit={handleSubmit} className="profile-setup__form">
          <div className="profile-setup__avatar-section">
            <div className="profile-setup__avatar-wrapper">
              <img src={preview || '/default-avatar.svg'} alt="" className="profile-setup__avatar" />
              <button type="button" className="profile-setup__avatar-btn" onClick={() => fileRef.current?.click()}>📷</button>
            </div>
            <input type="file" ref={fileRef} onChange={handleFile} accept="image/*" hidden />
          </div>
          <div className="profile-setup__group">
            <label className="profile-setup__label">Your Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="profile-setup__input" placeholder="How should we address you?" required />
          </div>
          <button type="submit" className="profile-setup__submit" disabled={loading}>
            {loading ? 'Saving...' : 'Continue to WishCraft'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfileSetupPage;
