import { useEffect, useState, useCallback } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import TopBar from '../../components/TopBar';
import ConfirmModal from '../../components/ConfirmModal';
import { crmAPI } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import CrmDocumentDrawer from './CrmDocumentDrawer';

export default function ApplicationsManager() {
  const [items, setItems] = useState([]);
  const [deleteItem, setDeleteItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const { success, error } = useToast();

  const load = useCallback(async () => {
    try { const res = await crmAPI.getApplications({}); setItems(res.data || []); }
    catch { error('Failed to load applications'); }
  }, [error]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove() {
    if (!deleteItem) return;
    try {
      await crmAPI.deleteApplication(deleteItem.id);
      setItems((prev) => prev.filter((x) => x.id !== deleteItem.id));
      setDeleteItem(null);
      success('Application deleted');
    } catch { error('Failed to delete application'); }
  };

  return (
    <>
      <TopBar breadcrumb="CRM / Applications" />
      <div className="admin-content">
        <div className="card">
          <h1 className="card-title">Job Applications</h1>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Date</th><th>CV</th><th>Action</th></tr></thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id}>
                    <td>{a.fullName}</td><td>{a.email}</td><td>{a.roleCategory}</td><td>{a.submittedAt ? format(new Date(a.submittedAt), 'MMM d, yyyy') : '-'}</td>
                    <td><button type="button" className="btn btn-secondary" onClick={() => setPreviewItem(a)}><Eye size={14} /> View CV</button></td>
                    <td><button className="btn btn-secondary" onClick={() => setDeleteItem(a)}><Trash2 size={14} /> Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <CrmDocumentDrawer
        open={Boolean(previewItem)}
        onOpenChange={(open) => !open && setPreviewItem(null)}
        eyebrow="Career application"
        title={previewItem?.resumeOriginalName || `${previewItem?.fullName || 'Applicant'} resume`}
        subtitle="Review the submitted resume without leaving Admin."
        media={previewItem ? {
          url: previewItem.resumeUrl || crmAPI.downloadCV(previewItem.id),
          name: previewItem.resumeOriginalName || 'resume.pdf',
          mime_type: previewItem.resumeMimeType,
        } : null}
        metadata={previewItem ? [
          { label: 'Applicant', value: previewItem.fullName },
          { label: 'Role', value: previewItem.roleCategory },
          { label: 'Experience', value: previewItem.experience },
          { label: 'Submitted', value: previewItem.submittedAt ? format(new Date(previewItem.submittedAt), 'MMM d, yyyy, h:mm a') : '-' },
        ] : []}
      />
      <ConfirmModal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={remove} title="Delete Application" message="Are you sure?" confirmText="Delete" type="danger" />
    </>
  );
}
