import { useState } from 'react';
import VendorDataState from '../components/VendorDataState';
import VendorPageHeader from '../components/VendorPageHeader';
import VendorPagination from '../components/VendorPagination';
import VendorTransactionDrawer from '../components/VendorTransactionDrawer';
import { useVendorGrpos } from '../hooks/useVendorApi';
import { formatVendorAmount, formatVendorDate, UNKNOWN_CURRENCY_NOTE } from '../utils/vendorFormatters';

export default function GRNPage() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const { data, loading, error } = useVendorGrpos({ page, pageSize: 10 });
  return (
    <div className="vendor-page">
      <VendorPageHeader title="Current Open GRPOs" subtitle="Read-only Goods Receipt PO headers supplied by CIS. Materials, quantities, lines, and downloadable GRNs are not exposed." />
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '20px' }}>{UNKNOWN_CURRENCY_NOTE}</p>
      <VendorDataState loading={loading} error={error} />
      {data && (
        <div className="vendor-panel">
          <table className="vendor-table">
            <thead><tr><th>GRPO Number</th><th>Date</th><th>Due Date</th><th>Amount</th><th>Scope</th><th>Action</th></tr></thead>
            <tbody>
              {data.items.map((grpo) => (
                <tr key={grpo.id}>
                  <td style={{ fontWeight: 600 }}>{grpo.number}</td>
                  <td>{formatVendorDate(grpo.date)}</td>
                  <td>{formatVendorDate(grpo.dueDate)}</td>
                  <td className="vendor-amount-value">{formatVendorAmount(grpo.amount)}</td>
                  <td>Current open</td>
                  <td><button className="vendor-btn-outline" onClick={() => setSelected(grpo.id)}>View Summary</button></td>
                </tr>
              ))}
              {data.items.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No current open GRPOs were returned.</td></tr>}
            </tbody>
          </table>
          <VendorPagination totalItems={data.pagination.total} itemsPerPage={data.pagination.pageSize} currentPage={data.pagination.page} onPageChange={setPage} />
        </div>
      )}
      <VendorTransactionDrawer type="grpo" docEntry={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
