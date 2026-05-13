import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const menuItems = [
  { path: '/admin', icon: '📊', label: 'Dashboard' },
  { path: '/admin/templates', icon: '🎨', label: 'Templates' },
  { path: '/admin/users', icon: '👥', label: 'Users' },
  { path: '/admin/analytics', icon: '📈', label: 'Analytics' },
];

const AdminSidebar = () => (
  <aside className="admin-sidebar">
    <div className="admin-sidebar__brand">
      <span className="admin-sidebar__icon">💜</span>
      <span className="admin-sidebar__title">Admin</span>
    </div>
    <nav className="admin-sidebar__nav">
      {menuItems.map((item) => (
        <NavLink key={item.path} to={item.path} end={item.path === '/admin'} className={({ isActive }) => `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}>
          <span className="admin-sidebar__link-icon">{item.icon}</span>
          <span className="admin-sidebar__link-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
    <div className="admin-sidebar__footer">
      <NavLink to="/" className="admin-sidebar__back">← Back to App</NavLink>
    </div>
  </aside>
);

export default AdminSidebar;
