import { CircleDollarSign, ClockAlert, FileCheck2, Receipt, ShoppingCart, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import VendorDataState from '../components/VendorDataState';
import { useVendorDashboard, useVendorProfile } from '../hooks/useVendorApi';
import { formatVendorAmount, formatVendorDate, UNAVAILABLE_VALUE, UNKNOWN_CURRENCY_NOTE } from '../utils/vendorFormatters';

const count = (value) => typeof value === 'number' ? value : UNAVAILABLE_VALUE;

function Kpi({ label, value, note, icon: Icon, to, linkLabel = 'View records' }) {
  return (
    <div className="vendor-kpi-card" style={{ position: 'relative', overflow: 'hidden' }}>
      <Icon size={100} strokeWidth={1} style={{ position: 'absolute', bottom: '-20px', right: '-14px', color: 'var(--red-core)', opacity: 0.06 }} />
      <div style={{ position: 'relative' }}>
        <div className="vendor-kpi-value">{value}</div>
        <div className="vendor-kpi-label">{label}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '8px' }}>{note}</div>
        <Link to={to} className="vendor-kpi-link">{linkLabel}</Link>
      </div>
    </div>
  );
}

export default function VendorDashboard() {
  const dashboard = useVendorDashboard();
  const profile = useVendorProfile();
  if (dashboard.loading || dashboard.error || !dashboard.data) {
    return <VendorDataState loading={dashboard.loading} error={dashboard.error} />;
  }

  const data = dashboard.data;
  const unavailable = Object.entries(data.availability).filter(([, available]) => !available).map(([name]) => name);

  return (
    <>
      <header className="vendor-header">
        <div className="vendor-greeting">
          <h1>Welcome back, {profile.data?.name || 'Vendor Partner'}!</h1>
          <p>Current records exposed for your account by CIS.</p>
        </div>
        <div className="vendor-header-right">
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: 700 }}>{profile.data?.name || 'Vendor Partner'}</div>
            <div style={{ fontSize: '11px', color: '#666' }}>{profile.loading ? 'Loading profile…' : profile.data?.accountReference || ''}</div>
          </div>
        </div>
      </header>

      {unavailable.length > 0 && (
        <p style={{ padding: '0 40px 20px', color: 'var(--text-muted)' }}>
          Some CIS sections are temporarily unavailable: {unavailable.join(', ')}. Other sections remain live.
        </p>
      )}

      <section className="vendor-kpi-grid">
        <Kpi
          label="Current Account Balance"
          value={formatVendorAmount(profile.data?.accountBalance, profile.data?.currency)}
          note="Vendor master balance supplied by CIS"
          icon={CircleDollarSign}
          to="/vendor/profile"
          linkLabel="View profile"
        />
        <Kpi
          label="Overdue Open AP Invoices"
          value={count(data.kpis.overdueOpenApInvoices)}
          note="Count based on CIS invoice due dates"
          icon={ClockAlert}
          to="/vendor/invoices"
        />
        <Kpi label="Current Open Purchase Orders" value={count(data.kpis.openPurchaseOrders)} note="Not full history" icon={ShoppingCart} to="/vendor/orders" />
        <Kpi label="Current Open AP Invoices" value={count(data.kpis.openApInvoices)} note="Not full history" icon={Receipt} to="/vendor/invoices" />
        <Kpi label="Current Open GRPOs" value={count(data.kpis.openGrpos)} note="Header summaries only" icon={FileCheck2} to="/vendor/grn" />
        <Kpi label="Outgoing Payments" value={count(data.kpis.outgoingPayments)} note="Not-cancelled records" icon={Wallet} to="/vendor/payments" />
      </section>

      <p className="vendor-dashboard-finance-note">
        CIS does not supply paid-to-date or remaining invoice amounts, so no outstanding invoice amount is estimated.
      </p>

      <section className="vendor-dashboard-content" style={{ gridTemplateColumns: '1fr' }}>
        <div className="vendor-panel" style={{ overflowX: 'auto' }}>
          <h3>Recent Current Open Purchase Orders</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '14px' }}>{UNKNOWN_CURRENCY_NOTE}</p>
          <table className="vendor-table">
            <thead><tr><th>PO Number</th><th>Date</th><th>Due Date</th><th>Amount</th></tr></thead>
            <tbody>
              {data.recentPurchaseOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600 }}>{order.number}</td>
                  <td>{formatVendorDate(order.date)}</td>
                  <td>{formatVendorDate(order.dueDate)}</td>
                  <td className="vendor-amount-value">{formatVendorAmount(order.amount)}</td>
                </tr>
              ))}
              {data.recentPurchaseOrders.length === 0 && (
                <tr><td colSpan="4" style={{ textAlign: 'center' }}>
                  {data.availability.purchaseOrders ? 'No current open Purchase Orders were returned.' : 'Purchase Order data is unavailable.'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
