import { NavLink } from 'react-router-dom';
import { 
  Home, Package, Image, Newspaper, Users, Briefcase, 
  TrendingUp, Mail, FileText, Settings, LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navGroups = [
    {
      label: 'Content Management',
      items: [
        { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
        { to: '/admin/cms/hero', icon: Home, label: 'Home / Hero' },
        { to: '/admin/cms/products', icon: Package, label: 'Products' },
        { to: '/admin/cms/gallery', icon: Image, label: 'Gallery' },
        { to: '/admin/cms/news', icon: Newspaper, label: 'News & Announcements' },
        { to: '/admin/cms/team', icon: Users, label: 'Our Team' },
      ],
    },
    {
      label: 'Operations',
      items: [
        { to: '/admin/cms/careers', icon: Briefcase, label: 'Careers & Jobs' },
        { to: '/admin/cms/investors', icon: TrendingUp, label: 'Investors Data' },
      ],
    },
    {
      label: 'CRM',
      items: [
        { to: '/admin/crm/enquiries', icon: Mail, label: 'Enquiries' },
        { to: '/admin/crm/applications', icon: FileText, label: 'Job Applications' },
      ],
    },
    {
      label: 'Settings',
      items: [
        { to: '/admin/settings', icon: Settings, label: 'Admin Settings' },
      ],
    },
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <img src="/logo.png" alt="Aadishakti" className="sidebar-logo" />
        <div className="sidebar-title">CMS Admin</div>
      </div>

      <nav className="sidebar-nav">
        {navGroups.map((group, idx) => (
          <div key={idx} className="nav-group">
            <div className="nav-group-label">{group.label}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">AA</div>
          <div className="user-name">{user?.username || 'Admin'}</div>
        </div>
        <button className="logout-btn" onClick={logout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
