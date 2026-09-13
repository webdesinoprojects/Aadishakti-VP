import { useState } from 'react';
import CustomerDataState from '../components/CustomerDataState';
import CustomerPageHeader from '../components/CustomerPageHeader';
import CustomerPagination from '../components/CustomerPagination';
import CustomerTransactionDrawer from '../components/CustomerTransactionDrawer';
import { useCustomerFinancialDocuments } from '../hooks/useCustomerApi';
import { formatAmount, formatSapDate, UNKNOWN_TRANSACTION_CURRENCY_NOTE } from '../utils/customerFormatters';

export default function InvoicesPage() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [kind, setKind] = useState('invoice');
  const { data, loading, error } = useCustomerFinancialDocuments({ kind, page, pageSize: 10 });
  const creditNotes = kind === 'credit-note';

  const changeKind = (nextKind) => {
    setKind(nextKind);
    setPage(1);
    setSelected(null);
  };

  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader
        title={creditNotes ? 'Current Open AR Credit Notes' : 'Current Open AR Invoices'}
        subtitle="Read-only current/open headers exposed by CIS. Full history, line items, and PDF files are not supplied."
      />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
        <button className="customer-btn-outline" onClick={() => changeKind('invoice')} disabled={!creditNotes}>AR Invoices</button>
        <button className="customer-btn-outline" onClick={() => changeKind('credit-note')} disabled={creditNotes}>AR Credit Notes</button>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '20px' }}>
        {UNKNOWN_TRANSACTION_CURRENCY_NOTE}
      </p>

      <CustomerDataState loading={loading} error={error} />
      {data && (
        <div className="customer-card" style={{ padding: 0 }}>
          <table className="customer-table">
            <thead>
              <tr>
                <th>{creditNotes ? 'Credit Note Number' : 'Invoice Number'}</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Total</th>
                <th>Scope</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((document) => (
                <tr key={document.id}>
                  <td style={{ fontWeight: 600 }}>{document.number}</td>
                  <td>{formatSapDate(document.date)}</td>
                  <td>{formatSapDate(document.dueDate)}</td>
                  <td>{formatAmount(document.amount)}</td>
                  <td>Current open</td>
                  <td>
                    <button className="customer-btn-outline" onClick={() => setSelected(document.id)}>
                      View Summary
                    </button>
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No current open {creditNotes ? 'AR Credit Notes' : 'AR Invoices'} were returned.</td></tr>
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

      <CustomerTransactionDrawer type={creditNotes ? 'creditNote' : 'invoice'} docEntry={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
