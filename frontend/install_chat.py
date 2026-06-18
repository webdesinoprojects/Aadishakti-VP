import os
import json

backend_dir = r"c:\Users\asnoi\Downloads\Aadishakti-VP\backend"
frontend_src_dir = r"c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src"

# 1. Update backend/.env
env_path = os.path.join(backend_dir, ".env")
with open(env_path, "a", encoding="utf-8") as f:
    f.write("\nGEMINI_API_KEY=your_api_key_here\n")

# 2. Update backend/server.js
server_path = os.path.join(backend_dir, "server.js")
with open(server_path, "r", encoding="utf-8") as f:
    server_content = f.read()

chat_endpoint = """
// --- AI Chat Assistant Endpoint ---
app.post("/api/vendor/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_api_key_here") {
      return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }

    const dataPath = path.join(__dirname, "data", "vendor.json");
    let vendorData = {};
    try {
      const dataContent = await fs.readFile(dataPath, "utf-8");
      vendorData = JSON.parse(dataContent);
    } catch (e) {
      console.warn("Could not read vendor.json for AI context");
    }

    const systemPrompt = `You are Aadishakti's vendor assistant.
Only answer questions related to this vendor's portal: RFQs, purchase orders, invoices, payments, GRN, documents, registration and general vendor processes.
Do not answer anything unrelated to vendor operations.

Here is the current vendor's data for context:
${JSON.stringify(vendorData, null, 2)}
`;

    const requestBody = {
      system_instruction: {
        parts: { text: systemPrompt }
      },
      contents: [
        {
          role: "user",
          parts: [{ text: message }]
        }
      ]
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error:", errText);
      throw new Error(`Gemini API Error: ${response.status}`);
    }

    const result = await response.json();
    const replyText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I could not generate a response.";

    res.json({ reply: replyText });
  } catch (error) {
    console.error("Error in /api/vendor/chat:", error);
    res.status(500).json({ error: "Failed to communicate with AI assistant." });
  }
});

// Health check endpoint"""

if "/api/vendor/chat" not in server_content:
    server_content = server_content.replace("// Health check endpoint", chat_endpoint)
    with open(server_path, "w", encoding="utf-8") as f:
        f.write(server_content)

# 3. Create VendorChatBubble.jsx
chat_bubble_path = os.path.join(frontend_src_dir, "vendor", "components", "VendorChatBubble.jsx")
chat_bubble_content = """import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

export default function VendorChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "What are my active RFQs?",
    "Show my pending invoices",
    "When is my next delivery?",
    "How do I submit a quotation?"
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
      const res = await fetch('http://localhost:5000/api/vendor/chat', {
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
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I couldn't connect to the server." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
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
            <span style={{ fontWeight: '600', color: '#fff', fontSize: '15px' }}>Ask Aadishakti</span>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <div className="vendor-chat-messages">
          {messages.length === 0 && (
            <div className="vendor-chat-welcome">
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#555', textAlign: 'center', lineHeight: '1.5' }}>
                Hi! I'm your AI assistant. How can I help with your vendor operations today?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {suggestedQuestions.map((q, i) => (
                  <button key={i} className="vendor-chat-suggest-btn" onClick={() => handleSend(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`vendor-chat-message ${m.sender}`}>
              {m.text}
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
    </>
  );
}
"""
with open(chat_bubble_path, "w", encoding="utf-8") as f:
    f.write(chat_bubble_content)

# 4. Update vendor.css
css_path = os.path.join(frontend_src_dir, "vendor", "vendor.css")
with open(css_path, "r", encoding="utf-8") as f:
    css_content = f.read()

chat_css = """
/* Vendor AI Chat */
.vendor-chat-bubble {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--red-core);
  border: none;
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  transition: transform 0.2s, box-shadow 0.2s;
}
.vendor-chat-bubble:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(211, 47, 47, 0.5);
}

.vendor-chat-panel {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 350px;
  height: 500px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translateY(20px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #eee;
}
.vendor-chat-panel.open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.vendor-chat-header {
  background: var(--bg-dark-card);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vendor-chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f9f9f9;
}

.vendor-chat-message {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}
.vendor-chat-message.user {
  align-self: flex-end;
  background: var(--red-core);
  color: #fff;
  border-bottom-right-radius: 2px;
}
.vendor-chat-message.ai {
  align-self: flex-start;
  background: #fff;
  color: #333;
  border: 1px solid #eaeaea;
  border-bottom-left-radius: 2px;
}

.vendor-chat-suggest-btn {
  background: #fff;
  border: 1px solid #ddd;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 13px;
  color: var(--red-core);
  cursor: pointer;
  transition: background 0.2s;
  text-align: left;
}
.vendor-chat-suggest-btn:hover {
  background: #f1f1f1;
}

.vendor-chat-input-area {
  padding: 16px;
  background: #fff;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}
.vendor-chat-input-area input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s;
}
.vendor-chat-input-area input:focus {
  border-color: var(--red-core);
}
.vendor-chat-input-area button {
  background: var(--red-core);
  color: #fff;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}
.vendor-chat-input-area button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.vendor-chat-input-area button:not(:disabled):hover {
  background: var(--red-bright);
}

.vendor-chat-message.typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 14px 18px;
}
.vendor-chat-message.typing span {
  width: 6px;
  height: 6px;
  background-color: #999;
  border-radius: 50%;
  animation: vendor-typing 1.4s infinite ease-in-out both;
}
.vendor-chat-message.typing span:nth-child(1) { animation-delay: -0.32s; }
.vendor-chat-message.typing span:nth-child(2) { animation-delay: -0.16s; }
@keyframes vendor-typing {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
"""
if ".vendor-chat-bubble" not in css_content:
    css_content += chat_css
    with open(css_path, "w", encoding="utf-8") as f:
        f.write(css_content)

# 5. Update VendorApp.jsx
app_path = os.path.join(frontend_src_dir, "vendor", "VendorApp.jsx")
with open(app_path, "r", encoding="utf-8") as f:
    app_content = f.read()

if "VendorChatBubble" not in app_content:
    app_content = app_content.replace(
        "import VendorSidebar from './components/VendorSidebar';",
        "import VendorSidebar from './components/VendorSidebar';\nimport VendorChatBubble from './components/VendorChatBubble';"
    )
    
    app_content = app_content.replace(
        "</div>\n    </ProtectedVendorRoute>",
        "  <VendorChatBubble />\n      </div>\n    </ProtectedVendorRoute>"
    )
    with open(app_path, "w", encoding="utf-8") as f:
        f.write(app_content)

print("Installation Complete!")
