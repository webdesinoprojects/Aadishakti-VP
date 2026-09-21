import { useCallback, useEffect, useState } from 'react';
import { Clock3, Eye, Headphones, LoaderCircle, MessageCircle, Send, ShieldAlert } from 'lucide-react';
import CustomerPageHeader from '../components/CustomerPageHeader';
import CustomerSupportDrawer from '../components/CustomerSupportDrawer';
import { CustomerWorkflowEmpty, CustomerWorkflowStat } from '../components/CustomerWorkflowPrimitives';
import { formatWorkflowDate, titleize, workflowStatusClass } from '../utils/customerWorkflowFormatters';
import { usePortalToast } from '../../portal/PortalToastContext';
import customerApi from '../../services/customerApi';
import '../components/customer-workflows.css';

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const toast = usePortalToast();

  const load = useCallback(async ({ showError = true } = {}) => {
    try {
      const next = await customerApi.getSupport();
      setTickets(next);
      setSelected((current) => current ? next.find((ticket) => ticket.id === current.id) || current : null);
      return next;
    } catch (error) {
      if (showError) toast.error(error.response?.data?.error || 'Unable to load support tickets.');
      return [];
    } finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    try {
      await customerApi.createSupport(Object.fromEntries(new FormData(form).entries()));
      form.reset();
      toast.success('Support ticket created. Aadishakti can now review your message.');
      await load({ showError: false });
    } catch (error) { toast.error(error.response?.data?.error || 'Unable to create the support ticket.'); }
    finally { setBusy(false); }
  };

  const reply = async (ticket, message) => {
    setBusy(true);
    try {
      await customerApi.replySupport(ticket.id, { message });
      toast.success('Reply sent to Aadishakti support.');
      await load({ showError: false });
      return true;
    } catch (error) { toast.error(error.response?.data?.error || 'Unable to send the reply.'); return false; }
    finally { setBusy(false); }
  };

  return <div className="customer-workflow-page"><CustomerPageHeader title="Customer Support" subtitle="Create a ticket and follow every response from the Aadishakti team." />
    <CustomerSupportDrawer ticket={selected} busy={busy} onClose={() => setSelected(null)} onReply={reply} />
    <div className="customer-workflow-stats"><CustomerWorkflowStat icon={Headphones} value={tickets.length} label="Total tickets" /><CustomerWorkflowStat icon={Clock3} value={tickets.filter((item) => ['open', 'in_progress'].includes(item.status)).length} label="Open or active" tone="amber" /><CustomerWorkflowStat icon={ShieldAlert} value={tickets.filter((item) => item.priority === 'urgent').length} label="Urgent" tone="red" /></div>
    <section className="customer-card customer-workflow-form-card"><header className="customer-workflow-card-heading"><span><Headphones size={22} /></span><div><h2>Open a support ticket</h2><p>Describe the issue clearly so the right team can respond quickly.</p></div></header>
      <form className="customer-support-form" onSubmit={submit}>
        <label className="is-wide"><span>Subject *</span><input name="subject" required maxLength="180" placeholder="Brief summary of the issue" disabled={busy} /></label>
        <label><span>Category</span><select name="category" defaultValue="general" disabled={busy}><option value="general">General</option><option value="order">Order</option><option value="delivery">Delivery</option><option value="invoice">Invoice</option><option value="payment">Payment</option><option value="product_quality">Product quality</option></select></label>
        <label><span>Priority</span><select name="priority" defaultValue="normal" disabled={busy}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></label>
        <label className="is-wide"><span>Message *</span><textarea name="message" required rows="5" maxLength="3000" placeholder="Explain what happened, include references, and tell us what help you need." disabled={busy} /></label>
        <div className="customer-workflow-actions is-wide"><span>Replies remain linked to this ticket.</span><button type="submit" disabled={busy}>{busy ? <><LoaderCircle className="customer-workflow-spin" size={17} />Creating…</> : <><Send size={17} />Create ticket</>}</button></div>
      </form>
    </section>
    <section className="customer-card customer-workflow-history"><header className="customer-workflow-history-heading"><div><h2>Support history</h2><p>Open a ticket to read the complete conversation and reply.</p></div><span>{tickets.length} total</span></header><div className="customer-workflow-table-scroll"><table className="customer-table"><thead><tr><th>Ticket</th><th>Subject</th><th>Category</th><th>Priority</th><th>Status</th><th>Updated</th><th>Action</th></tr></thead><tbody>
      {tickets.map((ticket) => <tr key={ticket.id} className="customer-workflow-clickable" onClick={() => setSelected(ticket)}><td><strong>{ticket.ticket_reference}</strong></td><td><span className="customer-workflow-subject">{ticket.subject}</span><small><MessageCircle size={12} /> {ticket.messages?.length || 0} messages</small></td><td>{titleize(ticket.category)}</td><td><span className={`customer-priority is-${ticket.priority}`}>{titleize(ticket.priority)}</span></td><td><span className={workflowStatusClass(ticket.status)}>{titleize(ticket.status)}</span></td><td>{formatWorkflowDate(ticket.updated_at, true)}</td><td><button type="button" onClick={(event) => { event.stopPropagation(); setSelected(ticket); }}><Eye size={15} />Open ticket</button></td></tr>)}
      {!loading && !tickets.length && <tr><td colSpan="7"><CustomerWorkflowEmpty title="No support tickets yet" copy="Create a ticket above whenever you need assistance." /></td></tr>}{loading && <tr><td colSpan="7"><div className="customer-workflow-empty"><LoaderCircle className="customer-workflow-spin" size={26} /><span>Loading support tickets…</span></div></td></tr>}
    </tbody></table></div></section>
  </div>;
}
