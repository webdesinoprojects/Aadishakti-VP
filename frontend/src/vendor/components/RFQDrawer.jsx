import { X, Calendar, Tag, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function RFQDrawer({ isOpen, onClose, rfq }) {
  const [quotePrice, setQuotePrice] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Reset form when RFQ changes or opens
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuotePrice('');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRemarks('');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubmitted(false);
    }
  }, [isOpen, rfq]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className={`vendor-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={handleOverlayClick}>
      <div className="vendor-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="vendor-drawer-header">
          <div>
            <div className="vendor-drawer-title">{rfq?.title}</div>
            <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#666' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Tag size={14} /> {rfq?.category}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={14} /> Due: {rfq?.deadline}
              </span>
            </div>
          </div>
          <button className="vendor-drawer-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="vendor-drawer-body">
          <div className="vendor-drawer-section">
            <h4>Description</h4>
            <p>{rfq?.description || 'No detailed description provided.'}</p>
          </div>

          <div className="vendor-drawer-section">
            <h4>Requirements</h4>
            {rfq?.requirements && rfq.requirements.length > 0 ? (
              <ul className="vendor-drawer-list">
                {rfq.requirements.map((req, i) => <li key={i}>{req}</li>)}
              </ul>
            ) : (
              <p className="vendor-drawer-list">Standard quality requirements apply.</p>
            )}
          </div>

          {rfq?.status === 'Open' && (
            <div className="vendor-drawer-section">
              <h4>Submit Your Quotation</h4>
              {submitted ? (
                <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={20} />
                  <div>
                    <strong>Quotation Submitted!</strong><br/>
                    <span style={{ fontSize: '13px' }}>Your bid has been successfully recorded.</span>
                  </div>
                </div>
              ) : (
                <form className="vendor-quote-form" onSubmit={handleSubmit}>
                  <div className="float-form-group">
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Price per MT (₹)</label>
                    <input 
                      type="number" 
                      required 
                      className="float-form-control" 
                      placeholder="e.g. 150000"
                      value={quotePrice}
                      onChange={(e) => setQuotePrice(e.target.value)}
                    />
                  </div>
                  <div className="float-form-group">
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Remarks (Optional)</label>
                    <textarea 
                      className="float-form-control" 
                      placeholder="Delivery timeline, payment terms, etc."
                      rows="3"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      style={{ resize: 'vertical' }}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-solid-red" style={{ width: '100%', height: '44px' }}>
                    Submit Bid
                  </button>
                </form>
              )}
            </div>
          )}

          {rfq?.status !== 'Open' && (
            <div className="vendor-drawer-section">
              <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '4px', textAlign: 'center', color: '#666' }}>
                This RFQ is currently <strong style={{ textTransform: 'uppercase' }}>{rfq?.status}</strong> and is not accepting new quotations.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
