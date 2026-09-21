import { useCallback, useEffect, useState } from 'react';
import { CheckCircle, Eye, FileText, XCircle } from 'lucide-react';
import TopBar from '../../components/TopBar';
import ConfirmModal from '../../components/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import { operationsAPI } from '../../utils/api';
import ReconciliationRejectDialog from './ReconciliationRejectDialog';
import ReconciliationReviewDrawer from './ReconciliationReviewDrawer';
import './reconciliations.css';

export default function ReconciliationsManager() {
  const [soas, setSoas] = useState([]);
  const [previewTarget, setPreviewTarget] = useState(null);
  const [verificationTarget, setVerificationTarget] = useState(null);
  const [rejectionTarget, setRejectionTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const { success, error: showError } = useToast();

  useEffect(() => {
    operationsAPI.getReconciliations({})
      .then((response) => setSoas(response.data || []))
      .catch((requestError) => showError(requestError.response?.data?.error || 'Failed to load reconciliations.'));
  }, [showError]);

  const updateStatement = (updated) => {
    setSoas((current) => current.map((statement) => statement.id === updated.id ? updated : statement));
    setPreviewTarget((current) => current?.id === updated.id ? updated : current);
  };

  const handleVerify = async (item) => {
    setBusy(true);
    try {
      const response = await operationsAPI.reviewReconciliation(item.id, { action: 'verify' });
      updateStatement(response.data);
      setVerificationTarget(null);
      setPreviewTarget(null);
      success('Statement verified and permanently locked.');
    } catch (requestError) {
      showError(requestError.response?.data?.error || 'Failed to verify reconciliation.');
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async (item, reviewNote) => {
    setBusy(true);
    try {
      const response = await operationsAPI.reviewReconciliation(item.id, { action: 'reject', reviewNote });
      updateStatement(response.data);
      setRejectionTarget(null);
      setPreviewTarget(null);
      success('Statement rejected and the reason was sent to the submitter.');
    } catch (requestError) {
      showError(requestError.response?.data?.error || 'Failed to reject reconciliation.');
    } finally {
      setBusy(false);
    }
  };

  const closePreview = useCallback(() => setPreviewTarget(null), []);
  const pendingSoas = soas.filter((statement) => statement.status === 'Pending Verification');
  const reviewedSoas = soas.filter((statement) => statement.status !== 'Pending Verification');

  return (
    <>
      <TopBar breadcrumb="Operations / Quarterly Reconciliations" />
      <div className="admin-content">
        <h1 className="card-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Quarterly Reconciliations</h1>
        <p className="card-subtitle" style={{ marginBottom: '32px' }}>Review and verify Statements of Account submitted by Vendors and Customers.</p>

        <section style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Pending Reconciliations ({pendingSoas.length})</h3>
          {pendingSoas.length === 0 ? (
            <div style={{ background: '#f8fafc', padding: '30px', textAlign: 'center', borderRadius: '8px', color: '#64748b' }}>All caught up! No pending SOAs to verify.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pendingSoas.map((soa) => (
                <article key={soa.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}><FileText size={24} color="#3b82f6" /></div>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>{soa.userId}<span style={{ fontSize: '12px', background: '#e2e8f0', padding: '2px 8px', borderRadius: '12px', marginLeft: '8px', fontWeight: '500' }}>{soa.role}</span></h4>
                      <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500', marginBottom: '4px' }}>Quarter: {soa.quarter}</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Submitted: {new Date(soa.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button className="btn btn-secondary" type="button" onClick={() => setPreviewTarget(soa)}><Eye size={16} /> View Document</button>
                    <button className="btn btn-danger" type="button" onClick={() => setRejectionTarget(soa)}><XCircle size={16} /> Reject</button>
                    <button className="btn btn-success" type="button" onClick={() => setVerificationTarget(soa)}><CheckCircle size={16} /> Verify &amp; Lock</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#64748b' }}>Review History</h3>
          <div className="responsive-table-shell">
            <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <thead><tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', background: '#f8fafc', color: '#64748b' }}><th style={{ padding: '16px' }}>Partner ID</th><th style={{ padding: '16px' }}>Role</th><th style={{ padding: '16px' }}>Quarter</th><th style={{ padding: '16px' }}>Document</th><th style={{ padding: '16px' }}>Status</th><th style={{ padding: '16px' }}>Review note</th></tr></thead>
              <tbody>
                {reviewedSoas.map((soa) => (
                  <tr key={soa.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px', fontWeight: '500' }}>{soa.userId}</td><td style={{ padding: '16px' }}>{soa.role}</td><td style={{ padding: '16px' }}>{soa.quarter}</td>
                    <td style={{ padding: '16px' }}><button className="btn btn-secondary" type="button" onClick={() => setPreviewTarget(soa)}><Eye size={15} /> View</button></td>
                    <td style={{ padding: '16px', color: soa.status === 'Verified' ? '#166534' : '#b91c1c', fontWeight: '600' }}>{soa.status === 'Verified' ? <CheckCircle size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> : <XCircle size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} />} {soa.status}</td>
                    <td style={{ padding: '16px' }}><div className="reconciliation-review-note">{soa.reviewNote || '—'}</div></td>
                  </tr>
                ))}
                {!reviewedSoas.length && <tr><td colSpan="6" style={{ padding: '28px', textAlign: 'center', color: '#64748b' }}>No statements have been reviewed yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <ReconciliationReviewDrawer item={previewTarget} busy={busy} onClose={closePreview} onVerify={setVerificationTarget} onReject={setRejectionTarget} />
      <ReconciliationRejectDialog item={rejectionTarget} busy={busy} onClose={() => setRejectionTarget(null)} onSubmit={handleReject} />
      <ConfirmModal isOpen={Boolean(verificationTarget)} onClose={() => !busy && setVerificationTarget(null)} onConfirm={() => handleVerify(verificationTarget)} title="Verify Statement of Account" message="Verify this SOA and lock it permanently? This cannot be changed afterward." confirmText={busy ? 'Verifying...' : 'Verify & Lock'} type="success" />
    </>
  );
}
