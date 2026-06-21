import { X, CheckCircle, Upload, ArrowRight, FileText, Send, Image as ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { format } from 'date-fns';
import ImageLightbox from '../../components/ImageLightbox';

export default function PurchaseOrderDrawer({ isOpen, onClose, order, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [lightboxImages, setLightboxImages] = useState([]);
  const fileInputRef = useRef(null);
  const podInputRef = useRef(null);

  if (!order) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const currentStageIndex = order.tracking.findIndex(t => !t.completed);
  const currentStage = currentStageIndex !== -1 ? order.tracking[currentStageIndex] : null;

  const handleUpdateStage = async (stageName, e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In real app, upload files to S3. Here we mock multiple URLs.
    const mockImages = Array.from(files).map((f, i) => `/uploads/mock-proof${i+1}.jpg`);

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${order.id}/update-stage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: stageName, proofImages: mockImages })
      });
      if (res.ok) onUpdate();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPOD = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${order.id}/pod`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ podImage: '/uploads/mock-pod.jpg' }) // Mock POD url
      });
      if (res.ok) onUpdate();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${order.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'Vendor', message: chatInput })
      });
      if (res.ok) {
        setChatInput('');
        onUpdate();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={`vendor-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={handleOverlayClick} style={{ zIndex: 900 }}>
      <div className="vendor-drawer" style={{ width: '800px', maxWidth: '90vw' }} onClick={(e) => e.stopPropagation()}>
        <div className="vendor-drawer-header">
          <div>
            <div className="vendor-drawer-title">Order {order.id}</div>
            <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#666' }}>
              <span>{order.customerName}</span>
              <span>•</span>
              <span>₹ {order.amount}</span>
            </div>
          </div>
          <button className="vendor-drawer-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="vendor-drawer-body" style={{ overflowY: 'auto', padding: '24px', display: 'flex', gap: '40px' }}>
          
          {/* Left: Tracking Pipeline */}
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Tracking Pipeline</h3>
            
            <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '2px solid #eaeaea', marginBottom: '40px' }}>
              {order.tracking.map((stage, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: '30px' }}>
                  <div style={{
                    position: 'absolute', left: '-29px', top: '0', width: '16px', height: '16px',
                    borderRadius: '50%', background: stage.completed ? 'var(--red-core)' : '#eaeaea',
                    border: '3px solid #fff'
                  }}></div>
                  <div style={{ fontWeight: stage.completed ? '700' : '500', color: stage.completed ? '#111' : '#888' }}>
                    {stage.stage}
                  </div>
                  {stage.timestamp && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      {format(new Date(stage.timestamp), 'MMM d, yyyy h:mm a')}
                    </div>
                  )}
                  {stage.proofImages && stage.proofImages.length > 0 && (
                    <button 
                      onClick={() => setLightboxImages(stage.proofImages)}
                      className="btn-outline"
                      style={{ marginTop: '8px', fontSize: '12px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <ImageIcon size={12} /> View {stage.proofImages.length} Proof{stage.proofImages.length > 1 ? 's' : ''}
                    </button>
                  )}
                  
                  {/* Active Action Button */}
                  {!stage.completed && currentStage?.stage === stage.stage && (
                    <div style={{ marginTop: '15px', background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px dashed #ccc' }}>
                      <p style={{ fontSize: '13px', margin: '0 0 10px 0', color: '#444' }}>Please upload proof for <strong>{stage.stage}</strong></p>
                      <input type="file" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => handleUpdateStage(stage.stage, e)} />
                      <button 
                        className="btn-solid-red" 
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                        onClick={() => fileInputRef.current.click()}
                        disabled={loading}
                      >
                        <Upload size={14} style={{ marginRight: '6px' }} /> Upload Photos & Confirm
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Proof of Delivery Section */}
            <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>Proof of Delivery (POD)</h3>
              <div style={{ fontSize: '13px', marginBottom: '15px' }}>
                Status: <strong style={{ 
                  color: order.podStatus === 'Accepted' ? 'green' : 
                         order.podStatus === 'Rejected' ? 'red' : 
                         order.podStatus === 'Under Review' ? 'orange' : '#666' 
                }}>{order.podStatus}</strong>
              </div>
              
              {order.podStatus === 'Awaited' || order.podStatus === 'Rejected' ? (
                <div>
                  {order.podStatus === 'Rejected' && <p style={{ color: 'red', fontSize: '13px' }}>Admin rejected previous POD. Please re-upload.</p>}
                  <input type="file" ref={podInputRef} style={{ display: 'none' }} onChange={handleUploadPOD} />
                  <button 
                    className="btn-solid-red" 
                    onClick={() => podInputRef.current.click()}
                    disabled={loading || order.tracking[order.tracking.length-2].completed === false}
                  >
                    <Upload size={16} style={{ marginRight: '6px' }} /> Upload POD
                  </button>
                </div>
              ) : order.podStatus === 'Under Review' ? (
                <p style={{ color: 'orange', fontSize: '13px', margin: 0 }}>POD is currently under review by Admin.</p>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'green', fontSize: '14px', fontWeight: 'bold' }}>
                  <CheckCircle size={18} /> Delivery Confirmed
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Chat */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderLeft: '1px solid #eee', paddingLeft: '40px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>Order Logistics Chat</h3>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>Chat with Admin about delivery, proof, or delays.</p>
            
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {(order.chatHistory || []).map((chat, i) => (
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
              {(!order.chatHistory || order.chatHistory.length === 0) && (
                <div style={{ textAlign: "center", color: "#888", fontSize: "13px", padding: "20px 0" }}>
                  No messages yet. Send a message to Admin.
                </div>
              )}
            </div>

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
              <button className="btn-solid-red" style={{ padding: '0 16px' }} onClick={handleSendChat}>
                <Send size={16} />
              </button>
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
    </div>
  );
}
