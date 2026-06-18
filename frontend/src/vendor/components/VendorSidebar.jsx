import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ASSETS } from '../../assets/assetMap';
import { 
  LayoutDashboard, FileQuestion, FileSignature, ShoppingCart, 
  Package, Receipt, CreditCard, Activity, FolderOpen, User, LogOut, ChevronLeft, ChevronRight 
} from 'lucide-react';

export default function VendorSidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('vendor_session');
    navigate('/login');
  };

  const navItems = [
    { to: '/vendor/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/vendor/rfqs', icon: FileQuestion, label: 'RFQs / Enquiries' },
    { to: '/vendor/quotations', icon: FileSignature, label: 'My Quotations' },
    { to: '/vendor/orders', icon: ShoppingCart, label: 'Purchase Orders' },
    { to: '/vendor/grn', icon: Package, label: 'GRN & Receipts' },
    { to: '/vendor/invoices', icon: Receipt, label: 'Invoices' },
    { to: '/vendor/payments', icon: CreditCard, label: 'Payments' },
    { to: '/vendor/performance', icon: Activity, label: 'Performance' },
    { to: '/vendor/documents', icon: FolderOpen, label: 'Documents' },
    { to: '/vendor/profile', icon: User, label: 'My Profile' }
  ];

  return (
    <aside className={`vendor-sidebar ${collapsed ? 'collapsed' : ''}`} style={{ position: 'relative' }}>
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="vendor-sidebar-toggle"
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="vendor-sidebar-header" style={{ padding: collapsed ? '24px 0' : '24px', display: 'flex', justifyContent: 'center' }}>
        {!collapsed && <img src={ASSETS.logo} alt="Aadishakti" className="vendor-sidebar-logo" />}
        {collapsed && <div style={{ fontWeight: 800, fontSize: '24px', color: 'var(--red-core)', textAlign: 'center' }}>A</div>}
      </div>

      <nav className="vendor-nav">
        {navItems.map(item => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            end={item.exact}
            className={({ isActive }) => `vendor-nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={20} className="vendor-nav-icon" style={{ minWidth: '20px' }} />
            {!collapsed && <span className="vendor-nav-label" style={{ marginLeft: '12px' }}>{item.label}</span>}
          </NavLink>
        ))}

        <div style={{ marginTop: 'auto', padding: '0' }}>
          <button 
            onClick={handleLogout} 
            className="vendor-nav-item" 
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)', width: '100%', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut size={20} className="vendor-nav-icon" style={{ minWidth: '20px' }} />
            {!collapsed && <span className="vendor-nav-label" style={{ marginLeft: '12px' }}>Logout</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
}
