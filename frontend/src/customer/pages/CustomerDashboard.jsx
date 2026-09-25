import { CircleDollarSign, CreditCard, PackageX, Receipt, TriangleAlert, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomerDataState from '../components/CustomerDataState';
import CustomerPageHeader from '../components/CustomerPageHeader';
import { useCustomerDashboard } from '../hooks/useCustomerApi';
import {
  formatAmount,
  formatCompactCurrency,
  formatSapDate,
  UNAVAILABLE_VALUE,
  UNKNOWN_TRANSACTION_CURRENCY_NOTE,
} from '../utils/customerFormatters';

const formatCount = (value) => typeof value === 'number' ? value : UNAVAILABLE_VALUE;

function StatCard({ title, value, exactValue, subtitle, icon: Icon, tone = 'default', featured = false }) {
  return (
    <article className={`customer-dashboard-stat customer-dashboard-stat--${tone}${featured ? ' is-featured' : ''}`}>
      <div className="customer-dashboard-stat-heading">
        <p>{title}</p>
        <span className="customer-dashboard-stat-icon"><Icon size={20} /></span>
      </div>
      <strong className={`customer-dashboard-stat-value${value === UNAVAILABLE_VALUE ? ' is-unavailable' : ''}`}>
        {value}
      </strong>
      {exactValue && <p className="customer-dashboard-stat-exact">Exact: {exactValue}</p>}
      <p className="customer-dashboard-stat-note">{subtitle}</p>
    </article>
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
    <div className="customer-dashboard-page">
      <CustomerPageHeader title="Customer Dashboard" subtitle="Live records exposed for your account by CIS." />

      {unavailableSections.length > 0 && (
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          Some CIS sections are temporarily unavailable: {unavailableSections.join(', ')}. Other sections remain live.
        </p>
      )}

      <section className="customer-dashboard-grid" aria-label="Account summary">
        <StatCard
          title="Total Due"
          value={formatCompactCurrency(data.kpis.outstandingInvoiceAmount, data.currency)}
          exactValue={data.completeness.outstandingInvoiceAmount
            ? formatAmount(data.kpis.outstandingInvoiceAmount, data.currency)
            : null}
          subtitle={data.completeness.outstandingInvoiceAmount ? 'Supplied directly by CIS' : 'Total due unavailable from CIS'}
          icon={CircleDollarSign}
          tone="financial"
          featured
        />
        <StatCard
          title="Overdue Amount"
          value={formatCompactCurrency(data.kpis.overdueInvoiceAmount, data.currency)}
          exactValue={data.completeness.overdueInvoiceAmount
            ? formatAmount(data.kpis.overdueInvoiceAmount, data.currency)
            : null}
          subtitle={data.completeness.overdueInvoiceAmount ? 'Supplied directly by CIS' : 'Overdue amount unavailable from CIS'}
          icon={TriangleAlert}
          tone="overdue"
          featured
        />
        <StatCard
          title="Sales Orders"
          value={UNAVAILABLE_VALUE}
          subtitle="No Sales Order API is supplied by CIS"
          icon={PackageX}
          tone="muted"
        />
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
      </section>

      <p className="customer-dashboard-currency-note">{UNKNOWN_TRANSACTION_CURRENCY_NOTE}</p>

      <div className="customer-card customer-dashboard-recent">
        <div className="customer-dashboard-recent-heading">
          <div>
            <p>Invoices</p>
            <h3>Recent Current Open Invoices</h3>
          </div>
          <Link to="/customer/invoices">View all invoices →</Link>
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
      </div>
    </div>
  );
}
