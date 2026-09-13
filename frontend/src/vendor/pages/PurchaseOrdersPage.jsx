import { useState } from 'react';
import VendorDataState from '../components/VendorDataState';
import VendorPageHeader from '../components/VendorPageHeader';
import VendorPagination from '../components/VendorPagination';
import VendorTransactionDrawer from '../components/VendorTransactionDrawer';
import { useVendorPurchaseOrders } from '../hooks/useVendorApi';
import { formatVendorAmount, formatVendorDate, UNKNOWN_CURRENCY_NOTE } from '../utils/vendorFormatters';

export default function PurchaseOrdersPage() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const { data, loading, error } = useVendorPurchaseOrders({ page, pageSize: 10 });

  return (
    <div className="vendor-page">
      <VendorPageHeader title="Current Open Purchase Orders" subtitle="Read-only Purchase Order headers supplied by CIS. Full history, tracking, and line items are not exposed." />
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '20px' }}>{UNKNOWN_CURRENCY_NOTE}</p>
      <VendorDataState loading={loading} error={error} />
      {data && (
        <div className="vendor-panel">
          <table className="vendor-table">
            <thead><tr><th>PO Number</th><th>Document Date</th><th>Due Date</th><th>Amount</th><th>Scope</th><th>Action</th></tr></thead>
            <tbody>
              {data.items.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600 }}>{order.number}</td>
                  <td>{formatVendorDate(order.date)}</td>
                  <td>{formatVendorDate(order.dueDate)}</td>
                  <td>{formatVendorAmount(order.amount)}</td>
                  <td>Current open</td>
                  <td><button className="vendor-btn-outline" onClick={() => setSelected(order.id)}>View Summary</button></td>
                </tr>
              ))}
              {data.items.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No current open Purchase Orders were returned.</td></tr>}
            </tbody>
          </table>
          <VendorPagination totalItems={data.pagination.total} itemsPerPage={data.pagination.pageSize} currentPage={data.pagination.page} onPageChange={setPage} />
        </div>
      )}
      <VendorTransactionDrawer type="purchaseOrder" docEntry={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
