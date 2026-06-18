import { useState } from 'react';
import CustomerPageHeader from '../components/CustomerPageHeader';

export default function MyProfilePage() {
  const session = JSON.parse(localStorage.getItem('customer_session') || '{}');
  const [activeTab, setActiveTab] = useState('Company Details');

  const tabs = ['Company Details', 'Address Book', 'Security'];

  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader title="My Profile" subtitle="Manage your company details and portal settings." />
      
      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* Left Nav */}
        <div className="customer-card" style={{ width: '250px', padding: '16px' }}>
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                display: 'block', width: '100%', padding: '12px 16px', textAlign: 'left',
                background: activeTab === tab ? 'var(--red-subtle)' : 'transparent',
                color: activeTab === tab ? 'var(--red-core)' : 'var(--text-primary)',
                border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginBottom: '4px'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="customer-card" style={{ flex: 1 }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>{activeTab}</h2>
          
          {activeTab === 'Company Details' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--red-core)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold' }}>
                  {session.name ? session.name.charAt(0) : 'C'}
                </div>
                <div>
                  <button className="customer-btn-outline" style={{ marginBottom: '8px' }}>Upload Logo</button>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>JPG, GIF or PNG. Max size 800K</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Company Name</label>
                  <input type="text" defaultValue={session.name || 'Company Name'} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Customer ID</label>
                  <input type="text" defaultValue={session.customerId || 'CUST992'} disabled style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: '#f1f5f9' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Email Address</label>
                  <input type="email" defaultValue="contact@company.com" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>GSTIN</label>
                  <input type="text" defaultValue="27ABCDE1234F1Z5" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                </div>
              </div>
              <button className="customer-btn-outline" style={{ background: 'var(--red-core)', color: 'white', border: 'none', marginTop: '30px' }}>Save Changes</button>
            </div>
          )}

          {activeTab === 'Address Book' && (
            <div>
              <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '20px' }}>
                <h4 style={{ fontWeight: '700', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>Billing Address <span className="status-badge confirmed">Primary</span></h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>123 Industrial Area, Phase 1<br/>Mumbai, Maharashtra 400001<br/>India</p>
                <button className="customer-btn-outline" style={{ marginTop: '16px', padding: '6px 12px' }}>Edit</button>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div style={{ maxWidth: '400px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Current Password</label>
                <input type="password" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>New Password</label>
                <input type="password" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
              </div>
              <button className="customer-btn-outline" style={{ background: 'var(--text-primary)', color: 'white', border: 'none' }}>Update Password</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
