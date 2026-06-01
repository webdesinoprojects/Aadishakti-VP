import { useEffect, useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import TopBar from '../../components/TopBar';
import ConfirmModal from '../../components/ConfirmModal';
import { crmAPI } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

export default function ApplicationsManager() {
  const [items, setItems] = useState([]);
  const [deleteItem, setDeleteItem] = useState(null);
  const { success, error } = useToast();

  const load = async () => {
    try { const res = await crmAPI.getApplications({}); setItems(res.data || []); }
    catch { error('Failed to load applications'); }
  };

  useEffect(() => { load(); }, []);

  const remove = async () => {
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
                    <td><a className="btn btn-secondary" href={crmAPI.downloadCV(a.id)} target="_blank" rel="noreferrer"><Download size={14} /> CV</a></td>
                    <td><button className="btn btn-secondary" onClick={() => setDeleteItem(a)}><Trash2 size={14} /> Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ConfirmModal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={remove} title="Delete Application" message="Are you sure?" confirmText="Delete" type="danger" />
    </>
  );
}
