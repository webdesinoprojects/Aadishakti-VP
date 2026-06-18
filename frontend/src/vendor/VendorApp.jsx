import { Routes, Route, Navigate } from 'react-router-dom';
import VendorSidebar from './components/VendorSidebar';
import VendorChatBubble from './components/VendorChatBubble';
import VendorDashboard from './pages/VendorDashboard';
import RFQsPage from './pages/RFQsPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';
import InvoicesPage from './pages/InvoicesPage';
import MyProfilePage from './pages/MyProfilePage';
import QuotationsPage from './pages/QuotationsPage';
import GRNPage from './pages/GRNPage';
import PaymentsPage from './pages/PaymentsPage';
import DocumentsPage from './pages/DocumentsPage';
import PerformancePage from './pages/PerformancePage';
import './vendor.css';

const ProtectedVendorRoute = ({ children }) => {
  const session = localStorage.getItem('vendor_session');
  let isAuth = false;
  if (session) {
    try {
      JSON.parse(session);
      isAuth = true;
    } catch { /* ignore */ }
  }
  
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function VendorApp() {
  return (
    <ProtectedVendorRoute>
      <div className="vendor-app">
        <div className="vendor-mobile-warning">
          <div style={{ textAlign: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--red-core)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '20px' }}>
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Desktop Optimized</h2>
            <p style={{ color: '#666', lineHeight: '1.5' }}>
              The Vendor Portal is optimized for desktop. Please use a laptop or desktop computer.
            </p>
          </div>
        </div>
        <div className="vendor-layout">
          <VendorSidebar />
          <main className="vendor-main">
            <Routes>
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/rfqs" element={<RFQsPage />} />
              <Route path="/vendor/orders" element={<PurchaseOrdersPage />} />
              <Route path="/vendor/invoices" element={<InvoicesPage />} />
              <Route path="/vendor/profile" element={<MyProfilePage />} />
              <Route path="/vendor/quotations" element={<QuotationsPage />} />
              <Route path="/vendor/grn" element={<GRNPage />} />
              <Route path="/vendor/payments" element={<PaymentsPage />} />
              <Route path="/vendor/documents" element={<DocumentsPage />} />
              <Route path="/vendor/performance" element={<PerformancePage />} />
              {/* Fallback for unhandled vendor routes to dashboard */}
              <Route path="*" element={<Navigate to="/vendor/dashboard" replace />} />
            </Routes>
          </main>
        </div>
        <VendorChatBubble />
      </div>
    </ProtectedVendorRoute>
  );
}
