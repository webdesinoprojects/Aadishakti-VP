import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Archive, X } from 'lucide-react';
import TopBar from '../../components/TopBar';
import ConfirmModal from '../../components/ConfirmModal';
import { cmsAPI } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

export default function CareersManager() {
  const [items, setItems] = useState([
    {
      id: "lead-smelting-operator",
      category: "factory",
      title: "Lead Smelting Plant Operator",
      location: "MUNDRA PLANT, GUJARAT",
      dept: "Operations",
      exp: "3–5 Years in Smelting",
      desc: "Supervise furnace operations, manage molten metal pouring, monitor draft systems, and maintain strict industrial safety standards.",
      whyWorkHere: "Working at our Mundra plant gives you hands-on experience with world-class rotary furnaces. We prioritize safety and continuous skill development.",
      img: "/gallery/plants/Mundra/Rotary_1.jpeg",
      status: "Open"
    },
    {
      id: "senior-industrial-accountant",
      category: "office",
      title: "Senior Industrial Accountant",
      location: "NEW DELHI CORPORATE OFFICE",
      dept: "Finance",
      exp: "4–6 Years in Manufacturing Accounts",
      desc: "Manage GST documentation, customs clearance reports for scrap vessels, vendor reconciliations, and routine ledger audits.",
      whyWorkHere: "Join a dynamic finance team at our New Delhi headquarters with exposure to international trade and bulk commodity accounting.",
      img: "/gallery/office/Roorkee/WhatsApp_Image_2026-03-11_at_16.03.15.jpeg",
      status: "Open"
    }
  ]);
  
  const defaultForm = { title: '', category: 'factory', location: '', dept: '', exp: '', desc: '', whyWorkHere: '', img: '', status: 'Open' };
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const { success, error } = useToast();

  useEffect(() => { 
    (async () => {
      try { 
        const res = await cmsAPI.getCareers(); 
        if (res.data && res.data.length > 0) setItems(res.data);
      } catch { 
        console.warn('Failed to load jobs from API, using dummy data.');
      }
    })(); 
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.location.trim()) return error('Title and Location are required');
    
    try {
      if (editingId) {
        // Mock update
        // await cmsAPI.updateCareer(editingId, form);
        setItems(prev => prev.map(item => item.id === editingId ? { ...form, id: editingId } : item));
        success('Job updated successfully');
      } else {
        // Mock create
        // const res = await cmsAPI.createCareer(form);
        const newItem = { ...form, id: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now() };
        setItems(prev => [newItem, ...prev]);
        success('Job added successfully');
      }
      closeSidebar();
    } catch { 
      error('Failed to save job'); 
    }
  };

  const remove = async () => {
    if (!deleteItem) return;
    try {
      // await cmsAPI.deleteCareer(deleteItem.id);
      setItems((prev) => prev.filter((x) => x.id !== deleteItem.id));
      setDeleteItem(null);
      success('Job deleted');
    } catch { error('Failed to delete job'); }
  };

  const toggleStatus = (item) => {
    const newStatus = item.status === 'Open' ? 'Archived' : 'Open';
    setItems(prev => prev.map(x => x.id === item.id ? { ...x, status: newStatus } : x));
    success(`Job marked as ${newStatus}`);
  };

  const openEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setShowSidebar(true);
  };

  const openAdd = () => {
    setForm(defaultForm);
    setEditingId(null);
    setShowSidebar(true);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
    setForm(defaultForm);
    setEditingId(null);
  };

  return (
    <>
      <TopBar breadcrumb="CMS / Careers" />
      <div className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 className="card-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Careers & Jobs</h1>
            <p className="card-subtitle" style={{ margin: 0 }}>Manage job postings displayed on the careers page.</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Plus size={16} /> Add Job
          </button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '16px' }}>Role</th>
                <th style={{ padding: '16px' }}>Category</th>
                <th style={{ padding: '16px' }}>Department</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No jobs found. Click "Add Job" to create one.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{item.location}</div>
                    </td>
                    <td style={{ padding: '16px', textTransform: 'capitalize' }}>{item.category}</td>
                    <td style={{ padding: '16px' }}>{item.dept || '-'}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        background: item.status === 'Open' ? '#dcfce7' : '#f1f5f9', 
                        color: item.status === 'Open' ? '#166534' : '#475569' 
                      }}>
                        {item.status || 'Open'}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => toggleStatus(item)} style={{ background: 'none', border: '1px solid #e2e8f0', padding: '6px', borderRadius: '4px', cursor: 'pointer', color: '#64748b' }} title={item.status === 'Open' ? 'Archive' : 'Re-open'}>
                          <Archive size={16} />
                        </button>
                        <button onClick={() => openEdit(item)} style={{ background: 'none', border: '1px solid #e2e8f0', padding: '6px', borderRadius: '4px', cursor: 'pointer', color: '#3b82f6' }} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setDeleteItem(item)} style={{ background: 'none', border: '1px solid #e2e8f0', padding: '6px', borderRadius: '4px', cursor: 'pointer', color: '#dc2626' }} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={remove} title="Delete Job" message="Are you sure you want to delete this job posting?" confirmText="Delete" type="danger" />

      {/* Sliding Sidebar for Add/Edit Form */}
      {showSidebar && (
        <>
          <div onClick={closeSidebar} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '500px', background: '#fff', zIndex: 1001, boxShadow: '-5px 0 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>{editingId ? 'Edit Job' : 'Add New Job'}</h2>
              <button onClick={closeSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
              <form id="jobForm" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input required className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      <option value="factory">Factory</option>
                      <option value="office">Office</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="Open">Open</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input required className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input className="form-input" value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experience</label>
                    <input className="form-input" placeholder="e.g. 3-5 Years" value={form.exp} onChange={(e) => setForm({ ...form, exp: e.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input className="form-input" placeholder="/gallery/..." value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} />
                </div>

                <div className="form-group">
                  <label className="form-label">Job Description</label>
                  <textarea className="form-input" rows="4" style={{ resize: 'vertical' }} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })}></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Why Work Here?</label>
                  <textarea className="form-input" rows="4" style={{ resize: 'vertical' }} value={form.whyWorkHere} onChange={(e) => setForm({ ...form, whyWorkHere: e.target.value })}></textarea>
                </div>
              </form>
            </div>

            <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={closeSidebar} style={{ padding: '10px 16px', background: 'none', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
              <button type="submit" form="jobForm" className="btn btn-primary" style={{ padding: '10px 16px', borderRadius: '6px', fontWeight: '600' }}>Save Job</button>
            </div>

          </div>
        </>
      )}
    </>
  );
}
