import { useState, useEffect } from 'react';
import { Search, Download, Eye, Archive, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import TopBar from '../../components/TopBar';
import ConfirmModal from '../../components/ConfirmModal';
import { crmAPI } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const EnquiriesManager = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [filters, setFilters] = useState({
    status: 'All',
    search: '',
  });
  const { success, error } = useToast();

  useEffect(() => {
    loadEnquiries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [enquiries, filters]);

  const loadEnquiries = async () => {
    try {
      const response = await crmAPI.getEnquiries({});
      setEnquiries(response.data);
    } catch (err) {
      console.error('Error loading enquiries:', err);
      error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...enquiries];

    if (filters.status !== 'All') {
      filtered = filtered.filter((enq) => enq.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (enq) =>
          enq.fullName?.toLowerCase().includes(searchLower) ||
          enq.companyName?.toLowerCase().includes(searchLower) ||
          enq.workEmail?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredEnquiries(filtered);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await crmAPI.updateEnquiry(id, { status: newStatus });
      setEnquiries((prev) =>
        prev.map((enq) => (enq.id === id ? { ...enq, status: newStatus } : enq))
      );
      success(`Status updated to ${newStatus}`);
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating status:', err);
      error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    try {
      await crmAPI.deleteEnquiry(deleteModal.id);
      setEnquiries((prev) => prev.filter((enq) => enq.id !== deleteModal.id));
      success('Enquiry deleted');
      setDeleteModal(null);
      if (selectedEnquiry?.id === deleteModal.id) {
        setSelectedEnquiry(null);
      }
    } catch (err) {
      console.error('Error deleting enquiry:', err);
      error('Failed to delete enquiry');
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Company', 'Email', 'Phone', 'Type', 'Products', 'Date', 'Status'];
    const rows = filteredEnquiries.map((enq) => [
      enq.fullName,
      enq.companyName,
      enq.workEmail,
      enq.phone,
      enq.inquiryType,
      enq.products?.join('; ') || '',
      format(new Date(enq.submittedAt), 'yyyy-MM-dd'),
      enq.status || 'New',
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enquiries-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    success('CSV downloaded');
  };

  const getStatusBadge = (status) => {
    const classes = {
      New: 'badge-new',
      'In Progress': 'badge-draft',
      Replied: 'badge-active',
      Archived: 'badge-archived',
    };
    return <span className={`badge ${classes[status] || 'badge-new'}`}>{status}</span>;
  };

  const getStatusColor = (status) => {
    const colors = {
      New: 'var(--admin-blue)',
      'In Progress': 'var(--admin-amber)',
      Replied: 'var(--admin-green)',
      Archived: '#6B7280',
    };
    return colors[status] || colors.New;
  };

  return (
    <>
      <TopBar breadcrumb="CRM / Enquiries" />
      <div className="admin-content">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Enquiries Manager</h1>
            <p className="card-subtitle">View and manage customer inquiries</p>
          </div>

          {/* Filter Bar */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '20px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              {['All', 'New', 'In Progress', 'Replied', 'Archived'].map((status) => (
                <button
                  key={status}
                  className={`btn ${filters.status === status ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilters({ ...filters, status })}
                  style={{ fontSize: '13px', padding: '8px 16px' }}
                >
                  {status}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--admin-text-muted)',
                }}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Search by name, company, email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                style={{ paddingLeft: '40px' }}
              />
            </div>

            <button className="btn btn-secondary" onClick={exportToCSV}>
              <Download size={16} /> Download CSV
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--admin-text-muted)' }}>
              Loading enquiries...
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <p style={{ color: 'var(--admin-text-muted)', marginBottom: '8px' }}>
                {filters.status !== 'All' || filters.search
                  ? 'No enquiries match your filters'
                  : 'No enquiries yet'}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--admin-text-light)' }}>
                When customers submit the contact form, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th style={{ width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnquiries.map((enq, index) => (
                    <tr
                      key={enq.id}
                      style={{
                        borderLeft: `3px solid ${getStatusColor(enq.status || 'New')}`,
                        background:
                          enq.status === 'New'
                            ? 'var(--admin-blue-light)'
                            : enq.status === 'Archived'
                            ? '#F9FAFB'
                            : 'transparent',
                      }}
                    >
                      <td className="text-mono" style={{ color: 'var(--admin-text-muted)' }}>
                        {index + 1}
                      </td>
                      <td style={{ fontWeight: 500 }}>{enq.fullName}</td>
                      <td>{enq.companyName}</td>
                      <td className="text-mono" style={{ fontSize: '12px' }}>
                        {enq.workEmail}
                      </td>
                      <td>{enq.inquiryType}</td>
                      <td className="text-mono">{format(new Date(enq.submittedAt), 'MMM d, yyyy')}</td>
                      <td>{getStatusBadge(enq.status || 'New')}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            className="btn btn-secondary"
                            onClick={() => setSelectedEnquiry(enq)}
                            style={{ padding: '6px 10px', fontSize: '12px' }}
                            title="View details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => setDeleteModal(enq)}
                            style={{ padding: '6px 10px', fontSize: '12px' }}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedEnquiry && (
        <EnquiryDrawer
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          onUpdateStatus={updateStatus}
          onDelete={(enq) => {
            setDeleteModal(enq);
            setSelectedEnquiry(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDelete}
        title="Delete Enquiry"
        message={`Are you sure you want to delete the enquiry from ${deleteModal?.fullName}?`}
        confirmText="Delete"
        type="danger"
      />
    </>
  );
};

const EnquiryDrawer = ({ enquiry, onClose, onUpdateStatus, onDelete }) => {
  const [notes, setNotes] = useState(enquiry.notes || '');
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  const saveNotes = async () => {
    setSaving(true);
    try {
      await crmAPI.updateEnquiry(enquiry.id, { notes });
      success('Notes saved');
    } catch (err) {
      console.error('Error saving notes:', err);
      error('Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '480px',
        background: 'var(--admin-surface)',
        boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '24px',
          borderBottom: '1px solid var(--admin-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
            {enquiry.fullName}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
            {enquiry.companyName} · {format(new Date(enquiry.submittedAt), 'MMM d, yyyy')}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: 'var(--admin-text-muted)',
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {/* Status */}
        <div style={{ marginBottom: '24px' }}>
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={enquiry.status || 'New'}
            onChange={(e) => onUpdateStatus(enquiry.id, e.target.value)}
          >
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Replied">Replied</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '4px' }}>
              EMAIL
            </div>
            <div className="text-mono" style={{ fontSize: '13px' }}>
              {enquiry.workEmail}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '4px' }}>
              PHONE
            </div>
            <div className="text-mono" style={{ fontSize: '13px' }}>
              {enquiry.phone}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '4px' }}>
              INQUIRY TYPE
            </div>
            <div style={{ fontSize: '13px' }}>{enquiry.inquiryType}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '4px' }}>
              COUNTRY
            </div>
            <div style={{ fontSize: '13px' }}>{enquiry.country}</div>
          </div>
        </div>

        {/* Products */}
        {enquiry.products && enquiry.products.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '8px' }}>
              PRODUCTS INTERESTED
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {enquiry.products.map((product, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '4px 10px',
                    background: 'var(--admin-red-light)',
                    color: 'var(--admin-red)',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {product}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Message */}
        {enquiry.additionalDetails && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '8px' }}>
              MESSAGE
            </div>
            <div
              style={{
                padding: '12px',
                background: 'var(--admin-bg)',
                borderRadius: '6px',
                fontSize: '13px',
                lineHeight: '1.6',
              }}
            >
              {enquiry.additionalDetails}
            </div>
          </div>
        )}

        {/* Internal Notes */}
        <div>
          <label className="form-label">Internal Notes</label>
          <textarea
            className="form-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this enquiry (not visible to customer)"
            rows={4}
          />
          <button
            className="btn btn-primary"
            onClick={saveNotes}
            disabled={saving}
            style={{ marginTop: '8px', fontSize: '13px', padding: '8px 16px' }}
          >
            {saving ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>

      {/* Footer Actions */}
      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--admin-border)',
          display: 'flex',
          gap: '12px',
        }}
      >
        <button
          className="btn btn-success"
          onClick={() => onUpdateStatus(enquiry.id, 'Replied')}
          style={{ flex: 1 }}
        >
          Mark as Replied
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => onUpdateStatus(enquiry.id, 'Archived')}
          style={{ flex: 1 }}
        >
          <Archive size={16} /> Archive
        </button>
        <button
          className="btn btn-danger"
          onClick={() => onDelete(enquiry)}
          style={{ padding: '10px 16px' }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default EnquiriesManager;
