import { useState } from 'react';
import CustomerDataState from '../components/CustomerDataState';
import CustomerPageHeader from '../components/CustomerPageHeader';
import CustomerPagination from '../components/CustomerPagination';
import CustomerTransactionDrawer from '../components/CustomerTransactionDrawer';
import { useCustomerInvoices } from '../hooks/useCustomerApi';
import {
  formatAmount,
  formatSapDate,
  UNKNOWN_TRANSACTION_CURRENCY_NOTE,
} from '../utils/customerFormatters';

function StatBox({ title, amount, complete }) {
  return (
    <div className="customer-card" style={{ flex: 1 }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
        {title}
      </p>
      <h3 style={{ fontSize: '24px', fontWeight: 700 }}>{formatAmount(amount)}</h3>
      {!complete && (
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '8px' }}>
          Incomplete payment or due-date data prevents a complete total.
        </p>
      )}
    </div>
  );
}

export default function InvoicesPage() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const { data, loading, error } = useCustomerInvoices({ page, pageSize: 10 });

  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader
        title="Invoices"
        subtitle="Read-only customer invoices from SAP. PDF files and online payment are not exposed."
      />
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '20px' }}>
        {UNKNOWN_TRANSACTION_CURRENCY_NOTE}
      </p>

      <CustomerDataState loading={loading} error={error} />
      {data && (
        <>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
            <StatBox
              title="Outstanding Amount"
              amount={data.summary.outstandingAmount}
              complete={data.summary.outstandingAmountComplete}
            />
            <StatBox
              title="Overdue Amount"
              amount={data.summary.overdueAmount}
              complete={data.summary.overdueAmountComplete}
            />
            <div className="customer-card" style={{ flex: 1 }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>
                Open Invoices
              </p>
              <h3 style={{ fontSize: '24px', marginTop: '8px' }}>{data.summary.openCount}</h3>
            </div>
          </div>

          <div className="customer-card" style={{ padding: 0 }}>
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>Date</th>
                  <th>Due Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Outstanding</th>
                  <th>SAP Status</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((invoice) => (
                  <tr key={invoice.id} onClick={() => setSelected(invoice.id)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontWeight: 600 }}>{invoice.number}</td>
                    <td>{formatSapDate(invoice.date)}</td>
                    <td>{formatSapDate(invoice.dueDate)}</td>
                    <td>{formatAmount(invoice.amount)}</td>
                    <td>{formatAmount(invoice.paidAmount)}</td>
                    <td>{formatAmount(invoice.outstandingAmount)}</td>
                    <td>{invoice.status}</td>
                  </tr>
                ))}
                {data.items.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center' }}>No invoices were returned.</td></tr>
                )}
              </tbody>
            </table>
            <CustomerPagination
              currentPage={data.pagination.page}
              totalItems={data.pagination.total}
              itemsPerPage={data.pagination.pageSize}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      <CustomerTransactionDrawer
        type="invoice"
        docEntry={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
