import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { buildApiUrl } from '../../config/api';

export default function VendorChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "How to respond to RFQs?",
    "Check pending invoices status",
    "Where is the GRN & Receipts page?",
    "How can I view my performance score?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(buildApiUrl('/api/vendor/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { sender: 'ai', text: `Error: ${data.error}` }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I couldn't connect to the server." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div 
      style={{ 
        position: 'fixed', 
        bottom: '30px', 
        right: '30px', 
        zIndex: 999999
      }}
    >
      <button 
        className="vendor-chat-bubble"
        onClick={() => setIsOpen(true)}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <MessageSquare size={24} color="#fff" />
      </button>
      
      <div className={`vendor-chat-panel ${isOpen ? 'open' : ''}`}>
        <div className="vendor-chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={20} color="#fff" />
            <span style={{ fontWeight: '600', color: '#fff', fontSize: '15px' }}>Vendor Assist</span>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>
        
        <div className="vendor-chat-messages">
          {messages.length === 0 && (
            <div className="vendor-chat-welcome">
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#555', textAlign: 'center', lineHeight: '1.5' }}>
                Welcome to Aadishakti Vendor Partner AI! How can I assist you with your portal today?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {suggestedQuestions.map((q) => (
                  <button key={q} className="vendor-chat-suggest-btn" onClick={() => handleSend(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`vendor-chat-message ${m.sender}`}>
              <ReactMarkdown>{m.text}</ReactMarkdown>
            </div>
          ))}
          {isTyping && (
            <div className="vendor-chat-message ai typing">
              <span></span><span></span><span></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="vendor-chat-input-area">
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          />
          <button onClick={() => handleSend(input)} disabled={!input.trim() || isTyping}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
