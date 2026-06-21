import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Box, CheckCircle, ArrowLeft, Image as ImageIcon, Send } from 'lucide-react';
import { format } from 'date-fns';
import TopBar from '../../components/TopBar';
import ImageLightbox from '../../../components/ImageLightbox';

export default function LogisticsOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders');
      const data = await res.json();
      const found = data.find(o => o.id === id);
      setOrder(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleReviewPOD = async (action) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${order.id}/review-pod`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) fetchOrder();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${order.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'Admin', message: chatInput })
      });
      if (res.ok) {
        setChatInput('');
        fetchOrder();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading order details...</div>;
  if (!order) return <div style={{ padding: '40px' }}>Order not found.</div>;

  return (
    <>
      <TopBar breadcrumb="Operations / Logistics Tracker / Order Details" />
      
      <div style={{ padding: "32px", maxWidth: "1200px" }}>
        
        <button 
          onClick={() => navigate('/admin/logistics')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '20px', fontWeight: 600 }}
        >
          <ArrowLeft size={18} /> Back to Logistics Tracker
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>Order {order.id}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: '15px' }}>
              <strong>Vendor:</strong> {order.vendorName} &nbsp;|&nbsp; <strong>Customer:</strong> {order.customerName}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', fontWeight: 700, marginBottom: '5px' }}>Current Status</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: order.status === 'Delivered' ? '#2e7d32' : 'var(--red-core)' }}>{order.status === 'Reached Customer' && order.podStatus === 'Accepted' ? 'Delivered' : order.status}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          
          {/* Left Column: Tracking Pipeline */}
          <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid var(--border-light)", padding: "32px" }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '30px' }}>Tracking Pipeline</h3>
            
            <div style={{ position: 'relative', paddingLeft: '30px', borderLeft: '2px solid #eaeaea', marginBottom: '30px' }}>
              {order.tracking.map((stage, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: '40px' }}>
                  <div style={{
                    position: 'absolute', left: '-39px', top: '0', width: '18px', height: '18px',
                    borderRadius: '50%', background: stage.completed ? 'var(--red-core)' : '#eaeaea',
                    border: '4px solid #fff'
                  }}></div>
                  <div style={{ fontWeight: stage.completed ? '700' : '500', color: stage.completed ? '#111' : '#888', fontSize: '16px' }}>
                    {stage.stage}
                  </div>
                  {stage.timestamp && (
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                      {format(new Date(stage.timestamp), 'MMM d, yyyy h:mm a')}
                    </div>
                  )}
                  {stage.proofImages && stage.proofImages.length > 0 && (
                    <button 
                      onClick={() => setLightboxImages(stage.proofImages)}
                      className="btn-outline"
                      style={{ marginTop: '12px', fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--red-core)', borderColor: 'var(--red-core)' }}
                    >
                      <ImageIcon size={14} /> View {stage.proofImages.length} Proof Image{stage.proofImages.length > 1 ? 's' : ''}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* POD Review Section */}
            <div style={{ background: '#f9f9f9', padding: '24px', borderRadius: '8px', border: '1px solid #eee' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '15px' }}>Proof of Delivery (POD)</h4>
              
              {order.podStatus === 'Under Review' ? (
                <div>
                  <div style={{ color: '#e65100', fontSize: '14px', fontWeight: 600, marginBottom: '15px' }}>
                    Vendor uploaded POD. Awaiting your review.
                  </div>
                  {order.podImage && (
                    <button 
                      onClick={() => setLightboxImages([order.podImage])}
                      className="btn-outline" style={{ marginBottom: '15px', color: '#e65100', borderColor: '#e65100' }}
                    >
                      <ImageIcon size={14} style={{ display: 'inline', marginRight: '6px' }} /> View POD Image
                    </button>
                  )}
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button className="btn btn-primary" style={{ flex: 1, background: '#2e7d32' }} onClick={() => handleReviewPOD('accept')}>Accept Delivery</button>
                    <button className="btn btn-outline" style={{ flex: 1, color: 'var(--red-core)', borderColor: 'var(--red-core)' }} onClick={() => handleReviewPOD('reject')}>Reject</button>
                  </div>
                </div>
              ) : order.podStatus === 'Accepted' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2e7d32', fontSize: '15px', fontWeight: 'bold' }}>
                  <CheckCircle size={20} /> POD Accepted & Delivery Confirmed
                </div>
              ) : order.podStatus === 'Rejected' ? (
                <div style={{ color: 'var(--red-core)', fontSize: '14px', fontWeight: 600 }}>
                  You rejected the POD. Waiting for vendor to re-upload.
                </div>
              ) : (
                <div style={{ color: '#888', fontSize: '14px' }}>
                  Waiting for vendor to complete delivery and upload POD.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Chat */}
          <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid var(--border-light)", display: 'flex', flexDirection: 'column', height: '600px' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Vendor Chat</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Communicate with the vendor specifically regarding this order's logistics.</p>
            </div>
            
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', background: '#fafafa' }}>
              {(order.chatHistory || []).map((chat, i) => (
                <div key={i} style={{ 
                  alignSelf: chat.sender === 'Admin' ? 'flex-end' : 'flex-start',
                  background: chat.sender === 'Admin' ? 'var(--red-core)' : '#fff',
                  color: chat.sender === 'Admin' ? '#fff' : '#111',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  maxWidth: '85%',
                  boxShadow: chat.sender === 'Admin' ? 'none' : '0 2px 5px rgba(0,0,0,0.05)',
                  border: chat.sender === 'Admin' ? 'none' : '1px solid #eee'
                }}>
                  <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '4px' }}>{chat.sender} • {format(new Date(chat.timestamp), 'MMM d, h:mm a')}</div>
                  <div style={{ fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{chat.message}</div>
                </div>
              ))}
              {(!order.chatHistory || order.chatHistory.length === 0) && (
                <div style={{ textAlign: "center", color: "#999", fontSize: "14px", marginTop: "40px" }}>
                  No messages yet. Start a conversation with the vendor.
                </div>
              )}
            </div>

            <div style={{ padding: '20px', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Type a message..." 
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                  style={{ flex: 1 }}
                />
                <button className="btn btn-primary" onClick={handleSendChat}>
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {lightboxImages.length > 0 && (
        <ImageLightbox 
          images={lightboxImages} 
          onClose={() => setLightboxImages([])} 
        />
      )}
    </>
  );
}
