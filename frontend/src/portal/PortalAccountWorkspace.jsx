import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Clock3, Eye, EyeOff, KeyRound, RotateCcw, Save, ShieldCheck, XCircle } from 'lucide-react';
import { portalAuthApi } from '../services/portalAuthApi';
import { usePortalToast } from './PortalToastContext';
import './portal-account-workspace.css';

const cleanValue = (value) => value == null || value === 'Unavailable' ? '' : String(value);
const profileFields = [
  { key: 'email', label: 'Email Address', type: 'email', placeholder: 'name@company.com' },
  { key: 'phone', label: 'Phone', type: 'tel', placeholder: 'Business phone number' },
  { key: 'mobile', label: 'Mobile', type: 'tel', placeholder: 'Mobile number' },
  { key: 'taxReference', label: 'Tax Reference', type: 'text', placeholder: 'GST / tax reference' },
];

const statusMeta = {
  Approved: { icon: CheckCircle2, className: 'is-approved' },
  Rejected: { icon: XCircle, className: 'is-rejected' },
  Pending: { icon: Clock3, className: 'is-pending' },
};

const initialProfileValues = (profile) => Object.fromEntries(
  profileFields.map(({ key }) => [key, cleanValue(profile[key])]),
);

export default function PortalAccountWorkspace({ api, profile, role = 'vendor' }) {
  const [requests, setRequests] = useState([]);
  const [formValues, setFormValues] = useState(() => initialProfileValues(profile));
  const [submitting, setSubmitting] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const knownStatuses = useRef(new Map());
  const historyLoaded = useRef(false);
  const toast = usePortalToast();
  const originalValues = useMemo(() => initialProfileValues(profile), [profile]);
  const changedFields = profileFields.filter(({ key }) => originalValues[key] !== formValues[key]);
  const latestDecision = requests.find((request) => request.status === 'Rejected' || request.status === 'Approved');

  const loadRequests = useCallback(async ({ reportError = true } = {}) => {
    try {
      const result = await api.getProfileUpdates();
      const nextRequests = result.data || [];
      if (historyLoaded.current) {
        nextRequests.forEach((request) => {
          const previousStatus = knownStatuses.current.get(request.id);
          if (previousStatus === 'Pending' && request.status === 'Rejected') {
            toast.error(`Profile request ${request.requestReference} was rejected${request.reviewNote ? `: ${request.reviewNote}` : '.'}`);
          }
          if (previousStatus === 'Pending' && request.status === 'Approved') {
            toast.success(`Profile request ${request.requestReference} was approved.`);
          }
        });
      }
      knownStatuses.current = new Map(nextRequests.map((request) => [request.id, request.status]));
      historyLoaded.current = true;
      setRequests(nextRequests);
    } catch (error) {
      if (reportError) toast.error(error.response?.data?.error || 'Unable to load profile-update history.');
    }
  }, [api, toast]);

  useEffect(() => {
    loadRequests();
    const intervalId = window.setInterval(() => loadRequests({ reportError: false }), 15000);
    return () => window.clearInterval(intervalId);
  }, [loadRequests]);

  const submitProfileUpdate = async (event) => {
    event.preventDefault();
    if (!changedFields.length) return toast.warning('Change at least one field before submitting.');
    setSubmitting(true);
    try {
      await api.submitProfileUpdate({ oldData: originalValues, newData: formValues });
      toast.success('Profile update request sent to Admin for review.');
      setFormValues(originalValues);
      await loadRequests({ reportError: false });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to submit the profile update request.');
    } finally {
      setSubmitting(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    if (values.newPassword !== values.confirmPassword) return toast.error('New password and confirmation do not match.');
    if (values.currentPassword === values.newPassword) return toast.warning('Choose a new password different from the current password.');
    setChangingPassword(true);
    try {
      await portalAuthApi.changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword }, role);
      form.reset();
      toast.success('Portal password changed successfully.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to change password.');
    } finally {
      setChangingPassword(false);
    }
  };

  return <div className={`portal-account-workspace is-${role}`}>
    <section className="portal-account-card">
      <header className="portal-account-card-header">
        <div className="portal-account-heading-icon is-blue"><Save size={21} /></div>
        <div><h2>Request profile correction</h2><p>CIS master data remains read-only until an administrator verifies your request.</p></div>
        {changedFields.length > 0 && <span className="portal-account-change-count">{changedFields.length} changed</span>}
      </header>
      <form className="portal-account-form" onSubmit={submitProfileUpdate}>
        <div className="portal-account-grid">
          {profileFields.map(({ key, label, type, placeholder }) => <label key={key} className={originalValues[key] !== formValues[key] ? 'is-changed' : ''}>
            <span>{label}{originalValues[key] !== formValues[key] && <small>Modified</small>}</span>
            <input type={type} value={formValues[key]} placeholder={placeholder} onChange={(event) => setFormValues((current) => ({ ...current, [key]: event.target.value }))} />
          </label>)}
        </div>
        <footer className="portal-account-form-footer">
          <p><ShieldCheck size={16} /> Your request will be reviewed before any profile correction is applied.</p>
          <div>
            <button type="button" className="portal-account-secondary" disabled={!changedFields.length || submitting} onClick={() => setFormValues(originalValues)}><RotateCcw size={16} /> Reset</button>
            <button type="submit" className="portal-account-primary" disabled={!changedFields.length || submitting}><Save size={16} /> {submitting ? 'Submitting…' : 'Submit for review'}</button>
          </div>
        </footer>
      </form>
    </section>

    <section className="portal-account-card">
      <header className="portal-account-card-header">
        <div className="portal-account-heading-icon is-amber"><KeyRound size={21} /></div>
        <div><h2>Change portal password</h2><p>This updates your own portal login immediately and does not require admin approval.</p></div>
      </header>
      <form className="portal-account-form" onSubmit={changePassword}>
        <div className="portal-account-password-grid">
          <label><span>Current password</span><input name="currentPassword" type={showPasswords ? 'text' : 'password'} required autoComplete="current-password" /></label>
          <label><span>New password</span><input name="newPassword" type={showPasswords ? 'text' : 'password'} required minLength="8" autoComplete="new-password" /></label>
          <label><span>Confirm new password</span><input name="confirmPassword" type={showPasswords ? 'text' : 'password'} required minLength="8" autoComplete="new-password" /></label>
        </div>
        <footer className="portal-account-form-footer">
          <button type="button" className="portal-account-password-toggle" onClick={() => setShowPasswords((current) => !current)}>{showPasswords ? <EyeOff size={16} /> : <Eye size={16} />} {showPasswords ? 'Hide passwords' : 'Show passwords'}</button>
          <button type="submit" className="portal-account-primary is-dark" disabled={changingPassword}><KeyRound size={16} /> {changingPassword ? 'Updating…' : 'Change password'}</button>
        </footer>
      </form>
    </section>

    <section className="portal-account-card portal-account-history">
      <header className="portal-account-card-header">
        <div className="portal-account-heading-icon is-green"><Clock3 size={21} /></div>
        <div><h2>Request history</h2><p>Track admin decisions and review notes for your submitted corrections.</p></div>
        <span className="portal-account-history-count">{requests.length} total</span>
      </header>
      {latestDecision && <div className={`portal-account-decision is-${latestDecision.status.toLowerCase()}`} role="status">
        {latestDecision.status === 'Rejected' ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
        <div>
          <strong>{latestDecision.requestReference} was {latestDecision.status.toLowerCase()}</strong>
          <p>{latestDecision.reviewNote || (latestDecision.status === 'Approved' ? 'Your requested profile correction was approved.' : 'Please review the request details and submit a corrected request.')}</p>
        </div>
        {latestDecision.reviewedAt && <time>{new Date(latestDecision.reviewedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</time>}
      </div>}
      <div className="portal-account-table-shell">
        <table><thead><tr><th>Request</th><th>Submitted</th><th>Status</th><th>Admin note</th></tr></thead>
          <tbody>{requests.map((item) => {
            const meta = statusMeta[item.status] || statusMeta.Pending;
            const Icon = meta.icon;
            return <tr key={item.id}><td><strong>{item.requestReference}</strong></td><td>{new Date(item.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td><td><span className={`portal-account-status ${meta.className}`}><Icon size={14} />{item.status}</span></td><td>{item.reviewNote || <span className="portal-account-muted">No note</span>}</td></tr>;
          })}
          {!requests.length && <tr><td colSpan="4"><div className="portal-account-empty"><Clock3 size={28} /><strong>No update requests yet</strong><span>Your submitted profile corrections will appear here.</span></div></td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  </div>;
}
