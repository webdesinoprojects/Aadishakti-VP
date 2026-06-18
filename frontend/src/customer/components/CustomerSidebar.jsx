import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Truck, 
  FileText, 
  Receipt, 
  CreditCard, 
  ShieldCheck, 
  RotateCcw, 
  LifeBuoy, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function CustomerSidebar({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('customer_session');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/customer/dashboard' },
    { name: 'Orders', icon: ShoppingCart, path: '/customer/orders' },
    { name: 'Shipments', icon: Truck, path: '/customer/shipments' },
    { name: 'Documents', icon: FileText, path: '/customer/documents' },
    { name: 'Invoices', icon: Receipt, path: '/customer/invoices' },
    { name: 'Payments', icon: CreditCard, path: '/customer/payments' },
    { name: 'Quality Certificates', icon: ShieldCheck, path: '/customer/quality' },
    { name: 'Returns', icon: RotateCcw, path: '/customer/returns' },
    { name: 'Support', icon: LifeBuoy, path: '/customer/support' },
    { name: 'My Profile', icon: User, path: '/customer/profile' },
  ];

  return (
    <aside className={`customer-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--red-core)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            A
          </div>
          <div className="nav-label" style={{ fontWeight: '700', letterSpacing: '0.05em' }}>CUSTOMER</div>
        </div>

        {/* Collapse Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            position: 'absolute', right: '-12px', top: '28px',
            background: 'var(--sidebar-bg)', border: '1px solid rgba(255,255,255,0.1)', color: 'white',
            width: '24px', height: '24px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 10
          }}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => isActive ? "customer-nav-item active" : "customer-nav-item"}
              title={isCollapsed ? item.name : ""}
            >
              <Icon size={20} />
              <span className="nav-label">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={{ padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          onClick={handleLogout}
          className="customer-nav-item" 
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut size={20} />
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
