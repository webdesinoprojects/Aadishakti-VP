import { useState } from 'react';
import { ReturnDrawer } from '../components/CustomerDrawers';
import CustomerPageHeader from '../components/CustomerPageHeader';
import { useCustomerData } from '../hooks/useCustomerData';

export default function ReturnsPage() {
  const { data, loading } = useCustomerData();
  const [selectedReturn, setSelectedreturn] = useState(null);

  if (loading || !data) return <div style={{ padding: '40px' }}>Loading...</div>;

  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader 
        title="Returns & Refunds" 
        subtitle="Track your returned shipments and refund status." 
        action={<button className="customer-btn-outline" style={{ background: 'var(--text-primary)', color: 'white', border: 'none' }}>Request Return</button>}
      />
      <div className="customer-card" style={{ padding: 0 }}>
        <table className="customer-table">
          <thead><tr><th>Return ID</th><th>Order ID</th><th>Date</th><th>Reason</th><th>Refund Amount</th><th>Status</th></tr></thead>
          <tbody>
            {(data.returns || []).map(r => (
              <tr key={r.id} onClick={() => setSelectedreturn(r)} style={{cursor: "pointer"}} className="hover-row">
                <td style={{ fontWeight: '600' }}>{r.id}</td>
                <td>{r.orderId}</td>
                <td>{r.date}</td>
                <td>{r.reason}</td>
                <td style={{ fontWeight: '600' }}>₹ {r.amount.toLocaleString('en-IN')}</td>
                <td><span className="status-badge confirmed">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ReturnDrawer returnItem={selectedReturn} onClose={() => setSelectedreturn(null)} />
    </div>
  );
}
