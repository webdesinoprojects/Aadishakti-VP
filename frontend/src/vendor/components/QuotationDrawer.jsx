import { X, Calendar, FileText, IndianRupee } from 'lucide-react';

export default function QuotationDrawer({ isOpen, onClose, quotation }) {
  if (!quotation && !isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const getStatusColor = (status) => {
    const s = status?.toUpperCase() || '';
    if (s.includes('ACCEPTED')) return '#2e7d32'; // Green
    if (s.includes('REJECTED')) return '#d32f2f'; // Red
    return '#f57c00'; // Orange for Under Review
  };

  return (
    <div className={`vendor-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={handleOverlayClick}>
      <div className="vendor-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="vendor-drawer-header">
          <div>
            <div className="vendor-drawer-title">Quotation: {quotation?.id}</div>
            <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#666' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={14} /> Submitted: {quotation?.submittedDate}
              </span>
            </div>
          </div>
          <button className="vendor-drawer-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="vendor-drawer-body">
          <div className="vendor-drawer-section">
            <div style={{ padding: '20px', background: '#fafafa', border: '1px solid #eee', borderRadius: '4px', marginBottom: '30px' }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#666', fontWeight: 'bold', marginBottom: '5px' }}>Related RFQ</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111', marginBottom: '5px' }}>{quotation?.rfqTitle}</div>
              <div style={{ fontSize: '13px', color: '#666' }}>ID: {quotation?.rfqId}</div>
            </div>
          </div>

          <div className="vendor-drawer-section">
            <h4>Your Bid Details</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', borderLeft: '4px solid var(--red-core)' }}>
              <div style={{ background: 'rgba(211, 47, 47, 0.1)', padding: '12px', borderRadius: '50%', color: 'var(--red-core)' }}>
                <IndianRupee size={24} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>Quoted Amount</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#111' }}>₹ {quotation?.amount}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>Per Metric Ton (MT)</div>
              </div>
            </div>
          </div>

          <div className="vendor-drawer-section">
            <h4>Remarks / Terms</h4>
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '4px', fontSize: '14px', color: '#333', lineHeight: '1.6' }}>
              <p style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <FileText size={18} style={{ color: '#999', flexShrink: 0, marginTop: '2px' }} />
                <span>Standard payment terms apply (30 days from GRN). Delivery capability is 20 MT per week from the date of Purchase Order. Material strictly adheres to required purity specifications.</span>
              </p>
            </div>
          </div>

          <div className="vendor-drawer-section" style={{ marginTop: 'auto' }}>
            <div style={{ 
              padding: '20px', 
              borderRadius: '4px', 
              textAlign: 'center', 
              border: `2px dashed ${getStatusColor(quotation?.status)}`,
              color: getStatusColor(quotation?.status),
              background: `${getStatusColor(quotation?.status)}10`
            }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', marginBottom: '5px' }}>Current Status</div>
              <div style={{ fontSize: '20px', fontWeight: '800', textTransform: 'uppercase' }}>{quotation?.status}</div>
              {quotation?.status === 'Accepted' && <div style={{ fontSize: '13px', marginTop: '8px' }}>Purchase Order will be generated shortly.</div>}
              {quotation?.status === 'Under Review' && <div style={{ fontSize: '13px', marginTop: '8px' }}>Our procurement team is evaluating your bid.</div>}
              {quotation?.status === 'Rejected' && <div style={{ fontSize: '13px', marginTop: '8px' }}>We proceeded with another vendor for this RFQ.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
