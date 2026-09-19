import { useEffect, useState } from 'react';
import { portalAuthApi } from '../services/portalAuthApi';

const cleanValue = (value) => value == null || value === 'Unavailable' ? '' : String(value);
const profileFields = [
  ['email', 'Email Address'],
  ['phone', 'Phone'],
  ['mobile', 'Mobile'],
  ['taxReference', 'Tax Reference'],
];

export default function PortalAccountWorkspace({ api, profile, role = 'vendor' }) {
  const [requests, setRequests] = useState([]);
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isVendor = role === 'vendor';
  const cardClass = isVendor ? 'vendor-panel' : 'customer-card';
  const tableClass = isVendor ? 'vendor-table' : 'customer-table';
  const buttonClass = isVendor ? 'vendor-btn-outline' : 'customer-btn-outline';

  const loadRequests = async () => {
    try {
      const result = await api.getProfileUpdates();
      setRequests(result.data || []);
    } catch (error) {
      setProfileMessage(error.response?.data?.error || 'Unable to load profile-update history.');
    }
  };

  useEffect(() => { loadRequests(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submitProfileUpdate = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const oldData = Object.fromEntries(profileFields.map(([key]) => [key, cleanValue(profile[key])]));
    const newData = Object.fromEntries(profileFields.map(([key]) => [key, cleanValue(values[key])]));
    const changed = profileFields.some(([key]) => oldData[key] !== newData[key]);
    if (!changed) {
      setProfileMessage('Change at least one field before submitting.');
      setSubmitting(false);
      return;
    }
    try {
      await api.submitProfileUpdate({ oldData, newData });
      setProfileMessage('Profile update request submitted for Admin review.');
      await loadRequests();
    } catch (error) {
      setProfileMessage(error.response?.data?.error || 'Unable to submit the profile update request.');
    } finally {
      setSubmitting(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    if (values.newPassword !== values.confirmPassword) {
      setPasswordMessage('New password and confirmation do not match.');
      return;
    }
    try {
      await portalAuthApi.changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      form.reset();
      setPasswordMessage('Password changed successfully.');
    } catch (error) {
      setPasswordMessage(error.response?.data?.error || 'Unable to change password.');
    }
  };

  return <>
    <div className={cardClass} style={{ marginTop: '24px', padding: '20px' }}>
      <h3 style={{ margin: '0 0 6px' }}>Request Profile Update</h3>
      <p style={{ margin: '0 0 18px', color: 'var(--text-muted)' }}>CIS master data stays read-only. Submit corrections for Admin verification.</p>
      <form onSubmit={submitProfileUpdate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {profileFields.map(([key, label]) => <label key={key}>{label}<input name={key} defaultValue={cleanValue(profile[key])} style={{ width: '100%', padding: '10px', marginTop: '6px' }} /></label>)}
        <button className={buttonClass} disabled={submitting} style={{ alignSelf: 'end' }}>{submitting ? 'Submitting...' : 'Submit for Review'}</button>
      </form>
      {profileMessage && <p style={{ margin: '12px 0 0' }}>{profileMessage}</p>}
    </div>

    <div className={cardClass} style={{ marginTop: '24px', padding: '20px' }}>
      <h3 style={{ margin: '0 0 16px' }}>Change Portal Password</h3>
      <form onSubmit={changePassword} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', alignItems: 'end' }}>
        <label>Current Password<input name="currentPassword" type="password" required autoComplete="current-password" style={{ width: '100%', padding: '10px', marginTop: '6px' }} /></label>
        <label>New Password<input name="newPassword" type="password" required minLength="8" autoComplete="new-password" style={{ width: '100%', padding: '10px', marginTop: '6px' }} /></label>
        <label>Confirm New Password<input name="confirmPassword" type="password" required minLength="8" autoComplete="new-password" style={{ width: '100%', padding: '10px', marginTop: '6px' }} /></label>
        <button className={buttonClass}>Change Password</button>
      </form>
      {passwordMessage && <p style={{ margin: '12px 0 0' }}>{passwordMessage}</p>}
    </div>

    <div className={cardClass} style={{ marginTop: '24px', padding: 0 }}>
      <table className={tableClass}>
        <thead><tr><th>Request</th><th>Submitted</th><th>Status</th><th>Admin Note</th></tr></thead>
        <tbody>
          {requests.map((item) => <tr key={item.id}><td>{item.requestReference}</td><td>{new Date(item.createdAt).toLocaleDateString()}</td><td>{item.status}</td><td>{item.reviewNote || '-'}</td></tr>)}
          {!requests.length && <tr><td colSpan="4" style={{ textAlign: 'center' }}>No profile-update requests yet.</td></tr>}
        </tbody>
      </table>
    </div>
  </>;
}
