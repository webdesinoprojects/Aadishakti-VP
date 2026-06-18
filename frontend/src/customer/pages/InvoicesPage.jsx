import { useState } from 'react';
import { InvoiceDrawer } from '../components/CustomerDrawers';
import CustomerPageHeader from '../components/CustomerPageHeader';
import CustomerPagination from '../components/CustomerPagination';
import { useCustomerData } from '../hooks/useCustomerData';

const StatBox = ({ title, amount, color }) => (
  <div className="customer-card" style={{ flex: 1, borderLeft: `4px solid ${color}` }}>
    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>{title}</p>
    <h3 style={{ fontSize: '24px', fontWeight: '700' }}>₹ {amount.toLocaleString('en-IN')}</h3>
  </div>
);

export default function InvoicesPage() {
  const { data, loading } = useCustomerData();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedinvoice] = useState(null);
  const itemsPerPage = 10;

  if (loading || !data) return <div style={{ padding: '40px' }}>Loading...</div>;

  const totalOutstanding = data.invoices?.filter(i => i.status !== 'Paid').reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const overdueBalance = data.invoices?.filter(i => i.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const paidThisMonth = data.invoices?.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0) || 0;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = (data.invoices || []).slice(indexOfFirst, indexOfLast);



  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader title="Invoices" subtitle="View and download your billing invoices." />
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <StatBox title="Total Outstanding" amount={totalOutstanding} color="var(--status-intransit)" />
        <StatBox title="Overdue Balance" amount={overdueBalance} color="var(--red-core)" />
        <StatBox title="Paid This Month" amount={paidThisMonth} color="var(--status-delivered)" />
      </div>

      <div className="customer-card" style={{ padding: 0 }}>
        <table className="customer-table">
          <thead>
            <tr><th>Invoice ID</th><th>Order ID</th><th>Date</th><th>Amount</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {currentItems.map(inv => (
              <tr key={inv.id} onClick={() => setSelectedinvoice(inv)} style={{cursor: "pointer"}} className="hover-row">
                <td style={{ fontWeight: '600' }}>{inv.id}</td>
                <td>{inv.orderId}</td>
                <td>{inv.date}</td>
                <td style={{ fontWeight: '600' }}>₹ {inv.amount.toLocaleString('en-IN')}</td>
                <td>
                  <span className={`status-badge ${inv.status === 'Paid' ? 'delivered' : inv.status === 'Pending' ? 'intransit' : 'cancelled'}`}>
                    {inv.status}
                  </span>
                </td>
                <td>
                  {inv.status !== 'Paid' ? (
                    <button className="customer-btn-outline" style={{ background: 'var(--red-core)', color: 'white', border: 'none', padding: '6px 12px' }}>Pay Now</button>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Settled</span>
                  )}
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No invoices found.</td></tr>}
          </tbody>
        </table>
        {data.invoices?.length > 0 && <CustomerPagination currentPage={currentPage} totalPages={Math.ceil(data.invoices.length / itemsPerPage)} onPageChange={setCurrentPage} totalItems={data.invoices.length} itemsPerPage={itemsPerPage} />}
      </div>
      <InvoiceDrawer invoice={selectedInvoice} onClose={() => setSelectedinvoice(null)} />
    </div>
  );
}
