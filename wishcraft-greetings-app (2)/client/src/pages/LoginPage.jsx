import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import LoginForm from '../components/auth/LoginForm';
import GuestLogin from '../components/auth/GuestLogin';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import './LoginPage.css';

const LoginPage = () => {
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axiosInstance.post('/auth/google', {
        credential: credentialResponse.credential,
        name: 'Google User', email: 'google@user.com',
        googleId: 'google_id', profilePicture: ''
      });
      login(data);
      toast.success('Signed in with Google!');
      window.location.href = data.isAdmin ? '/admin' : '/profile-setup';
    } catch (err) {
      toast.error('Google sign-in failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__decor login-page__decor--1" />
      <div className="login-page__decor login-page__decor--2" />
      <motion.div className="login-page__card" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="login-page__brand">
          <span className="login-page__flame">💜</span>
          <h1 className="login-page__title">WishCraft</h1>
          <p className="login-page__tagline">Craft wishes that leave a mark</p>
        </div>
        <LoginForm />
        <div className="login-page__divider"><span>or</span></div>
        <div className="login-page__google">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error('Google login failed')} theme="filled_white" shape="pill" size="large" width="100%" />
        </div>
        <GuestLogin />
      </motion.div>
    </div>
  );
};

export default LoginPage;
