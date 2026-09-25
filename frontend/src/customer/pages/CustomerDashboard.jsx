import { CircleDollarSign, CreditCard, PackageX, Receipt, TriangleAlert, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomerDataState from '../components/CustomerDataState';
import CustomerPageHeader from '../components/CustomerPageHeader';
import { useCustomerDashboard } from '../hooks/useCustomerApi';
import { formatAmount, formatSapDate, UNAVAILABLE_VALUE, UNKNOWN_TRANSACTION_CURRENCY_NOTE } from '../utils/customerFormatters';

const formatCount = (value) => typeof value === 'number' ? value : UNAVAILABLE_VALUE;

function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="customer-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: value === UNAVAILABLE_VALUE ? '18px' : '28px', fontWeight: 700 }}>{value}</h3>
        <Icon size={24} color="var(--text-muted)" />
      </div>
      <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>{title}</p>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{subtitle}</p>
    </div>
  );
}

export default function CustomerDashboard() {
  const { data, loading, error } = useCustomerDashboard();
  if (loading || error || !data) return <CustomerDataState loading={loading} error={error} />;

  const unavailableSections = [
    !data.availability.invoices && 'invoices',
    !data.availability.deliveries && 'deliveries',
    !data.availability.payments && 'payments',
  ].filter(Boolean);

  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader title="Customer Dashboard" subtitle="Live records exposed for your account by CIS." />

      {unavailableSections.length > 0 && (
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          Some CIS sections are temporarily unavailable: {unavailableSections.join(', ')}. Other sections remain live.
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <StatCard
          title="Total Due"
          value={formatAmount(data.kpis.outstandingInvoiceAmount, data.currency)}
          subtitle={data.completeness.outstandingInvoiceAmount ? 'Supplied directly by CIS' : 'Total due unavailable from CIS'}
          icon={CircleDollarSign}
        />
        <StatCard
          title="Overdue Amount"
          value={formatAmount(data.kpis.overdueInvoiceAmount, data.currency)}
          subtitle={data.completeness.overdueInvoiceAmount ? 'Supplied directly by CIS' : 'Overdue amount unavailable from CIS'}
          icon={TriangleAlert}
        />
        <StatCard title="Sales Orders" value={UNAVAILABLE_VALUE} subtitle="No Sales Order API is supplied by CIS" icon={PackageX} />
        <StatCard
          title="Current Open AR Invoices"
          value={formatCount(data.kpis.openInvoices)}
          subtitle={data.availability.invoices ? 'Current open records, not full history' : 'Invoice data unavailable'}
          icon={Receipt}
        />
        <StatCard
          title="Current Open Deliveries"
          value={formatCount(data.kpis.currentDeliveryDocuments)}
          subtitle={data.availability.deliveries ? 'CIS delivery documents, not live tracking' : 'Delivery data unavailable'}
          icon={Truck}
        />
        <StatCard
          title="Incoming Payments"
          value={formatCount(data.kpis.incomingPayments)}
          subtitle={data.availability.payments ? 'Not-cancelled records exposed by CIS' : 'Payment data unavailable'}
          icon={CreditCard}
        />
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '30px' }}>
        {UNKNOWN_TRANSACTION_CURRENCY_NOTE}
      </p>

      <div className="customer-card" style={{ padding: 0 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Recent Current Open Invoices</h3>
        </div>
        <table className="customer-table">
          <thead><tr><th>Invoice Number</th><th>Date</th><th>Due Date</th><th>Amount</th></tr></thead>
          <tbody>
            {data.recentInvoices.map((invoice) => (
              <tr key={`${invoice.companyCode || 'single'}-${invoice.id}`}>
                <td style={{ fontWeight: 600 }}>{invoice.number}</td>
                <td>{formatSapDate(invoice.date)}</td>
                <td>{formatSapDate(invoice.dueDate)}</td>
                <td className="customer-amount-value">{formatAmount(invoice.amount)}</td>
              </tr>
            ))}
            {data.recentInvoices.length === 0 && (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>
                {data.availability.invoices ? 'No current open invoices were returned.' : 'Invoice data is temporarily unavailable.'}
              </td></tr>
            )}
          </tbody>
        </table>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)' }}>
          <Link to="/customer/invoices" style={{ color: 'var(--red-core)', fontWeight: 600, textDecoration: 'none' }}>
            View current open invoices →
          </Link>
        </div>
      </div>
    </div>
  );
}
