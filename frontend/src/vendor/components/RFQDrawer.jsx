import { X, Calendar, Tag, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function RFQDrawer({ isOpen, onClose, rfq, onChatSent }) {
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setChatInput('');
    }
  }, [isOpen, rfq]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  
  const handleAcceptOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryId: rfq.id,
          vendorId: 'v1',
          vendorName: 'Shree Metal Traders',
          customerName: rfq.fullName,
          product: rfq.inquiryType,
          amount: "Pending"
        })
      });
      if (!res.ok) throw new Error('Failed to create order');
      alert("Order Accepted! You can now track it in your Purchase Orders page.");
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/enquiries/${rfq.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'Vendor', message: chatInput })
      });
      if (!res.ok) throw new Error('Failed to send message');
      setChatInput('');
      if (onChatSent) onChatSent(); // refresh parent
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderSpecs = () => {
    if (rfq?.inquiryType === 'Custom Alloy Quote' && rfq.additionalDetails?.includes('Custom Specification Request:')) {
      try {
        const match = rfq.additionalDetails.match(/Custom Specification Request:\n([\s\S]+?)\n\nNotes: ([\s\S]*)/);
        if (match) {
          const specs = JSON.parse(match[1]);
          return (
            <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "6px", marginBottom: "20px" }}>
              <h5 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>Requested Metallurgical Specs</h5>
              <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                <tbody>
                  {Object.entries(specs).map(([key, val]) => (
                    <tr key={key} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "8px 0", fontWeight: 600, textTransform: "capitalize" }}>{key}</td>
                      <td style={{ padding: "8px 0", fontFamily: "var(--font-mono)" }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h5 style={{ margin: "15px 0 5px 0", fontSize: "14px" }}>Additional Notes</h5>
              <p style={{ margin: 0, fontSize: "13px" }}>{match[2] || "None"}</p>
            </div>
          );
        }
      } catch (e) { }
    }
    return <p>{rfq?.additionalDetails || 'No additional details provided.'}</p>;
  };

  return (
    <div className={`vendor-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={handleOverlayClick}>
      <div className="vendor-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="vendor-drawer-header">
          <div>
            <div className="vendor-drawer-title">{rfq?.inquiryType || 'Enquiry Details'}</div>
            <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#666' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Tag size={14} /> {rfq?.companyName || rfq?.fullName}
              </span>
              {rfq?.submittedAt && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={14} /> Assigned: {format(new Date(rfq.submittedAt), 'MMM d')}
                </span>
              )}
            </div>
          </div>
          <button className="vendor-drawer-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="vendor-drawer-body" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div className="vendor-drawer-section">
              <h4>Customer Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                <div><strong>Name:</strong> {rfq?.fullName}</div>
                <div><strong>Email:</strong> <a href={`mailto:${rfq?.workEmail}`}>{rfq?.workEmail}</a></div>
                <div><strong>Phone:</strong> {rfq?.phone}</div>
                <div><strong>Country:</strong> {rfq?.country}</div>
              </div>
            </div>

            <div className="vendor-drawer-section">
              <h4>Enquiry Requirements</h4>
              {renderSpecs()}
            </div>

            
            <div className="vendor-drawer-section">
              <div style={{ background: '#e8f5e9', padding: '20px', borderRadius: '8px', border: '1px solid #c8e6c9', textAlign: 'center' }}>
                <h4 style={{ color: '#2e7d32', marginBottom: '10px' }}>Ready to fulfill this request?</h4>
                <p style={{ fontSize: '13px', color: '#388e3c', marginBottom: '15px' }}>Accepting this assignment will instantly create an active Order and begin the live tracking pipeline.</p>
                <button 
                  className="btn-solid-red" 
                  style={{ background: '#2e7d32', padding: '10px 30px', border: 'none' }}
                  onClick={handleAcceptOrder}
                  disabled={loading}
                >
                  <CheckCircle size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                  Accept Assignment
                </button>
              </div>
            </div>

            <div className="vendor-drawer-section">
              <h4>Chat with Admin</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {(rfq?.chatHistory || []).map((chat, i) => (
                  <div key={i} style={{ 
                    alignSelf: chat.sender === 'Vendor' ? 'flex-end' : 'flex-start',
                    background: chat.sender === 'Vendor' ? '#111' : '#f5f5f5',
                    color: chat.sender === 'Vendor' ? '#fff' : '#111',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    maxWidth: '85%'
                  }}>
                    <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '4px' }}>{chat.sender} • {format(new Date(chat.timestamp), 'MMM d, h:mm a')}</div>
                    <div style={{ fontSize: '13px', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>{chat.message}</div>
                  </div>
                ))}
                {(!rfq?.chatHistory || rfq.chatHistory.length === 0) && (
                  <div style={{ textAlign: "center", color: "#888", fontSize: "13px", padding: "20px 0" }}>
                    No messages yet. Send a message to clarify requirements.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ padding: '20px', borderTop: '1px solid #eaeaea', background: '#fff' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Type your message..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                style={{ flex: 1 }}
              />
              <button 
                className="btn-solid-red" 
                onClick={handleSendChat} 
                disabled={!chatInput.trim() || loading}
                style={{ padding: '0 20px' }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
