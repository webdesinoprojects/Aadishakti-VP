import { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar';
import { CheckCircle, AlertCircle, FileText, Download } from 'lucide-react';
import { buildApiUrl } from '../../../config/api';

export default function ReconciliationsManager() {
  const [soas, setSoas] = useState([
    { id: 1, userId: 'V-8821', role: 'Vendor', quarter: 'Q1 2026', fileName: 'soa_v1.pdf', originalName: 'SOA_V8821.pdf', status: 'Pending Verification', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 2, userId: 'C-3029', role: 'Customer', quarter: 'Q1 2026', fileName: 'soa_c1.pdf', originalName: 'Statement_C3029.pdf', status: 'Verified', createdAt: new Date(Date.now() - 500000000).toISOString() },
    { id: 3, userId: 'V-1044', role: 'Vendor', quarter: 'Q4 2025', fileName: 'soa_v2.pdf', originalName: 'Vendor_SOA_Q4.pdf', status: 'Pending Verification', createdAt: new Date(Date.now() - 172800000).toISOString() }
  ]);

  const handleVerify = async (id) => {
    if (!window.confirm('Are you sure you want to verify this SOA? It will be locked permanently.')) return;
    setSoas(prev => prev.map(s => s.id === id ? { ...s, status: 'Verified' } : s));
  };

  const pendingSoas = soas.filter(s => s.status === 'Pending Verification');
  const verifiedSoas = soas.filter(s => s.status === 'Verified');

  return (
    <>
      <TopBar breadcrumb="Operations / Quarterly Reconciliations" />
      <div className="admin-content">
        <h1 className="card-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Quarterly Reconciliations</h1>
        <p className="card-subtitle" style={{ marginBottom: '32px' }}>Review and verify Statements of Account submitted by Vendors and Customers.</p>

        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Pending Reconciliations ({pendingSoas.length})</h3>
          {pendingSoas.length === 0 ? (
            <div style={{ background: '#f8fafc', padding: '30px', textAlign: 'center', borderRadius: '8px', color: '#64748b' }}>
              All caught up! No pending SOAs to verify.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pendingSoas.map(soa => (
                <div key={soa.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                      <FileText size={24} color="#3b82f6" />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{soa.userId} <span style={{ fontSize: '12px', background: '#e2e8f0', padding: '2px 8px', borderRadius: '12px', marginLeft: '8px', fontWeight: '500' }}>{soa.role}</span></h4>
                      <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500', marginBottom: '4px' }}>Quarter: {soa.quarter}</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Submitted: {new Date(soa.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <a 
                      href={buildApiUrl(`/uploads/soas/${soa.fileName}`)} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ background: '#fff', color: '#0f172a', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '13px', textDecoration: 'none' }}>
                      <Download size={16} /> View Document
                    </a>
                    <button 
                      onClick={() => handleVerify(soa.id)}
                      style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '13px' }}>
                      <CheckCircle size={16} /> Verify & Lock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#64748b' }}>Verified History</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', background: '#f8fafc', color: '#64748b' }}>
                <th style={{ padding: '16px' }}>Partner ID</th>
                <th style={{ padding: '16px' }}>Role</th>
                <th style={{ padding: '16px' }}>Quarter</th>
                <th style={{ padding: '16px' }}>Document</th>
                <th style={{ padding: '16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {verifiedSoas.map(soa => (
                <tr key={soa.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{soa.userId}</td>
                  <td style={{ padding: '16px' }}>{soa.role}</td>
                  <td style={{ padding: '16px' }}>{soa.quarter}</td>
                  <td style={{ padding: '16px' }}>
                    <a href={buildApiUrl(`/uploads/soas/${soa.fileName}`)} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>View File</a>
                  </td>
                  <td style={{ padding: '16px', color: '#166534', fontWeight: '600' }}><CheckCircle size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Verified</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
