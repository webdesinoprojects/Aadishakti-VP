import { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar';
import { CheckCircle, XCircle, ArrowRight, X } from 'lucide-react';
import { operationsAPI } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import ProfileUpdateReviewDialog from './ProfileUpdateReviewDialog';
import './profile-updates.css';

const fieldLabel = (key) => ({
  email: 'Email Address', phone: 'Phone', mobile: 'Mobile', taxReference: 'Tax Reference',
  gst: 'GST', bankAccountNo: 'Account No', ifsc: 'IFSC',
}[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()));

const ProfileValues = ({ data = {}, compare = {} }) => {
  const keys = [...new Set([...Object.keys(compare || {}), ...Object.keys(data || {})])];
  return <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
    {keys.map((key) => <div key={key} style={{ color: compare[key] !== undefined && compare[key] !== data[key] ? '#2563eb' : 'inherit' }}><strong>{fieldLabel(key)}:</strong> {data[key] || 'N/A'}</div>)}
  </div>;
};

export default function VendorApprovalsManager() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const { success, error: showError } = useToast();

  useEffect(() => {
    operationsAPI.getProfileUpdates({})
      .then((response) => setRequests(response.data || []))
      .catch((error) => showError(error.response?.data?.error || 'Failed to load profile updates.'));
  }, [showError]);

  const handleAction = async (request, action, reviewNote) => {
    setBusy(true);
    try {
      const response = await operationsAPI.reviewProfileUpdate(request.id, { action, reviewNote });
      setRequests(prev => prev.map(item => item.id === request.id ? response.data : item));
      setSelectedRequest((current) => current?.id === request.id ? response.data : current);
      setReviewTarget(null);
      success(action === 'reject' ? 'Request rejected. The reason is now visible to the partner.' : 'Request approved. The decision is now visible to the partner.');
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to review profile update.');
    } finally {
      setBusy(false);
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const pastRequests = requests.filter(r => r.status !== 'Pending');

  return (
    <>
      <TopBar breadcrumb="Operations / Profile Updates" />
      <div className="admin-content">
        <h1 className="card-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Partner Profile Updates</h1>
        <p className="card-subtitle" style={{ marginBottom: '32px' }}>Review and verify profile change requests from existing partners.</p>

      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Pending Requests ({pendingRequests.length})</h3>
        {pendingRequests.length === 0 ? (
          <div style={{ background: '#f8fafc', padding: '30px', textAlign: 'center', borderRadius: '8px', color: '#64748b' }}>
            No pending profile requests.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {pendingRequests.map(req => (
              <div 
                key={req.id} 
                onClick={() => setSelectedRequest(req)}
                style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Partner: {req.vendorId}</h4>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Request ID: {req.requestReference} • Submitted: {new Date(req.createdAt).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setReviewTarget({ request: req, action: 'reject' }); }}
                      style={{ background: '#fff', color: '#dc2626', border: '1px solid #dc2626', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '13px' }}>
                      <XCircle size={16} /> Reject
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setReviewTarget({ request: req, action: 'approve' }); }}
                      style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '13px' }}>
                      <CheckCircle size={16} /> Approve Changes
                    </button>
                  </div>
                </div>

                <div className="admin-comparison-grid" style={{ background: '#f8fafc', padding: '20px', borderRadius: '6px' }}>
                  <div>
                    <h5 style={{ margin: '0 0 12px 0', fontSize: '12px', textTransform: 'uppercase', color: '#64748b' }}>Current Data</h5>
                    <ProfileValues data={req.oldData} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', color: '#94a3b8' }}>
                    <ArrowRight size={24} />
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 12px 0', fontSize: '12px', textTransform: 'uppercase', color: '#2563eb' }}>Requested Changes</h5>
                    <ProfileValues data={req.newData} compare={req.oldData} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#64748b' }}>History</h3>
        <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
              <th style={{ padding: '12px' }}>Request ID</th>
              <th style={{ padding: '12px' }}>Partner</th>
              <th style={{ padding: '12px' }}>Date</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Review note</th>
            </tr>
          </thead>
          <tbody>
            {pastRequests.map(req => (
              <tr 
                key={req.id} 
                onClick={() => setSelectedRequest(req)}
                style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer', background: '#fff', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
                <td style={{ padding: '12px' }}>{req.requestReference}</td>
                <td style={{ padding: '12px' }}>{req.vendorId}</td>
                <td style={{ padding: '12px' }}>{new Date(req.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '12px', color: req.status === 'Approved' ? '#22c55e' : '#dc2626', fontWeight: '600' }}>{req.status}</td>
                <td style={{ padding: '12px', color: '#64748b' }}>{req.reviewNote || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Sidebar Modal for Details */}
    {selectedRequest && (
      <>
        <div 
          onClick={() => setSelectedRequest(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} 
        />
        <div className="admin-drawer" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', background: '#fff', zIndex: 1001, boxShadow: '-5px 0 15px rgba(0,0,0,0.1)', padding: '24px', overflowY: 'auto', transform: 'translateX(0)', transition: 'transform 0.3s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Request Details</h2>
            <button onClick={() => setSelectedRequest(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Request ID</div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedRequest.requestReference}</div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Partner ID</div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedRequest.vendorId}</div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Status</div>
            <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', background: selectedRequest.status === 'Approved' ? '#dcfce7' : selectedRequest.status === 'Rejected' ? '#fee2e2' : '#fef3c7', color: selectedRequest.status === 'Approved' ? '#166534' : selectedRequest.status === 'Rejected' ? '#991b1b' : '#92400e' }}>{selectedRequest.status}</div>
          </div>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Submitted On</div>
            <div style={{ fontSize: '15px' }}>{new Date(selectedRequest.createdAt).toLocaleString()}</div>
          </div>

          {selectedRequest.reviewNote && <div style={{ marginBottom: '24px', padding: '14px 16px', borderLeft: `3px solid ${selectedRequest.status === 'Rejected' ? '#dc2626' : '#22c55e'}`, background: selectedRequest.status === 'Rejected' ? '#fef2f2' : '#f0fdf4' }}><strong style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Message to partner</strong><span style={{ color: '#475569', fontSize: '13px', lineHeight: 1.5 }}>{selectedRequest.reviewNote}</span></div>}

          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#64748b', marginBottom: '16px', letterSpacing: '0.05em' }}>Current Data</h3>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}><ProfileValues data={selectedRequest.oldData} /></div>

          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#2563eb', marginBottom: '16px', letterSpacing: '0.05em' }}>Requested Changes</h3>
          <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '8px' }}><ProfileValues data={selectedRequest.newData} compare={selectedRequest.oldData} /></div>

          {selectedRequest.status === 'Pending' && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
              <button 
                onClick={() => setReviewTarget({ request: selectedRequest, action: 'reject' })}
                style={{ flex: 1, padding: '12px', background: '#fff', border: '1px solid #dc2626', color: '#dc2626', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Reject</button>
              <button 
                onClick={() => setReviewTarget({ request: selectedRequest, action: 'approve' })}
                style={{ flex: 1, padding: '12px', background: '#22c55e', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Approve</button>
            </div>
          )}
        </div>
      </>
    )}
    <ProfileUpdateReviewDialog target={reviewTarget} busy={busy} onClose={() => !busy && setReviewTarget(null)} onSubmit={handleAction} />
    </>
  );
}
