import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, CheckCircle2, FileCheck2, Image, MessageSquare, Send, Truck, X } from 'lucide-react';
import VendorLogisticsFileField from './VendorLogisticsFileField';

const dateTime = (value) => value
  ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  : '';

export default function VendorLogisticsDrawer({ order, busy, notice, onClose, onStage, onPod, onMessage, onClearNotice }) {
  const [tab, setTab] = useState('tracking');
  const [stage, setStage] = useState('');
  const [stageFiles, setStageFiles] = useState([]);
  const [podFiles, setPodFiles] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messageLockRef = useRef(false);
  const messagesRef = useRef(null);
  const pendingStages = useMemo(() => (order?.tracking || []).filter((item) => !item.completed), [order]);

  useEffect(() => {
    setStage((current) => pendingStages.some((item) => item.stage === current) ? current : (pendingStages[0]?.stage || ''));
  }, [pendingStages]);

  useEffect(() => {
    if (tab === 'chat') messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight });
  }, [order?.chat_history, tab]);

  useEffect(() => {
    setTab('tracking');
    setStageFiles([]);
    setPodFiles([]);
    setChatInput('');
  }, [order?.id]);

  if (!order) return null;
  const messages = order.chat_history || [];
  const delivered = order.pod_status === 'Accepted' || order.status === 'Delivered';

  const submitStage = async (event) => {
    event.preventDefault();
    if (!stage) return;
    const formData = new FormData();
    formData.append('stage', stage);
    stageFiles.forEach((file) => formData.append('proofs', file));
    if (await onStage(formData)) setStageFiles([]);
  };

  const submitPod = async (event) => {
    event.preventDefault();
    if (!podFiles[0]) return onClearNotice('Select a proof-of-delivery file first.', 'error');
    const formData = new FormData();
    formData.append('document', podFiles[0]);
    if (await onPod(formData)) setPodFiles([]);
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const message = chatInput.trim();
    if (!message || messageLockRef.current) return;
    messageLockRef.current = true;
    setSendingMessage(true);
    setChatInput('');
    const sent = await onMessage(message);
    if (!sent) setChatInput(message);
    messageLockRef.current = false;
    setSendingMessage(false);
  };

  return <div className="vendor-drawer-overlay open" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <aside className="vendor-drawer vendor-logistics-drawer" aria-label={`Manage logistics order ${order.id}`}>
      <header className="vendor-logistics-drawer-header">
        <span className="vendor-logistics-eyebrow">Logistics order</span>
        <h2>{order.id}</h2>
        <p>{order.customer_name} <span>·</span> {order.product}</p>
        <span className={`vendor-logistics-status${delivered ? ' is-complete' : ''}`}>{delivered ? 'Delivered' : order.status}</span>
        <button type="button" className="vendor-logistics-close" onClick={onClose} aria-label="Close logistics order"><X size={22} /></button>
      </header>

      <div className="vendor-logistics-tabs" role="tablist">
        <button type="button" className={tab === 'tracking' ? 'is-active' : ''} onClick={() => setTab('tracking')}><Truck size={17} /> Tracking & POD</button>
        <button type="button" className={tab === 'chat' ? 'is-active' : ''} onClick={() => setTab('chat')}><MessageSquare size={17} /> Order chat {messages.length > 0 && <span>{messages.length}</span>}</button>
      </div>

      {notice && <div className={`vendor-logistics-notice is-${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}><span>{notice.text}</span><button type="button" onClick={() => onClearNotice(null)} aria-label="Dismiss">×</button></div>}

      {tab === 'tracking' ? <div className="vendor-logistics-scroll">
        <section className="vendor-logistics-card">
          <div className="vendor-logistics-card-heading"><div className="vendor-logistics-card-icon"><Truck size={20} /></div><div><h3>Tracking progress</h3><p>Complete each stage as the order moves.</p></div></div>
          <div className="vendor-logistics-timeline">
            {(order.tracking || []).map((item, index) => <div className={`vendor-logistics-stage${item.completed ? ' is-complete' : ''}`} key={item.stage}>
              <div className="vendor-logistics-stage-marker">{item.completed ? <Check size={14} /> : index + 1}</div>
              <div className="vendor-logistics-stage-content"><strong>{item.stage}</strong><small>{item.completed ? `Completed ${dateTime(item.timestamp)}` : 'Pending'}</small>
                {item.proofImages?.length > 0 && <div className="vendor-logistics-proof-links">{item.proofImages.map((url, proofIndex) => <a href={url} target="_blank" rel="noreferrer" key={url}><Image size={14} /> Proof {proofIndex + 1}</a>)}</div>}
              </div>
            </div>)}
          </div>
        </section>

        {!delivered && pendingStages.length > 0 && <form className="vendor-logistics-card vendor-logistics-form" onSubmit={submitStage}>
          <div className="vendor-logistics-card-heading"><div className="vendor-logistics-card-icon"><CheckCircle2 size={20} /></div><div><h3>Update shipment stage</h3><p>Add supporting proof when available.</p></div></div>
          <label>Next stage<select value={stage} onChange={(event) => setStage(event.target.value)} required>{pendingStages.map((item) => <option key={item.stage}>{item.stage}</option>)}</select></label>
          <VendorLogisticsFileField files={stageFiles} onChange={setStageFiles} onError={(text) => onClearNotice(text, 'error')} multiple disabled={busy} label="Drop stage proof here" hint="or click to browse · up to 3 files" />
          <button className="vendor-logistics-primary" disabled={busy || !stage}>{busy ? 'Saving…' : 'Save stage update'}</button>
        </form>}

        {!delivered && <form className="vendor-logistics-card vendor-logistics-form" onSubmit={submitPod}>
          <div className="vendor-logistics-card-heading"><div className="vendor-logistics-card-icon"><FileCheck2 size={20} /></div><div><h3>Proof of delivery</h3><p>Submit after the shipment reaches the customer.</p></div></div>
          {order.pod_status && order.pod_status !== 'Not Submitted' && <div className={`vendor-logistics-pod-status is-${order.pod_status.toLowerCase().replaceAll(' ', '-')}`}>POD status: <strong>{order.pod_status}</strong></div>}
          <VendorLogisticsFileField files={podFiles} onChange={setPodFiles} onError={(text) => onClearNotice(text, 'error')} disabled={busy} label="Drop proof of delivery here" hint="or click to browse · image or PDF · max 10 MB" />
          <button className="vendor-logistics-primary" disabled={busy || !podFiles.length}>{busy ? 'Submitting…' : order.pod_status === 'Rejected' ? 'Resubmit POD' : 'Submit POD for review'}</button>
        </form>}
      </div> : <div className="vendor-logistics-chat">
        <div className="vendor-logistics-chat-intro"><MessageSquare size={20} /><div><h3>Chat with Aadishakti</h3><p>Messages here are linked only to this logistics order.</p></div></div>
        <div className="vendor-logistics-messages" ref={messagesRef}>
          {messages.length ? messages.map((chat, index) => <div className={`vendor-logistics-message${chat.sender === 'Vendor' ? ' is-vendor' : ''}`} key={`${chat.timestamp}-${index}`}>
            <small>{chat.sender} · {dateTime(chat.timestamp)}</small><p>{chat.message}</p>
          </div>) : <div className="vendor-logistics-chat-empty"><MessageSquare size={30} /><strong>No messages yet</strong><span>Send a message to the Aadishakti admin about this order.</span></div>}
        </div>
        <form className="vendor-logistics-composer" onSubmit={sendMessage}>
          <textarea value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Type a message about this order…" rows="2" onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(event); } }} />
          <button type="submit" disabled={busy || sendingMessage || !chatInput.trim()} aria-label="Send message"><Send size={19} /></button>
        </form>
      </div>}
    </aside>
  </div>;
}
