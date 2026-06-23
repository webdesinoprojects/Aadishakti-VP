import { useState, useEffect } from 'react';
import VendorPageHeader from '../components/VendorPageHeader';
import { Upload, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import { buildApiUrl } from '../../config/api';

export default function ReconciliationPage() {
  const user = { username: 'v1' };
  const [soas, setSoas] = useState([
    { id: 1, userId: 'V-8821', role: 'Vendor', quarter: 'Q1 2026', fileName: 'soa_v1.pdf', originalName: 'SOA_Q1_2026.pdf', status: 'Pending Verification', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 5, userId: 'V-8821', role: 'Vendor', quarter: 'Q4 2025', fileName: 'soa_v2.pdf', originalName: 'SOA_Q4_2025.pdf', status: 'Verified', createdAt: new Date(Date.now() - 9000000000).toISOString() }
  ]);
  const [file, setFile] = useState(null);
  const [quarter, setQuarter] = useState('Q1 2026');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file to upload');

    // Check if quarter already has a verified SOA
    const existing = soas.find(s => s.quarter === quarter && s.status === 'Verified');
    if (existing) return alert(`You already have a verified SOA for ${quarter}. It cannot be changed.`);

    setUploading(true);
    setTimeout(() => {
      setSoas([{ id: Date.now(), userId: user.username, role: 'Vendor', quarter, fileName: file.name, originalName: file.name, status: 'Pending Verification', createdAt: new Date().toISOString() }, ...soas]);
      setFile(null);
      setUploading(false);
    }, 1000);
  };

  return (
    <div>
      <VendorPageHeader 
        title="Statements & Reconciliation" 
        subtitle="Upload your Quarterly Statement of Account (SOA) for Admin verification." 
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', marginTop: '20px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Upload New SOA</h3>
          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: '500' }}>Select Quarter</label>
              <select 
                value={quarter} 
                onChange={e => setQuarter(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <option>Q1 2026 (Jan - Mar)</option>
                <option>Q2 2026 (Apr - Jun)</option>
                <option>Q3 2026 (Jul - Sep)</option>
                <option>Q4 2026 (Oct - Dec)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: '500' }}>SOA Document (PDF, Excel, Word)</label>
              <input 
                type="file" 
                onChange={e => setFile(e.target.files[0])}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={uploading}
              style={{ background: 'var(--red-core)', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <Upload size={18} /> {uploading ? 'Uploading...' : 'Submit SOA'}
            </button>
          </form>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Upload History</h3>
          {soas.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '6px' }}>
              No statements uploaded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {soas.map(soa => (
                <div key={soa.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={24} color="#64748b" />
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '15px' }}>{soa.quarter}</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Submitted on {new Date(soa.createdAt).toLocaleDateString()}</div>
                      <a href={buildApiUrl(`/uploads/soas/${soa.fileName}`)} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>View {soa.originalName}</a>
                    </div>
                  </div>
                  <div>
                    {soa.status === 'Verified' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                        <CheckCircle size={14} /> Verified & Reconciled
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#92400e', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                        <AlertCircle size={14} /> Pending Verification
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
