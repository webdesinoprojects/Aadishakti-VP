import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HeroEditor from './pages/cms/HeroEditor';
import EnquiriesManager from './pages/crm/EnquiriesManager';
import './admin.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'var(--admin-bg)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
            Loading...
          </div>
          <div style={{ fontSize: '14px', color: 'var(--admin-text-muted)' }}>
            Please wait
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        {children}
      </div>
    </div>
  );
};

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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <MobileWarning />
          <div className="desktop-only" style={{ minHeight: '100vh' }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/cms/hero" element={<HeroEditor />} />
                        <Route path="/crm/enquiries" element={<EnquiriesManager />} />
                        {/* Add more routes here as we create them */}
                        <Route path="*" element={<div style={{ padding: '32px' }}>Page not found</div>} />
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
