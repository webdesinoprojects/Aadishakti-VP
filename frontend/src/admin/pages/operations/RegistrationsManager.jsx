import { useEffect, useState } from 'react';
import TopBar from '../../components/TopBar';
import { CheckCircle, XCircle, X, Copy } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { operationsAPI } from '../../utils/api';

export default function RegistrationsManager() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [generatedId, setGeneratedId] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('Pending CIS account mapping');
  const { success, error } = useToast();

  const [applications, setApplications] = useState([]);

  const loadApplications = async () => {
    try {
      const response = await operationsAPI.getRegistrations({});
      setApplications(response.data || []);
    } catch {
      error('Failed to load registrations');
    }
  };

  useEffect(() => { loadApplications(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const currentApps = applications;
  const pendingApps = currentApps.filter(a => a.status === 'Pending');
  const pastApps = currentApps.filter(a => a.status !== 'Pending');

  const generateCredentials = (app) => {
    const prefix = 'V-';
    const randomId = Math.floor(1000 + Math.random() * 9000);
    setGeneratedId(`${prefix}${randomId}`);
    setGeneratedPassword('Pending CIS account mapping');
    setSelectedApp(app);
  };

  const handleApprove = async () => {
    try {
      const response = await operationsAPI.reviewRegistration(selectedApp.id, { action: 'approve', assignedId: generatedId });
      setApplications(prev => prev.map(a => a.id === selectedApp.id ? response.data : a));
      success('Vendor registration approved. Portal access awaits CIS account mapping.');
      setSelectedApp(null);
    } catch {
      error('Failed to approve registration');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await operationsAPI.reviewRegistration(id, { action: 'reject' });
      setApplications(prev => prev.map(a => a.id === id ? response.data : a));
      success('Application rejected.');
    } catch {
      error('Failed to reject registration');
    }
  };

  return (
    <>
      <TopBar breadcrumb="Operations / New Registrations" />
      <div className="admin-content">
        <h1 className="card-title" style={{ fontSize: '24px', marginBottom: '8px' }}>New Partner Registrations</h1>
        <p className="card-subtitle" style={{ marginBottom: '32px' }}>Review and approve new vendor signups.</p>

        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Pending Approvals ({pendingApps.length})</h3>
          
          {pendingApps.length === 0 ? (
            <div style={{ background: '#f8fafc', padding: '40px', textAlign: 'center', borderRadius: '8px', color: '#64748b' }}>
              No pending registrations right now.
            </div>
          ) : (
            <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '16px' }}>App ID</th>
                  <th style={{ padding: '16px' }}>Company Name</th>
                  <th style={{ padding: '16px' }}>Contact Person</th>
                  <th style={{ padding: '16px' }}>Date</th>
                  <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingApps.map(app => (
                  <tr key={app.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px', fontWeight: '500' }}>{app.applicationReference}</td>
                    <td style={{ padding: '16px', fontWeight: '600' }}>{app.companyName}</td>
                    <td style={{ padding: '16px' }}>{app.contactPerson}</td>
                    <td style={{ padding: '16px' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button 
                        onClick={() => generateCredentials(app)}
                        style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                        Review & Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#64748b' }}>Registration History</h3>
          <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '16px' }}>App ID</th>
                <th style={{ padding: '16px' }}>Company Name</th>
                <th style={{ padding: '16px' }}>Date</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}>Assigned ID</th>
              </tr>
            </thead>
            <tbody>
              {pastApps.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No history available.</td>
                </tr>
              ) : pastApps.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{app.applicationReference}</td>
                  <td style={{ padding: '16px' }}>{app.companyName}</td>
                  <td style={{ padding: '16px' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      background: app.status === 'Approved' ? '#dcfce7' : '#fee2e2', 
                      color: app.status === 'Approved' ? '#166534' : '#991b1b' 
                    }}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: '600' }}>{app.assignedId || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approve Modal Sidebar */}
      {selectedApp && (
        <>
          <div onClick={() => setSelectedApp(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} />
          <div className="admin-drawer" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '450px', background: '#fff', zIndex: 1001, boxShadow: '-5px 0 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Review Application</h2>
              <button onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
              
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' }}>{selectedApp.companyName}</h3>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>App ID: {selectedApp.applicationReference} • {new Date(selectedApp.createdAt).toLocaleDateString()}</div>
                
                <div className="admin-form-grid" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '14px' }}>
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
                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#92400e', marginBottom: '16px', letterSpacing: '0.05em' }}>Access Provisioning</h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#92400e', marginBottom: '6px' }}>Assigned Vendor ID</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="text" value={generatedId} onChange={(e) => setGeneratedId(e.target.value)} style={{ flex: 1, padding: '10px 14px', border: '1px solid #fcd34d', borderRadius: '6px 0 0 6px', fontSize: '16px', fontWeight: '600', fontFamily: 'monospace' }} />
                    <button onClick={() => navigator.clipboard.writeText(generatedId)} style={{ padding: '11px 16px', background: '#fde68a', border: '1px solid #fcd34d', borderLeft: 'none', borderRadius: '0 6px 6px 0', cursor: 'pointer', color: '#92400e' }}><Copy size={16} /></button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#92400e', marginBottom: '6px' }}>Portal Access</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="text" value={generatedPassword} readOnly style={{ flex: 1, padding: '10px 14px', border: '1px solid #fcd34d', borderRadius: '6px 0 0 6px', fontSize: '16px', fontFamily: 'monospace' }} />
                    <button onClick={() => navigator.clipboard.writeText(generatedPassword)} style={{ padding: '11px 16px', background: '#fde68a', border: '1px solid #fcd34d', borderLeft: 'none', borderRadius: '0 6px 6px 0', cursor: 'pointer', color: '#92400e' }}><Copy size={16} /></button>
                  </div>
                  <div style={{ fontSize: '12px', color: '#b45309', marginTop: '6px' }}>CIS/SAP mapping must exist before portal credentials can be issued.</div>
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
    </>
  );
}
