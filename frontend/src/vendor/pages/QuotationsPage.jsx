import { useCallback, useEffect, useState } from 'react';
import VendorPageHeader from '../components/VendorPageHeader';
import vendorApi from '../../services/vendorApi';
import useVendorWorkflowRefresh from '../utils/useVendorWorkflowRefresh';

export default function QuotationsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const load = useCallback(() => {
    vendorApi.getQuotations().then(setItems).catch((err) => setError(err.response?.data?.error || 'Unable to load quotations.'));
  }, []);
  useEffect(() => { load(); }, [load]);
  useVendorWorkflowRefresh(load);
  return <div className="vendor-page"><VendorPageHeader title="My Quotations" subtitle="Track quotation submissions and commercial review status." />{error && <p>{error}</p>}<div className="vendor-panel"><table className="vendor-table"><thead><tr><th>Quotation</th><th>RFQ</th><th>Unit Price</th><th>Lead Time</th><th>Validity</th><th>Status</th></tr></thead><tbody>
    {items.map((item) => <tr key={item.id}><td>{item.quotation_reference}</td><td>{item.assignment?.rfq?.rfq_reference || '-'}</td><td className="vendor-amount-value">{item.unit_price}</td><td>{item.lead_time_days == null ? '-' : `${item.lead_time_days} days`}</td><td>{item.validity_date || '-'}</td><td>{(item.status || 'submitted').replaceAll('_', ' ')}</td></tr>)}{!items.length && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No quotations submitted yet.</td></tr>}
  </tbody></table></div></div>;
}
