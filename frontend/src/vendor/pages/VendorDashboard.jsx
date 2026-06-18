import { Link } from 'react-router-dom';
import { FileText, ShoppingCart, Receipt, Wallet } from 'lucide-react';
import { useVendorData } from '../hooks/useVendorData';
import { getStatusClass } from '../utils/statusHelpers';
import { VendorRevenueChart, VendorPerformancePie } from '../components/VendorCharts';

export default function VendorDashboard() {
  const { data, loading, error } = useVendorData();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--red-core)' }}>
        <p>{error || 'Failed to load data.'}</p>
      </div>
    );
  }

  const { profile, kpis, purchaseOrders, upcomingDeliveries, performance, revenueHistory } = data;


  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 40px 0 40px' }}>
        <div className="vendor-badge-security">
          Connected & Secured with <strong>EISENVAULT</strong>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
      </div>

      <header className="vendor-header">
        <div className="vendor-greeting">
          <h1>Welcome back, Vendor Partner!</h1>
          <p>Here's an overview of your business with us.</p>
        </div>
        <div className="vendor-header-right">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#111' }}>{profile.name}</div>
            <div style={{ fontSize: '11px', color: '#666' }}>Vendor Code: {profile.vendorCode}</div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}>
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </header>

      <section className="vendor-kpi-grid">
        <div className="vendor-kpi-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <FileText size={120} strokeWidth={1} style={{ position: 'absolute', bottom: '-20px', right: '-20px', color: 'var(--red-core)', opacity: 0.06, zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="vendor-kpi-value">{kpis.activeRFQs}</div>
            <div className="vendor-kpi-label">Active RFQs</div>
            <Link to="/vendor/rfqs" className="vendor-kpi-link">View all</Link>
          </div>
        </div>
        <div className="vendor-kpi-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <ShoppingCart size={120} strokeWidth={1} style={{ position: 'absolute', bottom: '-20px', right: '-20px', color: '#1976d2', opacity: 0.06, zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="vendor-kpi-value">{kpis.purchaseOrders}</div>
            <div className="vendor-kpi-label">Purchase Orders</div>
            <Link to="/vendor/orders" className="vendor-kpi-link">View all</Link>
          </div>
        </div>
        <div className="vendor-kpi-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <Receipt size={120} strokeWidth={1} style={{ position: 'absolute', bottom: '-20px', right: '-20px', color: '#f57c00', opacity: 0.06, zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="vendor-kpi-value">{kpis.pendingInvoices}</div>
            <div className="vendor-kpi-label">Pending Invoices</div>
            <Link to="/vendor/invoices" className="vendor-kpi-link">View all</Link>
          </div>
        </div>
        <div className="vendor-kpi-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <Wallet size={120} strokeWidth={1} style={{ position: 'absolute', bottom: '-20px', right: '-20px', color: '#2e7d32', opacity: 0.06, zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="vendor-kpi-value">₹ {kpis.totalReceivables}</div>
            <div className="vendor-kpi-label">Total Receivables</div>
            <Link to="/vendor/invoices" className="vendor-kpi-link">View statement</Link>
          </div>
        </div>
      </section>

      <section className="vendor-dashboard-content" style={{ marginBottom: '20px' }}>
        <div className="vendor-panel">
          <VendorRevenueChart data={revenueHistory} />
        </div>
        <div className="vendor-panel">
          <VendorPerformancePie performance={performance} />
        </div>
      </section>

      <section className="vendor-dashboard-content">
        <div className="vendor-panel" style={{ overflowX: 'auto' }}>
          <h3>Purchase Orders</h3>
          <table className="vendor-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Date</th>
                <th>Delivery Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((po) => (
                <tr key={po.poNumber}>
                  <td>{po.poNumber}</td>
                  <td>{po.date}</td>
                  <td>{po.deliveryDate}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(po.status)}`}>
                      {po.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600' }}>₹ {po.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/vendor/orders" className="vendor-kpi-link" style={{ display: 'inline-block', marginTop: '20px' }}>
            View All Purchase Orders →
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="vendor-panel">
            <h3>
              <span>Upcoming Deliveries</span>
              <Link to="/vendor/orders" className="vendor-kpi-link" style={{ marginTop: 0 }}>View Calendar →</Link>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {upcomingDeliveries.map((delivery) => (
                <div key={delivery.poNumber} className="upcoming-delivery-item">
                  <span style={{ fontWeight: '600', color: '#111' }}>{delivery.poNumber}</span>
                  <span style={{ color: '#666' }}>{delivery.date}</span>
                  <span style={{ color: '#666' }}>{delivery.material}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 40px 40px 40px' }}>
        <div style={{ fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Secure collaboration. Trusted partnership.
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
      </div>
    </>
  );
}
