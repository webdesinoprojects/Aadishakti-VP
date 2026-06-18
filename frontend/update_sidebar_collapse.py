import os

src_dir = r"c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src"

# 1. Update VendorSidebar.jsx
sidebar_path = os.path.join(src_dir, "vendor", "components", "VendorSidebar.jsx")

sidebar_content = """import { NavLink, useNavigate } from 'react-router-dom';
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
"""

with open(sidebar_path, "w", encoding="utf-8") as f:
    f.write(sidebar_content)


# 2. Update CSS
css_path = os.path.join(src_dir, "vendor", "vendor.css")
with open(css_path, "r", encoding="utf-8") as f:
    css_content = f.read()

# Make sure to append the collapsed CSS
if ".vendor-sidebar.collapsed" not in css_content:
    collapsed_css = """
/* Collapsible Sidebar Styles */
.vendor-sidebar.collapsed {
  width: 80px;
}
.vendor-sidebar.collapsed .vendor-nav-item {
  justify-content: center;
  padding: 12px 0;
}
.vendor-sidebar.collapsed .vendor-nav-icon {
  margin: 0;
}
.vendor-sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 48px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #333;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 101;
}
.vendor-sidebar-toggle:hover {
  background: #f9f9f9;
}
"""
    css_content = css_content.replace(".vendor-nav-item {", ".vendor-nav-item {\n  overflow: hidden;\n  white-space: nowrap;")
    css_content += collapsed_css
    with open(css_path, "w", encoding="utf-8") as f:
        f.write(css_content)

print("Updated VendorSidebar and CSS for collapsible feature")
