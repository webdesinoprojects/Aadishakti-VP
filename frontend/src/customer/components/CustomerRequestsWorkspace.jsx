import { useEffect, useState } from 'react';
import customerApi from '../../services/customerApi';

export default function CustomerRequestsWorkspace({ requestTypes, defaultType }) {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const load = async () => {
    try { setItems(await customerApi.getRequests()); }
    catch (error) { setMessage(error.response?.data?.error || 'Unable to load requests.'); }
  };
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const submit = async (event) => {
    event.preventDefault();
    try {
      await customerApi.submitRequest(new FormData(event.currentTarget));
      event.currentTarget.reset();
      setMessage('Request submitted successfully.');
      await load();
    } catch (error) { setMessage(error.response?.data?.error || 'Request submission failed.'); }
  };
  return <>
    <div className="customer-card" style={{ padding: '20px', marginBottom: '20px' }}>
      <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <label>Request Type<select name="requestType" defaultValue={defaultType} style={{ width: '100%', padding: '10px', marginTop: '6px' }}>{requestTypes.map((type) => <option value={type.value} key={type.value}>{type.label}</option>)}</select></label>
        <label>Related Order / Document<input name="relatedReference" placeholder="Optional reference" style={{ width: '100%', padding: '10px', marginTop: '6px' }} /></label>
        <label style={{ gridColumn: '1 / -1' }}>Subject<input name="subject" required style={{ width: '100%', padding: '10px', marginTop: '6px' }} /></label>
        <label style={{ gridColumn: '1 / -1' }}>Details<textarea name="description" rows="3" style={{ width: '100%', padding: '10px', marginTop: '6px' }} /></label>
        <label>Attachment<input name="document" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style={{ width: '100%', padding: '8px', marginTop: '6px' }} /></label>
        <button className="customer-btn-outline" style={{ alignSelf: 'end' }}>Submit Request</button>
      </form>
      {message && <p style={{ marginTop: '12px' }}>{message}</p>}
    </div>
    <div className="customer-card" style={{ padding: 0 }}><table className="customer-table"><thead><tr><th>Reference</th><th>Type</th><th>Subject</th><th>Status</th><th>Result</th></tr></thead><tbody>
      {items.map((item) => <tr key={item.id}><td>{item.request_reference}</td><td>{item.request_type}</td><td>{item.subject}</td><td>{item.status}</td><td>{item.result?.url ? <a href={item.result.url} target="_blank" rel="noreferrer">Download</a> : '-'}</td></tr>)}
      {!items.length && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No requests submitted yet.</td></tr>}
    </tbody></table></div>
  </>;
}
