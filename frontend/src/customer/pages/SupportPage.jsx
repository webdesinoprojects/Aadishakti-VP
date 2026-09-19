import { useEffect, useState } from 'react';
import CustomerPageHeader from '../components/CustomerPageHeader';
import customerApi from '../../services/customerApi';

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState('');
  const load = async () => { try { setTickets(await customerApi.getSupport()); } catch (error) { setMessage(error.response?.data?.error || 'Unable to load support tickets.'); } };
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const submit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await customerApi.createSupport(Object.fromEntries(form.entries()));
      event.currentTarget.reset(); setMessage('Support ticket created.'); await load();
    } catch (error) { setMessage(error.response?.data?.error || 'Unable to create ticket.'); }
  };
  return <div style={{ padding: '40px' }}><CustomerPageHeader title="Customer Support" subtitle="Create a ticket and follow responses from the Aadishakti team." />
    <div className="customer-card" style={{ padding: '20px', marginBottom: '20px' }}><form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      <label>Subject<input name="subject" required style={{ width: '100%', padding: '10px', marginTop: '6px' }} /></label>
      <label>Priority<select name="priority" defaultValue="normal" style={{ width: '100%', padding: '10px', marginTop: '6px' }}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></label>
      <label style={{ gridColumn: '1 / -1' }}>Message<textarea name="message" required rows="3" style={{ width: '100%', padding: '10px', marginTop: '6px' }} /></label>
      <button className="customer-btn-outline">Create Ticket</button>
    </form>{message && <p style={{ marginTop: '12px' }}>{message}</p>}</div>
    <div className="customer-card" style={{ padding: 0 }}><table className="customer-table"><thead><tr><th>Ticket</th><th>Subject</th><th>Priority</th><th>Status</th><th>Last Updated</th></tr></thead><tbody>{tickets.map((ticket) => <tr key={ticket.id}><td>{ticket.ticket_reference}</td><td>{ticket.subject}</td><td>{ticket.priority}</td><td>{ticket.status}</td><td>{new Date(ticket.updated_at).toLocaleString()}</td></tr>)}{!tickets.length && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No support tickets yet.</td></tr>}</tbody></table></div>
  </div>;
}
