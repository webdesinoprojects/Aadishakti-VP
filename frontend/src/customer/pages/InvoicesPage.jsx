import { useState } from 'react';
import CustomerDataState from '../components/CustomerDataState';
import CustomerPageHeader from '../components/CustomerPageHeader';
import CustomerPagination from '../components/CustomerPagination';
import CustomerTransactionDrawer from '../components/CustomerTransactionDrawer';
import { useCustomerInvoices } from '../hooks/useCustomerApi';
import { formatAmount, formatSapDate, UNKNOWN_TRANSACTION_CURRENCY_NOTE } from '../utils/customerFormatters';

export default function InvoicesPage() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const { data, loading, error } = useCustomerInvoices({ page, pageSize: 10 });

  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader
        title="Current Open AR Invoices"
        subtitle="Read-only open invoices exposed by CIS. Full history, paid amounts, line items, and PDF files are not supplied."
      />
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '20px' }}>
        {UNKNOWN_TRANSACTION_CURRENCY_NOTE}
      </p>

      <CustomerDataState loading={loading} error={error} />
      {data && (
        <div className="customer-card" style={{ padding: 0 }}>
          <table className="customer-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Total</th>
                <th>Scope</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((invoice) => (
                <tr key={invoice.id}>
                  <td style={{ fontWeight: 600 }}>{invoice.number}</td>
                  <td>{formatSapDate(invoice.date)}</td>
                  <td>{formatSapDate(invoice.dueDate)}</td>
                  <td>{formatAmount(invoice.amount)}</td>
                  <td>Current open</td>
                  <td>
                    <button className="customer-btn-outline" onClick={() => setSelected(invoice.id)}>
                      View Summary
                    </button>
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No current open invoices were returned.</td></tr>
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
      )}

      <CustomerTransactionDrawer type="invoice" docEntry={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
