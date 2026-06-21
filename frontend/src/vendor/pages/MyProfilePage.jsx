import { useState, useEffect } from 'react';
import { useVendorData } from '../hooks/useVendorData';
import VendorPageHeader from '../components/VendorPageHeader';
import { Edit2, X, CheckCircle, Clock } from 'lucide-react';
import { buildApiUrl } from '../../config/api';

export default function MyProfilePage() {
  const { data, loading, error } = useVendorData();
  const [requests, setRequests] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(buildApiUrl('/api/vendor/profile-requests'))
      .then(r => r.json())
      .then(setRequests)
      .catch(console.error);
  }, []);

  if (loading) return <div style={{ padding: '40px' }}>Loading Profile...</div>;
  if (error || !data) return <div style={{ padding: '40px', color: 'var(--red-core)' }}>Error loading profile.</div>;

  const { profile } = data;
  
  // Find if there is an active pending request
  const pendingRequest = requests.find(r => r.status === 'Pending');

  const handleEditClick = () => {
    setFormData({
      bankAccountNo: profile.bankAccountNo || '',
      ifsc: profile.ifsc || '',
      gst: profile.gst || ''
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(buildApiUrl('/api/vendor/profile-request'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: 'v1',
          oldData: {
            bankAccountNo: profile.bankAccountNo,
            ifsc: profile.ifsc,
            gst: profile.gst
          },
          newData: formData
        })
      });
      const resData = await res.json();
      if (resData.success) {
        setRequests(prev => [...prev, resData.request]);
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px' }}>
      <VendorPageHeader 
        title="My Profile" 
        subtitle="View your registered business and financial details." 
      />

      {pendingRequest && (
        <div style={{ background: '#fff3cd', color: '#856404', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={20} />
          <div>
            <strong style={{ display: 'block', fontSize: '14px' }}>Profile Update Pending Verification</strong>
            <span style={{ fontSize: '13px' }}>Your recent request to update profile details is currently being reviewed by an Admin.</span>
          </div>
        </div>
      )}

      <div className="vendor-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{profile.name}</h2>
            <div style={{ fontSize: 'var(--fs-small)', color: 'var(--text-muted)' }}>Vendor Code: {profile.vendorCode}</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span className="status-badge status-confirmed">{profile.status}</span>
            {!pendingRequest && (
              <button 
                onClick={handleEditClick}
                style={{ background: 'var(--red-core)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600' }}
              >
                <Edit2 size={14} /> Request Update
              </button>
            )}
          </div>
        </div>

        <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Business Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
          <div>
            <label className="profile-field-label">Company Name</label>
            <div className="profile-field-value">{profile.name}</div>
          </div>
          <div>
            <label className="profile-field-label">Vendor Category</label>
            <div className="profile-field-value">{profile.category}</div>
          </div>
          <div>
            <label className="profile-field-label">PAN Number</label>
            <div className="profile-field-value">{profile.pan}</div>
          </div>
          <div>
            <label className="profile-field-label">GST Number</label>
            <div className="profile-field-value">{profile.gst}</div>
          </div>
        </div>

        <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Financial Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <label className="profile-field-label">Bank Account Number</label>
            <div className="profile-field-value" style={{ fontFamily: 'monospace', fontSize: '15px' }}>{profile.bankAccountNo || 'Not Provided'}</div>
          </div>
          <div>
            <label className="profile-field-label">IFSC Code</label>
            <div className="profile-field-value" style={{ fontFamily: 'monospace', fontSize: '15px' }}>{profile.ifsc || 'Not Provided'}</div>
          </div>
        </div>

      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '500px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Request Profile Update</h3>
              <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
            </div>
            
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              For security reasons, updates to sensitive financial or tax information require Admin verification. 
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>GST Number</label>
                <input 
                  type="text" 
                  value={formData.gst} 
                  onChange={e => setFormData({...formData, gst: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Bank Account Number</label>
                <input 
                  type="text" 
                  value={formData.bankAccountNo} 
                  onChange={e => setFormData({...formData, bankAccountNo: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>IFSC Code</label>
                <input 
                  type="text" 
                  value={formData.ifsc} 
                  onChange={e => setFormData({...formData, ifsc: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '10px 16px', background: 'none', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ padding: '10px 16px', background: 'var(--red-core)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
