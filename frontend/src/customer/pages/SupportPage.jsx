import { useState } from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { SupportDrawer } from '../components/CustomerDrawers';
import CustomerPageHeader from '../components/CustomerPageHeader';
import { useCustomerData } from '../hooks/useCustomerData';

export default function SupportPage() {
  const { data, loading } = useCustomerData();
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedticket] = useState(null);

  if (loading || !data) return <div style={{ padding: '40px' }}>Loading...</div>;

  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader 
        title="Customer Support" 
        subtitle="Manage your support tickets and inquiries." 
        action={
          <button 
            onClick={() => setShowForm(!showForm)}
            className="customer-btn-outline" 
            style={{ background: 'var(--red-core)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> {showForm ? 'Cancel' : 'New Ticket'}
          </button>
        } 
      />

      {showForm && (
        <div className="customer-card" style={{ marginBottom: '30px', background: '#f8fafc', border: '1px dashed var(--border-color)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Create New Ticket</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Category</label>
              <select style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <option>Shipment Delay</option>
                <option>Invoice Query</option>
                <option>Quality Issue</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Related Order ID (Optional)</label>
              <input type="text" placeholder="e.g. ASPL/ORD/24-25/1256" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Description</label>
            <textarea rows="4" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)' }} placeholder="Please describe your issue in detail..."></textarea>
          </div>
          <button className="customer-btn-outline" style={{ background: 'var(--text-primary)', color: 'white', border: 'none' }}>Submit Ticket</button>
        </div>
      )}

      <div className="customer-card" style={{ padding: 0 }}>
        <table className="customer-table">
          <thead><tr><th>Ticket ID</th><th>Subject</th><th>Date Opened</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {(data.support || []).map(s => (
              <tr key={s.id} onClick={() => setSelectedticket(s)} style={{cursor: "pointer"}} className="hover-row">
                <td style={{ fontWeight: '600' }}>{s.id}</td>
                <td>{s.subject}</td>
                <td>{s.date}</td>
                <td><span className={`status-badge ${s.status === 'Resolved' ? 'delivered' : 'intransit'}`}>{s.status}</span></td>
                <td><button className="customer-btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><MessageSquare size={14}/> View Thread</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SupportDrawer ticket={selectedTicket} onClose={() => setSelectedticket(null)} />
    </div>
  );
}
