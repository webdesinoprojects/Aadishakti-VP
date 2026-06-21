import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Download, Trash2, Mail, RefreshCw, X } from 'lucide-react';
import { format } from 'date-fns';
import TopBar from '../../components/TopBar';
import ConfirmModal from '../../components/ConfirmModal';
import { crmAPI } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import '../../admin.css';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'General', 'Alloy'
  const [search, setSearch] = useState('');
  const { success, error } = useToast();
  const [vendors, setVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [chatInput, setChatInput] = useState('');


  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const [response, vendorRes] = await Promise.all([
        crmAPI.getEnquiries({}),
        crmAPI.getVendors().then(r => r.data || []).catch(() => [])
      ]);
      setVendors(vendorRes);
      // Sort newest first
      const sorted = response.data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      setMessages(sorted);
    } catch (err) {
      console.error('Error loading messages:', err);
      error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const filteredMessages = useMemo(() => {
    let filtered = messages;
    
    // Filter by Tab
    if (activeTab === 'General') {
      filtered = filtered.filter(m => m.inquiryType !== 'Custom Alloy Quote');
    } else if (activeTab === 'Alloy') {
      filtered = filtered.filter(m => m.inquiryType === 'Custom Alloy Quote');
    }

    // Filter by Search
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(m => 
        m.fullName?.toLowerCase().includes(q) || 
        m.companyName?.toLowerCase().includes(q) || 
        m.workEmail?.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [messages, activeTab, search]);

  const selectedMessage = messages.find(m => m.id === selectedMessageId);

  const handleAssign = async () => {
    if (!selectedVendorId) return;
    const vendor = vendors.find(v => v.id === selectedVendorId);
    try {
      const res = await crmAPI.assignVendor(selectedMessage.id, { vendorId: vendor.id, vendorName: vendor.name });
      setMessages(prev => prev.map(m => m.id === selectedMessage.id ? { ...m, assignedVendorId: vendor.id, assignedVendorName: vendor.name } : m));
      success('Enquiry assigned to ' + vendor.name);
    } catch (err) {
      error('Failed to assign vendor');
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    try {
      const res = await crmAPI.addChatMessage(selectedMessage.id, { sender: 'Admin', message: chatInput });
      const newHistory = res.data?.chatHistory || [];
      setMessages(prev => prev.map(m => m.id === selectedMessage.id ? { ...m, chatHistory: newHistory } : m));
      setChatInput('');
    } catch (err) {
      error('Failed to send message');
    }
  };


  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await crmAPI.deleteEnquiry(deleteModal.id);
      setMessages(prev => prev.filter(m => m.id !== deleteModal.id));
      success('Message deleted');
      setDeleteModal(null);
      if (selectedMessageId === deleteModal.id) {
        setSelectedMessageId(null);
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      error('Failed to delete message');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await crmAPI.updateEnquiry(id, { status: newStatus });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
      success(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating status:', err);
      error('Failed to update status');
    }
  };

  // Helper to parse Custom Alloy Spec JSON from additionalDetails string
  const renderMessageBody = (msg) => {
    if (msg.inquiryType === 'Custom Alloy Quote' && msg.additionalDetails.includes('Custom Specification Request:')) {
      try {
        const match = msg.additionalDetails.match(/Custom Specification Request:\n([\s\S]+?)\n\nNotes: ([\s\S]*)/);
        if (match) {
          const specs = JSON.parse(match[1]);
          const notes = match[2];
          return (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "12px", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>Requested Metallurgical Specs</h4>
                <div style={{ background: "var(--bg-secondary)", borderRadius: "6px", border: "1px solid var(--border-light)", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <tbody>
                      {Object.entries(specs).map(([key, val]) => (
                        <tr key={key} style={{ borderBottom: "1px solid var(--border-light)" }}>
                          <td style={{ padding: "10px 16px", fontWeight: 600, width: "200px", textTransform: "capitalize" }}>{key}</td>
                          <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)" }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Additional Notes</h4>
                <p style={{ whiteSpace: "pre-wrap", color: "var(--text-primary)", lineHeight: 1.6 }}>{notes || "None"}</p>
              </div>
            </div>
          );
        }
      } catch (e) {
        // Fallback to plain text
      }
    }
    
    return <p style={{ whiteSpace: "pre-wrap", color: "var(--text-primary)", lineHeight: 1.6 }}>{msg.additionalDetails}</p>;
  };

  return (
    <>
      <TopBar breadcrumb="CRM / Contact Inbox" />
      
      <div style={{ display: "flex", height: "calc(100vh - 70px)", background: "#FFFFFF" }}>
        
        {/* LEFT COLUMN: Message List */}
        <div style={{ width: "380px", borderRight: "1px solid var(--border-light)", display: "flex", flexDirection: "column" }}>
          
          <div style={{ padding: "20px", borderBottom: "1px solid var(--border-light)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800 }}>Inbox</h2>
              <button onClick={loadMessages} className="btn-icon" title="Refresh">
                <RefreshCw size={16} className={loading ? "spin" : ""} />
              </button>
            </div>

            <div style={{ position: 'relative', marginBottom: "16px" }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search name, email, company..." 
                className="form-input"
                style={{ paddingLeft: "36px", height: "36px", fontSize: "13px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "8px", background: "var(--bg-secondary)", padding: "4px", borderRadius: "6px" }}>
              {['All', 'General', 'Alloy'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{ 
                    flex: 1, 
                    padding: "6px 0", 
                    fontSize: "12px", 
                    fontWeight: 600,
                    borderRadius: "4px",
                    background: activeTab === tab ? "#FFFFFF" : "transparent",
                    boxShadow: activeTab === tab ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    color: activeTab === tab ? "var(--text-primary)" : "var(--text-muted)",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", background: "var(--bg-secondary)" }}>
            {filteredMessages.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                No messages found.
              </div>
            ) : (
              filteredMessages.map(msg => (
                <div 
                  key={msg.id}
                  onClick={() => setSelectedMessageId(msg.id)}
                  style={{ 
                    padding: "16px 20px", 
                    borderBottom: "1px solid var(--border-light)",
                    background: selectedMessageId === msg.id ? "#FFFFFF" : "transparent",
                    borderLeft: selectedMessageId === msg.id ? "3px solid var(--red-core)" : "3px solid transparent",
                    cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>{msg.fullName}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{format(new Date(msg.submittedAt), 'MMM d')}</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px", fontWeight: 500 }}>
                    {msg.inquiryType} {msg.companyName ? `• ${msg.companyName}` : ''}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ 
                      fontSize: "10px", 
                      padding: "2px 8px", 
                      borderRadius: "12px", 
                      fontWeight: 600,
                      background: msg.status === 'New' ? "rgba(204,34,0,0.1)" : "rgba(0,0,0,0.05)",
                      color: msg.status === 'New' ? "var(--red-core)" : "var(--text-secondary)"
                    }}>
                      {msg.status || 'New'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Message Details */}
        <div style={{ flex: 1, overflowY: "auto", background: "#FFFFFF", display: "flex", flexDirection: "column" }}>
          {selectedMessage ? (
            <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%", padding: "40px" }}>
              
              {/* Header Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", borderBottom: "1px solid var(--border-light)", paddingBottom: "24px" }}>
                <div>
                  <h1 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "8px" }}>{selectedMessage.inquiryType}</h1>
                  <div style={{ display: "flex", gap: "16px", color: "var(--text-muted)", fontSize: "13px" }}>
                    <span>{format(new Date(selectedMessage.submittedAt), 'MMMM d, yyyy h:mm a')}</span>
                    <span>•</span>
                    <span>Status: <strong>{selectedMessage.status || 'New'}</strong></span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <select 
                    className="form-input" 
                    style={{ padding: "6px 12px", height: "auto", fontSize: "13px", width: "auto" }}
                    value={selectedMessage.status || 'New'}
                    onChange={(e) => updateStatus(selectedMessage.id, e.target.value)}
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Replied">Replied</option>
                    <option value="Archived">Archived</option>
                  </select>
                  <button 
                    onClick={() => setDeleteModal(selectedMessage)} 
                    className="btn-icon" 
                    style={{ color: "var(--red-core)", border: "1px solid var(--border-light)" }}
                    title="Delete Message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Sender Info Card */}
              <div style={{ background: "var(--bg-secondary)", padding: "20px", borderRadius: "8px", marginBottom: "32px", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <div style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>Sender Name</div>
                    <div style={{ fontWeight: 600 }}>{selectedMessage.fullName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>Company</div>
                    <div style={{ fontWeight: 600 }}>{selectedMessage.companyName || '-'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>Email</div>
                    <div><a href={`mailto:${selectedMessage.workEmail}`} style={{ color: "var(--red-core)" }}>{selectedMessage.workEmail}</a></div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>Phone</div>
                    <div><a href={`tel:${selectedMessage.phone}`} style={{ color: "var(--text-primary)" }}>{selectedMessage.phone || '-'}</a></div>
                  </div>
                  {selectedMessage.estimatedQuantity && (
                    <div>
                      <div style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>Quantity Required</div>
                      <div style={{ fontWeight: 700 }}>{selectedMessage.estimatedQuantity}</div>
                    </div>
                  )}
                  {selectedMessage.country && (
                    <div>
                      <div style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>Location</div>
                      <div>{selectedMessage.country}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div>
                {renderMessageBody(selectedMessage)}
              </div>
              {/* Assignment & Chat Panel */}
              {(selectedMessage.inquiryType === 'Custom Alloy Quote' || selectedMessage.inquiryType === 'Product Inquiry' || selectedMessage.inquiryType === 'Quote') && (
              <div style={{ marginTop: "40px", borderTop: "1px solid var(--border-light)", paddingTop: "32px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "20px" }}>Vendor Assignment</h3>
                
                {!selectedMessage.assignedVendorId ? (
                  <div style={{ background: "var(--bg-secondary)", padding: "20px", borderRadius: "8px", display: "flex", gap: "10px", alignItems: "center" }}>
                    <select 
                      className="form-input" 
                      value={selectedVendorId} 
                      onChange={(e) => setSelectedVendorId(e.target.value)}
                      style={{ flex: 1 }}
                    >
                      <option value="">-- Select Vendor to Assign --</option>
                      {vendors.map(v => (
                        <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
                      ))}
                    </select>
                    <button className="btn btn-primary" onClick={handleAssign} disabled={!selectedVendorId}>
                      Assign Vendor
                    </button>
                  </div>
                ) : (
                  <div style={{ background: "var(--bg-secondary)", padding: "20px", borderRadius: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid var(--border-light)" }}>
                      <span style={{ fontWeight: 600 }}>Assigned to: <span style={{ color: "var(--red-core)" }}>{selectedMessage.assignedVendorName}</span></span>
                    </div>
                    
                    {/* Chat History */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px", maxHeight: "300px", overflowY: "auto" }}>
                      {(selectedMessage.chatHistory || []).map((chat, i) => (
                        <div key={i} style={{ 
                          alignSelf: chat.sender === 'Admin' ? 'flex-end' : 'flex-start',
                          background: chat.sender === 'Admin' ? 'var(--red-core)' : '#fff',
                          color: chat.sender === 'Admin' ? '#fff' : 'var(--text-primary)',
                          border: chat.sender === 'Admin' ? 'none' : '1px solid var(--border-light)',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          maxWidth: '80%'
                        }}>
                          <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '4px' }}>{chat.sender} • {format(new Date(chat.timestamp), 'MMM d, h:mm a')}</div>
                          <div style={{ fontSize: '13px', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>{chat.message}</div>
                        </div>
                      ))}
                      {(!selectedMessage.chatHistory || selectedMessage.chatHistory.length === 0) && (
                        <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "13px", fontStyle: "italic" }}>
                          No messages yet. Send a message to the vendor below.
                        </div>
                      )}
                    </div>
                    
                    {/* Chat Input */}
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Type a message to the vendor..." 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                        style={{ flex: 1 }}
                      />
                      <button className="btn btn-primary" onClick={handleSendChat} disabled={!chatInput.trim()}>Send</button>
                    </div>
                  </div>
                )}
              </div>
              )}


            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)" }}>
              <Mail size={48} style={{ marginBottom: "16px", opacity: 0.2 }} />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>

      </div>

      {deleteModal && (
        <ConfirmModal
          title="Delete Message"
          message={`Are you sure you want to delete this message from ${deleteModal.fullName}? This action cannot be undone.`}
          confirmText="Delete Message"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal(null)}
          type="danger"
        />
      )}
    </>
  );
}
