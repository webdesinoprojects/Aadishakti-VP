import { useState } from 'react';
import VendorDataState from '../components/VendorDataState';
import VendorPageHeader from '../components/VendorPageHeader';
import VendorPagination from '../components/VendorPagination';
import VendorTransactionDrawer from '../components/VendorTransactionDrawer';
import { useVendorFinancialDocuments } from '../hooks/useVendorApi';
import { formatVendorAmount, formatVendorDate, UNKNOWN_CURRENCY_NOTE } from '../utils/vendorFormatters';

export default function InvoicesPage() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [kind, setKind] = useState('invoice');
  const { data, loading, error } = useVendorFinancialDocuments({ kind, page, pageSize: 10 });
  const labels = {
    invoice: { title: 'Current Open AP Invoices', number: 'Invoice Number', empty: 'AP Invoices', drawer: 'invoice' },
    'credit-note': { title: 'Current Open AP Credit Notes', number: 'Credit Note Number', empty: 'AP Credit Notes', drawer: 'creditNote' },
    'debit-note': { title: 'Current Open AP Debit Notes', number: 'Debit Note Number', empty: 'AP Debit Notes', drawer: 'debitNote' },
  }[kind];

  const changeKind = (nextKind) => {
    setKind(nextKind);
    setPage(1);
    setSelected(null);
  };
  return (
    <div className="vendor-page">
      <VendorPageHeader title={labels.title} subtitle="Read-only current/open headers supplied by CIS. Full history, lines, associations, and files are unavailable." />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
        <button className="vendor-btn-outline" onClick={() => changeKind('invoice')} disabled={kind === 'invoice'}>AP Invoices</button>
        <button className="vendor-btn-outline" onClick={() => changeKind('credit-note')} disabled={kind === 'credit-note'}>AP Credit Notes</button>
        <button className="vendor-btn-outline" onClick={() => changeKind('debit-note')} disabled={kind === 'debit-note'}>AP Debit Notes</button>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '20px' }}>{UNKNOWN_CURRENCY_NOTE}</p>
      <VendorDataState loading={loading} error={error} />
      {data && (
        <div className="vendor-panel">
          <table className="vendor-table">
            <thead><tr><th>{labels.number}</th><th>Date</th><th>Due Date</th><th>Amount</th><th>Scope</th><th>Action</th></tr></thead>
            <tbody>
              {data.items.map((document) => (
                <tr key={document.id}>
                  <td style={{ fontWeight: 600 }}>{document.number}</td>
                  <td>{formatVendorDate(document.date)}</td>
                  <td>{formatVendorDate(document.dueDate)}</td>
                  <td>{formatVendorAmount(document.amount)}</td>
                  <td>Current open</td>
                  <td><button className="vendor-btn-outline" onClick={() => setSelected(document.id)}>View Summary</button></td>
                </tr>
              ))}
              {data.items.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No current open {labels.empty} were returned.</td></tr>}
            </tbody>
          </table>
          <VendorPagination totalItems={data.pagination.total} itemsPerPage={data.pagination.pageSize} currentPage={data.pagination.page} onPageChange={setPage} />
        </div>
      )}
      <VendorTransactionDrawer type={labels.drawer} docEntry={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
