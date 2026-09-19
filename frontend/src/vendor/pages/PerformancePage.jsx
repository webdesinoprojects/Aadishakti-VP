import { useEffect, useState } from 'react';
import VendorPageHeader from '../components/VendorPageHeader';
import vendorApi from '../../services/vendorApi';

export default function PerformancePage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { vendorApi.getPerformance().then(setItems).catch((err) => setError(err.response?.data?.error || 'Unable to load performance.')); }, []);
  return <div className="vendor-page"><VendorPageHeader title="Vendor Performance" subtitle="Aadishakti-issued performance scorecards; these figures are not supplied by CIS." />{error && <p>{error}</p>}<div className="vendor-panel"><table className="vendor-table"><thead><tr><th>Period</th><th>Quality</th><th>On-time Delivery</th><th>Response</th><th>Overall</th><th>Notes</th></tr></thead><tbody>
    {items.map((item) => <tr key={item.id}><td>{item.period_label}</td><td>{item.quality_score ?? '-'}</td><td>{item.on_time_delivery_score ?? '-'}</td><td>{item.response_score ?? '-'}</td><td style={{ fontWeight: 700 }}>{item.overall_score ?? '-'}</td><td>{item.notes || '-'}</td></tr>)}{!items.length && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No performance scorecard has been published yet.</td></tr>}
  </tbody></table></div></div>;
}
