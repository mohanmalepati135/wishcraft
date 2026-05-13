import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../hooks/useAuth';
import './GuestLogin.css';

const GuestLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGuest = async () => {
    try {
      const { data } = await axiosInstance.post('/auth/guest');
      login(data);
      toast.success('Welcome, Guest!');
      navigate('/profile-setup');
    } catch (err) {
      toast.error('Failed to create guest session');
    }
  };

  return (
    <motion.button className="guest-login" onClick={handleGuest} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
     <span className="guest-login__icon w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 text-xl">
  👤
</span>

      <span className="guest-login__text">Explore as Guest</span>
      <span className="guest-login__hint">No signup required</span>
    </motion.button>
  );
};

export default GuestLogin;
