import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HeroEditor from './pages/cms/HeroEditor';
import ProductsManager from './pages/cms/ProductsManager';
import GalleryManager from './pages/cms/GalleryManager';
import NewsManager from './pages/cms/NewsManager';
import CareersManager from './pages/cms/CareersManager';
import TeamManager from './pages/cms/TeamManager';
import InvestorsManager from './pages/cms/InvestorsManager';
import EnquiriesManager from './pages/crm/EnquiriesManager';
import ApplicationsManager from './pages/crm/ApplicationsManager';
import SettingsPage from './pages/SettingsPage';
import './admin.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--admin-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Loading...</div>
          <div style={{ fontSize: '14px', color: 'var(--admin-text-muted)' }}>Please wait</div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
};

const AdminLayout = ({ children }) => (
  <div className="admin-layout">
    <Sidebar />
    <div className="admin-main">{children}</div>
  </div>
);

const MobileWarning = () => (
  <div className="mobile-warning">
    <div className="mobile-warning-content">
      <h1>Desktop Required</h1>
      <p>For the best admin experience, please use a desktop or laptop computer.</p>
      <p style={{ marginTop: '16px', fontSize: '13px' }}>
        The admin panel is optimized for larger screens and is not available on mobile devices.
      </p>
    </div>
  </div>
);

function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MobileWarning />
        <div className="desktop-only" style={{ minHeight: '100vh' }}>
          <Routes>
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="cms/hero" element={<HeroEditor />} />
                      <Route path="cms/products" element={<ProductsManager />} />
                      <Route path="cms/gallery" element={<GalleryManager />} />
                      <Route path="cms/news" element={<NewsManager />} />
                      <Route path="cms/careers" element={<CareersManager />} />
                      <Route path="cms/team" element={<TeamManager />} />
                      <Route path="cms/investors" element={<InvestorsManager />} />
                      <Route path="crm/enquiries" element={<EnquiriesManager />} />
                      <Route path="crm/applications" element={<ApplicationsManager />} />
                      <Route path="settings" element={<SettingsPage />} />
                      <Route path="" element={<Navigate to="dashboard" replace />} />
                      <Route path="*" element={<div style={{ padding: '32px' }}>Page not found</div>} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default AdminApp;
