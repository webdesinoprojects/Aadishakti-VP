import { useEffect, useState } from 'react';
import VendorPageHeader from '../components/VendorPageHeader';
import vendorApi from '../../services/vendorApi';

export default function LogisticsTrackerPage() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const load = async () => { try { const data = await vendorApi.getLogistics(); setOrders(data); if (selected) setSelected(data.find((item) => item.id === selected.id) || null); } catch (error) { setMessage(error.response?.data?.error || 'Unable to load logistics orders.'); } };
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const submitStage = async (event) => {
    event.preventDefault();
    try { await vendorApi.updateLogisticsStage(selected.id, new FormData(event.currentTarget)); event.currentTarget.reset(); setMessage('Tracking stage updated.'); await load(); }
    catch (error) { setMessage(error.response?.data?.error || 'Stage update failed.'); }
  };
  const submitPod = async (event) => {
    event.preventDefault();
    try { await vendorApi.submitPod(selected.id, new FormData(event.currentTarget)); event.currentTarget.reset(); setMessage('Proof of delivery submitted for review.'); await load(); }
    catch (error) { setMessage(error.response?.data?.error || 'POD upload failed.'); }
  };
  return <div className="vendor-page"><VendorPageHeader title="Logistics Tracker" subtitle="Aadishakti-managed tracking, stage proofs, and proof of delivery." />{message && <p>{message}</p>}
    <div className="vendor-panel"><table className="vendor-table"><thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Status</th><th>POD</th><th>Action</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td>{order.id}</td><td>{order.customer_name}</td><td>{order.product}</td><td>{order.status}</td><td>{order.pod_status}</td><td><button className="vendor-btn-outline" onClick={() => setSelected(order)}>Manage</button></td></tr>)}{!orders.length && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No logistics orders are assigned to this account.</td></tr>}</tbody></table></div>
    {selected && <div className="vendor-drawer-overlay open" onClick={() => setSelected(null)}><aside className="vendor-drawer" onClick={(event) => event.stopPropagation()}><div className="vendor-drawer-header"><h2>{selected.id}</h2><p>{selected.customer_name} · {selected.product}</p></div><div className="vendor-drawer-body">
      <h3>Tracking</h3>{(selected.tracking || []).map((stage) => <div key={stage.stage} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}><strong>{stage.stage}</strong><div>{stage.completed ? `Completed ${stage.timestamp ? new Date(stage.timestamp).toLocaleString() : ''}` : 'Pending'}</div>{stage.proofImages?.map((url) => <a key={url} href={url} target="_blank" rel="noreferrer">View proof </a>)}</div>)}
      <form onSubmit={submitStage} className="vendor-quote-form" style={{ marginTop: '20px', display: 'grid', gap: '10px' }}><strong>Update Stage</strong><select name="stage" required>{(selected.tracking || []).filter((item) => !item.completed).map((item) => <option key={item.stage}>{item.stage}</option>)}</select><input name="proofs" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" multiple /><button className="vendor-btn-outline">Save Stage</button></form>
      <form onSubmit={submitPod} className="vendor-quote-form" style={{ marginTop: '20px', display: 'grid', gap: '10px' }}><strong>Proof of Delivery</strong><input name="document" type="file" required accept=".jpg,.jpeg,.png,.webp,.pdf" /><button className="vendor-btn-outline">Submit POD</button></form>
    </div></aside></div>}
  </div>;
}
