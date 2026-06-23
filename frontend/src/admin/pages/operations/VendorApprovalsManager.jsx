import { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar';
import { CheckCircle, XCircle, ArrowRight, X } from 'lucide-react';
import { buildApiUrl } from '../../../config/api';

export default function VendorApprovalsManager() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([
    {
      id: 'REQ-9921',
      vendorId: 'V-8821',
      status: 'Pending',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      oldData: { gst: '27AADCB2230M1Z2', bankAccountNo: '000012345678', ifsc: 'HDFC0001234' },
      newData: { gst: '27AADCB2230M1Z2', bankAccountNo: '000098765432', ifsc: 'ICIC0005678' }
    },
    {
      id: 'REQ-9922',
      vendorId: 'V-1044',
      status: 'Pending',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      oldData: { gst: '24BBBBB1234A1Z5', bankAccountNo: '555544443333', ifsc: 'SBIN0001111' },
      newData: { gst: '24BBBBB1234A1Z9', bankAccountNo: '555544443333', ifsc: 'SBIN0001111' }
    },
    {
      id: 'REQ-9910',
      vendorId: 'V-5501',
      status: 'Approved',
      createdAt: new Date(Date.now() - 500000000).toISOString(),
      oldData: { gst: '07AAAAA0000A1Z5', bankAccountNo: '111122223333', ifsc: 'UTIB0000001' },
      newData: { gst: '07AAAAA0000A1Z5', bankAccountNo: '111122223333', ifsc: 'UTIB0000001' }
    }
  ]);

  const handleAction = async (id, action) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action === 'approve' ? 'Approved' : 'Rejected' } : r));
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
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Vendor: {req.vendorId}</h4>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Request ID: {req.id} • Submitted: {new Date(req.createdAt).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAction(req.id, 'reject'); }}
                      style={{ background: '#fff', color: '#dc2626', border: '1px solid #dc2626', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '13px' }}>
                      <XCircle size={16} /> Reject
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAction(req.id, 'approve'); }}
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
              <tr 
                key={req.id} 
                onClick={() => setSelectedRequest(req)}
                style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer', background: '#fff', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
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

    {/* Sidebar Modal for Details */}
    {selectedRequest && (
      <>
        <div 
          onClick={() => setSelectedRequest(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} 
        />
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', background: '#fff', zIndex: 1001, boxShadow: '-5px 0 15px rgba(0,0,0,0.1)', padding: '24px', overflowY: 'auto', transform: 'translateX(0)', transition: 'transform 0.3s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Request Details</h2>
            <button onClick={() => setSelectedRequest(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Request ID</div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedRequest.id}</div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Vendor ID</div>
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

          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#64748b', marginBottom: '16px', letterSpacing: '0.05em' }}>Current Data</h3>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div><strong>GST:</strong> {selectedRequest.oldData.gst || 'N/A'}</div>
            <div><strong>Account No:</strong> {selectedRequest.oldData.bankAccountNo || 'N/A'}</div>
            <div><strong>IFSC:</strong> {selectedRequest.oldData.ifsc || 'N/A'}</div>
          </div>

          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#2563eb', marginBottom: '16px', letterSpacing: '0.05em' }}>Requested Changes</h3>
          <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '8px', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ color: selectedRequest.oldData.gst !== selectedRequest.newData.gst ? '#2563eb' : 'inherit' }}><strong>GST:</strong> {selectedRequest.newData.gst || 'N/A'}</div>
            <div style={{ color: selectedRequest.oldData.bankAccountNo !== selectedRequest.newData.bankAccountNo ? '#2563eb' : 'inherit' }}><strong>Account No:</strong> {selectedRequest.newData.bankAccountNo || 'N/A'}</div>
            <div style={{ color: selectedRequest.oldData.ifsc !== selectedRequest.newData.ifsc ? '#2563eb' : 'inherit' }}><strong>IFSC:</strong> {selectedRequest.newData.ifsc || 'N/A'}</div>
          </div>

          {selectedRequest.status === 'Pending' && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
              <button 
                onClick={() => { handleAction(selectedRequest.id, 'reject'); setSelectedRequest(null); }}
                style={{ flex: 1, padding: '12px', background: '#fff', border: '1px solid #dc2626', color: '#dc2626', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Reject</button>
              <button 
                onClick={() => { handleAction(selectedRequest.id, 'approve'); setSelectedRequest(null); }}
                style={{ flex: 1, padding: '12px', background: '#22c55e', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Approve</button>
            </div>
          )}
        </div>
      </>
    )}
    </>
  );
}
