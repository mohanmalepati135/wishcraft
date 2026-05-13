import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.isAdmin;
  const isAuthPage = location.pathname === '/login';
  if (isAuthPage) return null;

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">💜</span>
          <span className="navbar__logo-text">WishCraft</span>
        </Link>

        <div className="navbar__desktop">
          {isAdmin && (
            <Link to="/admin" className="navbar__link">Admin</Link>
          )}
          {user ? (
            <div className="navbar__user">
              <button className="navbar__user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img src={user.profilePicture || '/default-avatar.svg'} alt={user.name} className="navbar__avatar" />
                <span className="navbar__name">{user.name}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5"/></svg>
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div className="navbar__dropdown" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <Link to="/profile" className="navbar__dropdown-item">Profile</Link>
                    {isAdmin && <Link to="/admin" className="navbar__dropdown-item">Admin Panel</Link>}
                    <button onClick={handleLogout} className="navbar__dropdown-item navbar__dropdown-item--danger">Logout</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="navbar__cta">Sign In</Link>
          )}
        </div>

        <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="navbar__mobile" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            {user ? (
              <>
                <div className="navbar__mobile-user">
                  <img src={user.profilePicture || '/default-avatar.svg'} alt="" className="navbar__mobile-avatar" />
                  <span>{user.name}</span>
                </div>
                <Link to="/profile" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Profile</Link>
                {isAdmin && <Link to="/admin" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
                <button onClick={handleLogout} className="navbar__mobile-link navbar__mobile-link--danger">Logout</button>
              </>
            ) : (
              <Link to="/login" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
