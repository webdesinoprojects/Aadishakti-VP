import { CircleDollarSign, ClockAlert, FileCheck2, Receipt, ShoppingCart, TriangleAlert, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import VendorDataState from '../components/VendorDataState';
import { useVendorDashboard, useVendorProfile } from '../hooks/useVendorApi';
import {
  formatCompactVendorAmount,
  formatVendorAmount,
  formatVendorDate,
  UNAVAILABLE_VALUE,
  UNKNOWN_CURRENCY_NOTE,
} from '../utils/vendorFormatters';

const count = (value) => typeof value === 'number' ? value : UNAVAILABLE_VALUE;

function Kpi({ label, value, detail, note, icon: Icon, to, linkLabel = 'View records', tone = 'default' }) {
  return (
    <article className={`vendor-kpi-card vendor-kpi-card--${tone}`}>
      <div className="vendor-kpi-heading">
        <div className="vendor-kpi-label">{label}</div>
        <span className="vendor-kpi-icon"><Icon size={20} /></span>
      </div>
      <div className={`vendor-kpi-value${value === UNAVAILABLE_VALUE ? ' is-unavailable' : ''}`}>{value}</div>
      {detail && <div className="vendor-kpi-detail">Exact: {detail}</div>}
      <div className="vendor-kpi-note">{note}</div>
      <Link to={to} className="vendor-kpi-link">{linkLabel}</Link>
    </article>
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
          value={formatCompactVendorAmount(profile.data?.accountBalance, profile.data?.currency)}
          detail={profile.data?.accountBalance !== null && profile.data?.accountBalance !== undefined
            ? formatVendorAmount(profile.data.accountBalance, profile.data.currency)
            : null}
          note="Vendor master balance supplied by CIS"
          icon={CircleDollarSign}
          to="/vendor/profile"
          linkLabel="View profile"
          tone="balance"
        />
        <Kpi
          label="Total Due"
          value={formatCompactVendorAmount(profile.data?.totalDue, profile.data?.currency)}
          detail={profile.data?.totalDue !== null && profile.data?.totalDue !== undefined
            ? formatVendorAmount(profile.data.totalDue, profile.data.currency)
            : null}
          note="Vendor total due supplied directly by CIS"
          icon={CircleDollarSign}
          to="/vendor/profile"
          linkLabel="View profile"
          tone="due"
        />
        <Kpi
          label="Overdue Amount"
          value={formatCompactVendorAmount(profile.data?.overdueAmount, profile.data?.currency)}
          detail={profile.data?.overdueAmount !== null && profile.data?.overdueAmount !== undefined
            ? formatVendorAmount(profile.data.overdueAmount, profile.data.currency)
            : null}
          note="Vendor overdue amount supplied directly by CIS"
          icon={TriangleAlert}
          to="/vendor/invoices"
          tone="overdue"
        />
        <Kpi
          label="Overdue Open AP Invoices"
          value={count(data.kpis.overdueOpenApInvoices)}
          note="Count based on CIS invoice due dates"
          icon={ClockAlert}
          to="/vendor/invoices"
          tone="warning"
        />
        <Kpi label="Current Open Purchase Orders" value={count(data.kpis.openPurchaseOrders)} note="Not full history" icon={ShoppingCart} to="/vendor/orders" />
        <Kpi label="Current Open AP Invoices" value={count(data.kpis.openApInvoices)} note="Not full history" icon={Receipt} to="/vendor/invoices" />
        <Kpi label="Current Open GRPOs" value={count(data.kpis.openGrpos)} note="Header summaries only" icon={FileCheck2} to="/vendor/grn" />
        <Kpi label="Outgoing Payments" value={count(data.kpis.outgoingPayments)} note="Not-cancelled records" icon={Wallet} to="/vendor/payments" />
      </section>

      <section className="vendor-dashboard-content" style={{ gridTemplateColumns: '1fr' }}>
        <div className="vendor-panel" style={{ overflowX: 'auto' }}>
          <h3>Recent Current Open Purchase Orders</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '14px' }}>{UNKNOWN_CURRENCY_NOTE}</p>
          <table className="vendor-table">
            <thead><tr><th>PO Number</th><th>Date</th><th>Due Date</th><th>Amount</th></tr></thead>
            <tbody>
              {data.recentPurchaseOrders.map((order) => (
                <tr key={`${order.companyCode || 'single'}-${order.id}`}>
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
