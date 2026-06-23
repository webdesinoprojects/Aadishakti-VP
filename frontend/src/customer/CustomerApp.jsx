import { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Smartphone } from 'lucide-react';
import './customer.css';

import CustomerSidebar from './components/CustomerSidebar';
import CustomerChatBubble from './components/CustomerChatBubble';

// Pages to be implemented
import CustomerDashboard from './pages/CustomerDashboard';
import OrdersPage from './pages/OrdersPage';
import ReconciliationPage from './pages/ReconciliationPage';
import OrderDetailPage, { OrderDetailIndex, OrderDetailShipments, OrderDetailDocuments, OrderDetailInvoices, OrderDetailPayments } from './pages/OrderDetailPage';

import ShipmentsPage from './pages/ShipmentsPage';
import InvoicesPage from './pages/InvoicesPage';
import DocumentsPage from './pages/DocumentsPage';
import MyProfilePage from './pages/MyProfilePage';
import PaymentsPage from './pages/PaymentsPage';
import SustainabilityReportsPage from './pages/SustainabilityReportsPage';
import SupportPage from './pages/SupportPage';

const ProtectedCustomerRoute = () => {
  const session = localStorage.getItem('customer_session');
  if (!session) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default function CustomerApp() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <>
      <div className="customer-mobile-overlay">
        <Smartphone size={48} style={{ marginBottom: '20px', color: 'var(--red-core)' }} />
        <h2 style={{ marginBottom: '10px' }}>Desktop Required</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          The Aadishakti Customer Portal contains complex data tables and documents that are best viewed on a desktop or laptop computer.
        </p>
      </div>

      <div className="customer-portal">
        <CustomerSidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
        
        <main className="customer-main-content">
          <Routes>
            <Route element={<ProtectedCustomerRoute />}>
              <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/customer/reconciliation" element={<ReconciliationPage />} />
              <Route path="/customer/orders" element={<OrdersPage />} />
              <Route path="/customer/orders/:id" element={<OrderDetailPage />}>
              <Route index element={<OrderDetailIndex />} />
              <Route path="shipments" element={<OrderDetailShipments />} />
              <Route path="documents" element={<OrderDetailDocuments />} />
              <Route path="invoices" element={<OrderDetailInvoices />} />
              <Route path="payments" element={<OrderDetailPayments />} />
            </Route>
              <Route path="/customer/shipments" element={<ShipmentsPage />} />
              <Route path="/customer/invoices" element={<InvoicesPage />} />
              <Route path="/customer/documents" element={<DocumentsPage />} />
              <Route path="/customer/payments" element={<PaymentsPage />} />
              <Route path="/customer/sustainability" element={<SustainabilityReportsPage />} />
              <Route path="/customer/support" element={<SupportPage />} />
              <Route path="/customer/profile" element={<MyProfilePage />} />
              <Route path="/customer/*" element={<Navigate to="/customer/dashboard" replace />} />
            </Route>
          </Routes>
        </main>
        <CustomerChatBubble />
      </div>
    </>
  );
}
