import { useMemo, useState } from 'react';
import { Clock3, Headphones, MessageCircle, Send, ShieldAlert } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { portalWorkflowsAPI } from '../../utils/api';
import { WorkflowDrawer, WorkflowEmpty, WorkflowMeta, WorkflowStatus, WorkflowSummary, WorkflowTableCard } from './WorkflowPrimitives';
import { formatDate, titleize } from './workflowFormatters';

export default function SupportPanel({ items, onReload }) {
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('in_progress');
  const [busy, setBusy] = useState(false);
  const { success, error } = useToast();
  const messages = useMemo(() => [...(selected?.messages || [])].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)), [selected]);
  const open = (item) => { setSelected(item); setStatus(item.status === 'open' ? 'in_progress' : item.status); setMessage(''); };
  const reply = async (event) => {
    event.preventDefault(); if (!message.trim()) return;
    setBusy(true);
    try { await portalWorkflowsAPI.replySupport(selected.id, { message: message.trim(), status }); success('Reply sent to the partner.'); setMessage(''); setSelected(null); await onReload(); }
    catch (requestError) { error(requestError.response?.data?.error || 'Failed to send support reply.'); }
    finally { setBusy(false); }
  };
  return <>
    <div className="workflow-summary-grid"><WorkflowSummary icon={Headphones} label="Total tickets" value={items.length} /><WorkflowSummary icon={Clock3} label="Open or in progress" value={items.filter((item) => ['open', 'in_progress'].includes(item.status)).length} tone="amber" /><WorkflowSummary icon={ShieldAlert} label="Urgent priority" value={items.filter((item) => item.priority === 'urgent').length} tone="red" /></div>
    <WorkflowTableCard title="Support inbox" description="Open a ticket to read its complete conversation and reply to the partner." count={items.length}><table className="responsive-table workflow-table"><thead><tr><th>Ticket</th><th>Partner</th><th>Subject</th><th>Category</th><th>Priority</th><th>Status</th><th>Messages</th><th>Action</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="workflow-clickable-row" tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && open(item)} onClick={() => open(item)}><td><strong>{item.ticket_reference}</strong><small>{formatDate(item.updated_at, true)}</small></td><td><strong>{item.account?.display_name || 'Unknown partner'}</strong><small>{item.account?.role || 'partner'}</small></td><td>{item.subject}</td><td>{titleize(item.category)}</td><td><span className={`workflow-priority workflow-priority--${item.priority}`}>{item.priority}</span></td><td><WorkflowStatus status={item.status} /></td><td>{item.messages?.length || 0}</td><td><button className="btn btn-secondary workflow-view-button" type="button" onClick={(event) => { event.stopPropagation(); open(item); }}>Open ticket</button></td></tr>)}{!items.length && <tr><td colSpan="8"><WorkflowEmpty title="No support tickets" copy="Customer and vendor support conversations will appear here." /></td></tr>}</tbody></table></WorkflowTableCard>
    <WorkflowDrawer open={Boolean(selected)} onOpenChange={(value) => !value && setSelected(null)} eyebrow="Support conversation" title={selected?.subject} subtitle={selected?.ticket_reference} width="720px" footer={<form className="workflow-support-reply" onSubmit={reply}><textarea rows="3" required disabled={busy || selected?.status === 'closed'} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={selected?.status === 'closed' ? 'This ticket is closed.' : 'Write a helpful reply to the partner...'} /><div><label><span>After reply</span><select value={status} onChange={(event) => setStatus(event.target.value)} disabled={busy}><option value="in_progress">In progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option></select></label><button className="btn btn-primary" disabled={busy || !message.trim() || selected?.status === 'closed'}><Send size={17} /> {busy ? 'Sending...' : 'Send reply'}</button></div></form>}>
      {selected && <><dl className="workflow-document-meta"><WorkflowMeta label="Partner" value={selected.account?.display_name} /><WorkflowMeta label="Role" value={selected.account?.role} /><WorkflowMeta label="Category" value={titleize(selected.category)} /><WorkflowMeta label="Priority" value={titleize(selected.priority)} /><WorkflowMeta label="Status" value={<WorkflowStatus status={selected.status} />} /><WorkflowMeta label="Opened" value={formatDate(selected.created_at, true)} /></dl><section className="workflow-thread"><div className="workflow-section-heading"><div><h3>Conversation</h3><p>{messages.length} message{messages.length === 1 ? '' : 's'} in this ticket</p></div><MessageCircle size={19} /></div>{messages.map((item) => <article key={item.id} className={`workflow-message workflow-message--${item.sender_type}`}><div><strong>{item.sender_type === 'admin' ? 'Aadishakti admin' : selected.account?.display_name}</strong><time>{formatDate(item.created_at, true)}</time></div><p>{item.message}</p>{item.media?.url && <a href={item.media.url} target="_blank" rel="noreferrer">View attachment</a>}</article>)}{!messages.length && <WorkflowEmpty title="No messages found" copy="This ticket has no visible conversation history." />}</section></>}
    </WorkflowDrawer>
  </>;
}
