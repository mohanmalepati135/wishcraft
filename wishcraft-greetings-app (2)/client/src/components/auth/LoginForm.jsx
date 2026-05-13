import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../hooks/useAuth';
import './LoginForm.css';

const LoginForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const { data } = await axiosInstance.post(endpoint, formData);
      login(data);
      toast.success(isRegister ? 'Account created!' : 'Welcome back!');
      navigate(data.isAdmin ? '/admin' : '/profile-setup');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form className="login-form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <h2 className="login-form__title">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
      <p className="login-form__subtitle">{isRegister ? 'Join the WishCraft family' : 'Sign in to continue crafting'}</p>

      {isRegister && (
        <div className="login-form__group">
          <label className="login-form__label">Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="login-form__input" placeholder="Enter your name" required />
        </div>
      )}

      <div className="login-form__group">
        <label className="login-form__label">Email Address</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="login-form__input" placeholder="you@example.com" required />
      </div>

      <div className="login-form__group">
        <label className="login-form__label">Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} className="login-form__input" placeholder="••••••••" required minLength={6} />
      </div>

      <button type="submit" className="login-form__submit" disabled={loading}>
        {loading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Sign In')}
      </button>

      <p className="login-form__toggle">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button type="button" className="login-form__toggle-btn" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Sign In' : 'Create one'}
        </button>
      </p>
    </motion.form>
  );
};

export default LoginForm;
