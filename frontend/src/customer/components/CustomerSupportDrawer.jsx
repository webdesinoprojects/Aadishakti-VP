import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { CustomerWorkflowDrawer } from './CustomerWorkflowPrimitives';
import { formatWorkflowDate, titleize, workflowStatusClass } from '../utils/customerWorkflowFormatters';

export default function CustomerSupportDrawer({ ticket, busy, onClose, onReply }) {
  const [message, setMessage] = useState('');
  const messages = useMemo(() => [...(ticket?.messages || [])].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)), [ticket]);
  const closed = ticket?.status === 'closed';
  useEffect(() => setMessage(''), [ticket?.id]);
  const submit = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    const sent = await onReply(ticket, message.trim());
    if (sent) setMessage('');
  };

  return <CustomerWorkflowDrawer open={Boolean(ticket)} onClose={onClose} eyebrow="Support conversation" title={ticket?.subject} subtitle={ticket?.ticket_reference} footer={ticket && <form className="customer-support-reply" onSubmit={submit}><textarea rows="3" required disabled={busy || closed} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={closed ? 'This ticket is closed.' : 'Write a reply to Aadishakti support...'} /><button type="submit" disabled={busy || closed || !message.trim()}><Send size={17} />{busy ? 'Sending…' : 'Send reply'}</button></form>}>
    {ticket && <>
      <dl className="customer-workflow-meta">
        <div><dt>Category</dt><dd>{titleize(ticket.category)}</dd></div><div><dt>Priority</dt><dd>{titleize(ticket.priority)}</dd></div>
        <div><dt>Status</dt><dd><span className={workflowStatusClass(ticket.status)}>{titleize(ticket.status)}</span></dd></div><div><dt>Opened</dt><dd>{formatWorkflowDate(ticket.created_at, true)}</dd></div>
      </dl>
      <section className="customer-support-thread"><div className="customer-support-thread-heading"><div><strong>Conversation</strong><span>{messages.length} message{messages.length === 1 ? '' : 's'}</span></div><MessageCircle size={19} /></div>
        {messages.map((item) => <article key={item.id} className={`customer-support-message is-${item.sender_type}`}><div><strong>{item.sender_type === 'admin' ? 'Aadishakti support' : 'You'}</strong><time>{formatWorkflowDate(item.created_at, true)}</time></div><p>{item.message}</p></article>)}
        {!messages.length && <p className="customer-support-no-message">No messages found in this ticket.</p>}
      </section>
    </>}
  </CustomerWorkflowDrawer>;
}
