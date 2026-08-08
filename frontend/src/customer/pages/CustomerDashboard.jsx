import { ArrowRight, Banknote, CalendarClock, Package, Receipt, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OrderStatusPieChart, PurchaseVolumeChart } from '../components/CustomerCharts';
import CustomerDataState from '../components/CustomerDataState';
import CustomerPageHeader from '../components/CustomerPageHeader';
import { useCustomerDashboard } from '../hooks/useCustomerApi';
import {
  formatAmount,
  formatSapDate,
  UNAVAILABLE_VALUE,
  UNKNOWN_TRANSACTION_CURRENCY_NOTE,
} from '../utils/customerFormatters';
import { getStatusClass } from '../utils/statusHelpers';

function formatCount(value) {
  return typeof value === 'number' ? value : UNAVAILABLE_VALUE;
}

function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="customer-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: value === UNAVAILABLE_VALUE ? '18px' : '28px', fontWeight: 700 }}>
          {value}
        </h3>
        <Icon size={24} color="var(--text-muted)" />
      </div>
      <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
        {title}
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{subtitle}</p>
    </div>
  );
}

export default function CustomerDashboard() {
  const { data, loading, error } = useCustomerDashboard();
  if (loading || error || !data) {
    return <CustomerDataState loading={loading} error={error} />;
  }

  const {
    availability,
    charts,
    completeness,
    kpis,
    recentOrders,
  } = data;

  const unavailableSections = [
    !availability.orders && 'orders',
    !availability.invoices && 'invoices',
    !availability.deliveries && 'deliveries',
  ].filter(Boolean);

  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader
        title="Customer Dashboard"
        subtitle="Live commercial data currently exposed by SAP."
      />

      {unavailableSections.length > 0 && (
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          Some SAP sections are temporarily unavailable: {unavailableSections.join(', ')}. Available sections remain live.
        </p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '20px',
        }}
      >
        <StatCard
          title="Orders Returned by SAP"
          value={formatCount(kpis.totalOrders)}
          subtitle={availability.orders ? `${formatCount(kpis.openOrders)} open` : 'Order data unavailable'}
          icon={Package}
        />
        <StatCard
          title="Open Invoices"
          value={formatCount(kpis.openInvoices)}
          subtitle={availability.invoices ? 'From the current unpaid-invoice query' : 'Invoice data unavailable'}
          icon={Receipt}
        />
        <StatCard
          title="Outstanding Invoice Amount"
          value={formatAmount(kpis.outstandingInvoiceAmount)}
          subtitle={completeness.outstandingInvoiceAmount
            ? 'Complete for invoices returned by the unpaid query'
            : 'Unavailable because invoice payment data is incomplete'}
          icon={Banknote}
        />
        <StatCard
          title="Overdue Invoice Amount"
          value={formatAmount(kpis.overdueInvoiceAmount)}
          subtitle={completeness.overdueInvoiceAmount
            ? 'Due dates are compared as calendar dates'
            : 'Unavailable because due-date or payment data is incomplete'}
          icon={CalendarClock}
        />
        <StatCard
          title="Current Delivery Documents"
          value={formatCount(kpis.currentDeliveryDocuments)}
          subtitle={availability.deliveries ? 'Not a logistics or in-transit count' : 'Delivery data unavailable'}
          icon={Truck}
        />
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '30px' }}>
        {UNKNOWN_TRANSACTION_CURRENCY_NOTE}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '30px' }}>
        <PurchaseVolumeChart data={charts.monthlyOrderValue} available={availability.orders} />
        <OrderStatusPieChart data={charts.orderStatus} available={availability.orders} />
      </div>

      <div className="customer-card" style={{ padding: 0 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Recent Orders</h3>
        </div>
        <table className="customer-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Date</th>
              <th>SAP Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 600 }}>
                  <Link
                    to={`/customer/orders/${order.id}`}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {order.number}
                  </Link>
                </td>
                <td>{formatSapDate(order.date)}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span>
                </td>
                <td>{formatAmount(order.amount)}</td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  {availability.orders ? 'No orders were returned.' : 'Order data is temporarily unavailable.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)' }}>
          <Link
            to="/customer/orders"
            style={{
              color: 'var(--red-core)',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            View All Orders <ArrowRight size={16} style={{ marginLeft: '4px' }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
