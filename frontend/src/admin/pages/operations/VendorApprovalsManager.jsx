import { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { buildApiUrl } from '../../../config/api';

export default function VendorApprovalsManager() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch(buildApiUrl('/api/admin/profile-requests'));
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(buildApiUrl(`/api/admin/profile-requests/${id}/${action}`), {
        method: 'POST'
      });
      if (res.ok) {
        fetchRequests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading...</div>;

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const pastRequests = requests.filter(r => r.status !== 'Pending');

  return (
    <>
      <TopBar breadcrumb="Operations / Vendor Approvals" />
      <div className="admin-content" style={{ maxWidth: '1000px' }}>
        <h1 className="card-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Vendor Approvals</h1>
        <p className="card-subtitle" style={{ marginBottom: '32px' }}>Review and verify profile change requests from vendors.</p>

      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Pending Requests ({pendingRequests.length})</h3>
        {pendingRequests.length === 0 ? (
          <div style={{ background: '#f8fafc', padding: '30px', textAlign: 'center', borderRadius: '8px', color: '#64748b' }}>
            No pending profile requests.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {pendingRequests.map(req => (
              <div key={req.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Vendor: {req.vendorId}</h4>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Request ID: {req.id} • Submitted: {new Date(req.createdAt).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleAction(req.id, 'reject')}
                      style={{ background: '#fff', color: '#dc2626', border: '1px solid #dc2626', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '13px' }}>
                      <XCircle size={16} /> Reject
                    </button>
                    <button 
                      onClick={() => handleAction(req.id, 'approve')}
                      style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '13px' }}>
                      <CheckCircle size={16} /> Approve Changes
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: '20px', alignItems: 'center', background: '#f8fafc', padding: '20px', borderRadius: '6px' }}>
                  <div>
                    <h5 style={{ margin: '0 0 12px 0', fontSize: '12px', textTransform: 'uppercase', color: '#64748b' }}>Current Data</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                      <div><strong>GST:</strong> {req.oldData.gst || 'N/A'}</div>
                      <div><strong>Account No:</strong> {req.oldData.bankAccountNo || 'N/A'}</div>
                      <div><strong>IFSC:</strong> {req.oldData.ifsc || 'N/A'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', color: '#94a3b8' }}>
                    <ArrowRight size={24} />
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 12px 0', fontSize: '12px', textTransform: 'uppercase', color: '#2563eb' }}>Requested Changes</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                      <div style={{ color: req.oldData.gst !== req.newData.gst ? '#2563eb' : 'inherit' }}>
                        <strong>GST:</strong> {req.newData.gst || 'N/A'}
                      </div>
                      <div style={{ color: req.oldData.bankAccountNo !== req.newData.bankAccountNo ? '#2563eb' : 'inherit' }}>
                        <strong>Account No:</strong> {req.newData.bankAccountNo || 'N/A'}
                      </div>
                      <div style={{ color: req.oldData.ifsc !== req.newData.ifsc ? '#2563eb' : 'inherit' }}>
                        <strong>IFSC:</strong> {req.newData.ifsc || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#64748b' }}>History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
              <th style={{ padding: '12px' }}>Request ID</th>
              <th style={{ padding: '12px' }}>Vendor</th>
              <th style={{ padding: '12px' }}>Date</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {pastRequests.map(req => (
              <tr key={req.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px' }}>{req.id}</td>
                <td style={{ padding: '12px' }}>{req.vendorId}</td>
                <td style={{ padding: '12px' }}>{new Date(req.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '12px', color: req.status === 'Approved' ? '#22c55e' : '#dc2626', fontWeight: '600' }}>{req.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
