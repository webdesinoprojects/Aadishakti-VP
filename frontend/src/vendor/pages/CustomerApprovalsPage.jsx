import { useState } from 'react';
import { CheckCircle, XCircle, X, Copy, Users } from 'lucide-react';

import VendorPageHeader from '../components/VendorPageHeader';

export default function CustomerApprovalsPage() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [generatedId, setGeneratedId] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');

  const [applications, setApplications] = useState([
    {
      id: 'APP-2001',
      type: 'customer',
      companyName: 'BuildRight Construction',
      contactPerson: 'Suresh Patil',
      email: 'suresh@buildright.com',
      phone: '+91 7777777777',
      pan: 'CCCCC2222C',
      gst: '24CCCCC2222C1Z0',
      status: 'Pending',
      createdAt: new Date(Date.now() - 10000000).toISOString()
    },
    {
      id: 'APP-2002',
      type: 'customer',
      companyName: 'Apex Infrastructures',
      contactPerson: 'Neha Gupta',
      email: 'neha@apexinfa.in',
      phone: '+91 6666666666',
      pan: 'DDDDD3333D',
      gst: '27DDDDD3333D1Z1',
      status: 'Pending',
      createdAt: new Date(Date.now() - 5000000).toISOString()
    }
  ]);

  const pendingApps = applications.filter(a => a.status === 'Pending');
  const pastApps = applications.filter(a => a.status !== 'Pending');

  const generateCredentials = (app) => {
    const prefix = 'C-';
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const randomPass = Math.random().toString(36).slice(-8);
    setGeneratedId(`${prefix}${randomId}`);
    setGeneratedPassword(randomPass);
    setSelectedApp(app);
  };

  const handleApprove = () => {
    setApplications(prev => prev.map(a => a.id === selectedApp.id ? { ...a, status: 'Approved', assignedId: generatedId } : a));
    alert(`Customer Approved & Credentials Generated!`);
    setSelectedApp(null);
  };

  const handleReject = (id) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'Rejected' } : a));
    alert('Application Rejected.');
  };

  return (
    <div style={{ padding: '40px' }}>
      <VendorPageHeader 
        title="Customer Approvals" 
        subtitle="Review and approve your new customer account requests." 
      />

      <div className="vendor-panel" style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Pending Approvals ({pendingApps.length})</h3>
        
        {pendingApps.length === 0 ? (
          <div style={{ background: '#f8fafc', padding: '40px', textAlign: 'center', borderRadius: '8px', color: '#64748b' }}>
            No pending customer registrations right now.
          </div>
        ) : (
          <table className="vendor-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Company Name</th>
                <th>Contact Person</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApps.map(app => (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td style={{ fontWeight: '600' }}>{app.companyName}</td>
                  <td>{app.contactPerson}</td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button 
                      onClick={() => generateCredentials(app)}
                      className="btn-rfq btn-rfq-active">
                      Review & Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="vendor-panel">
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#64748b' }}>Registration History</h3>
        <table className="vendor-table">
          <thead>
            <tr>
              <th>App ID</th>
              <th>Company Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Assigned ID</th>
            </tr>
          </thead>
          <tbody>
            {pastApps.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No history available.</td>
              </tr>
            ) : pastApps.map(app => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.companyName}</td>
                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge status-${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </td>
                <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>{app.assignedId || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Approve Modal Sidebar */}
      {selectedApp && (
        <>
          <div onClick={() => setSelectedApp(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '450px', background: '#fff', zIndex: 1001, boxShadow: '-5px 0 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Review Application</h2>
              <button onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' }}>{selectedApp.companyName}</h3>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>App ID: {selectedApp.id} • {new Date(selectedApp.createdAt).toLocaleDateString()}</div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '14px' }}>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Contact Person</div>
                    <div style={{ fontWeight: '500' }}>{selectedApp.contactPerson}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Email</div>
                    <div style={{ fontWeight: '500', wordBreak: 'break-all' }}>{selectedApp.email}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Phone</div>
                    <div style={{ fontWeight: '500' }}>{selectedApp.phone}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Tax Details</div>
                    <div style={{ fontWeight: '500' }}>PAN: {selectedApp.pan}<br/>GST: {selectedApp.gst}</div>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '8px', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#92400e', marginBottom: '16px', letterSpacing: '0.05em' }}>Generated Credentials</h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#92400e', marginBottom: '6px' }}>Assigned Customer ID</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="text" value={generatedId} onChange={(e) => setGeneratedId(e.target.value)} style={{ flex: 1, padding: '10px 14px', border: '1px solid #fcd34d', borderRadius: '6px 0 0 6px', fontSize: '16px', fontWeight: '600', fontFamily: 'monospace' }} />
                    <button onClick={() => navigator.clipboard.writeText(generatedId)} style={{ padding: '11px 16px', background: '#fde68a', border: '1px solid #fcd34d', borderLeft: 'none', borderRadius: '0 6px 6px 0', cursor: 'pointer', color: '#92400e' }}><Copy size={16} /></button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#92400e', marginBottom: '6px' }}>Temporary Password</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="text" value={generatedPassword} readOnly style={{ flex: 1, padding: '10px 14px', border: '1px solid #fcd34d', borderRadius: '6px 0 0 6px', fontSize: '16px', fontFamily: 'monospace' }} />
                    <button onClick={() => navigator.clipboard.writeText(generatedPassword)} style={{ padding: '11px 16px', background: '#fde68a', border: '1px solid #fcd34d', borderLeft: 'none', borderRadius: '0 6px 6px 0', cursor: 'pointer', color: '#92400e' }}><Copy size={16} /></button>
                  </div>
                  <div style={{ fontSize: '12px', color: '#b45309', marginTop: '6px' }}>They will be forced to change this upon first login.</div>
                </div>
              </div>
            </div>

            <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px' }}>
              <button onClick={() => { handleReject(selectedApp.id); setSelectedApp(null); }} style={{ flex: 1, padding: '12px', background: '#fff', border: '1px solid #dc2626', color: '#dc2626', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}><XCircle size={18} /> Reject</button>
              <button onClick={handleApprove} style={{ flex: 2, padding: '12px', background: '#22c55e', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} /> Confirm & Approve
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
