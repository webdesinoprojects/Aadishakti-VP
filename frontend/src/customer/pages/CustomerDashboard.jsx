import { Link } from 'react-router-dom';
import { Package, Truck, Receipt, FileText, ArrowRight, Download } from 'lucide-react';
import CustomerPageHeader from '../components/CustomerPageHeader';
import { useCustomerData } from '../hooks/useCustomerData';
import { getStatusClass } from '../utils/statusHelpers';
import { PurchaseVolumeChart, OrderStatusPieChart } from '../components/CustomerCharts';

const StatCard = ({ title, value, subtitle, icon: Icon }) => (
  <div className="customer-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
      <h3 style={{ fontSize: '32px', fontWeight: '700' }}>{value}</h3>
      {Icon && <Icon size={24} color="var(--text-muted)" />}
    </div>
    <p style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>{title}</p>
    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{subtitle}</p>
  </div>
);

export default function CustomerDashboard() {
  const { data, loading } = useCustomerData();

  if (loading || !data) return <div style={{ padding: '40px' }}>Loading dashboard...</div>;

  const { orders, tracking, documents, kpis } = data;
  const recentOrders = orders.slice(0, 5);



  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader 
        title="Welcome back, Valued Customer!" 
        subtitle="Here's what's happening with your account today."
      />

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard title="Total Orders" value={kpis.totalOrders} subtitle="View all" icon={Package} />
        <StatCard title="In-Transit Shipments" value={kpis.inTransitShipments} subtitle="Track now" icon={Truck} />
        <StatCard title="Pending Invoices" value={kpis.pendingInvoices} subtitle="View invoices" icon={Receipt} />
        <StatCard title="Documents" value={kpis.documentsCount} subtitle="View documents" icon={FileText} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '30px' }}>
        <PurchaseVolumeChart orders={orders} />
        <OrderStatusPieChart orders={orders} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
        
        {/* Recent Orders */}
        <div className="customer-card" style={{ padding: '0' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Recent Orders</h3>
          </div>
          <table className="customer-table">
            <thead>
              <tr>
                <th>Order No.</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: '600' }}><Link to={`/customer/orders/${encodeURIComponent(order.id)}`} style={{color: 'inherit', textDecoration: 'none'}}>{order.id}</Link></td>
                  <td>{order.date}</td>
                  <td><span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span></td>
                  <td style={{ fontWeight: '500' }}>₹ {order.amount.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)' }}>
            <Link to="/customer/orders" style={{ color: 'var(--red-core)', fontWeight: '600', textDecoration: 'none', fontSize: '14px', display: 'inline-flex', alignItems: 'center' }}>
              View All Orders <ArrowRight size={16} style={{ marginLeft: '4px' }}/>
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Tracking */}
          <div className="customer-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Shipment Tracking</h3>
              <Link to="/customer/shipments" style={{ color: 'var(--red-core)', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>View All</Link>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {tracking.map(t => (
                <div key={t.id} style={{ paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontWeight: '600', fontSize: '13px' }}>{t.id}</span>
                    <span className={`status-badge ${getStatusClass(t.status)}`} style={{ fontSize: '11px', padding: '2px 8px' }}>{t.status}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span>{t.origin}</span>
                    <ArrowRight size={14} color="#cbd5e1" />
                    <span>{t.destination}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    {t.status === 'Delivered' ? `Delivered on: ${t.deliveredOn}` : `ETA: ${t.eta}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="customer-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Documents</h3>
              <Link to="/customer/documents" style={{ color: 'var(--red-core)', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>View All</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {documents.map((doc, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <FileText size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</span>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
