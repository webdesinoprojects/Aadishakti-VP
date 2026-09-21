import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Eye, PackageSearch } from 'lucide-react';
import VendorLogisticsDrawer from '../components/VendorLogisticsDrawer';
import VendorPageHeader from '../components/VendorPageHeader';
import vendorApi from '../../services/vendorApi';
import './logistics.css';

const readableStatus = (status) => status || 'Order Confirmed';

export default function LogisticsTrackerPage() {
  const [orders, setOrders] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);
  const actionLockRef = useRef(false);
  const selected = useMemo(() => orders.find((item) => item.id === selectedId) || null, [orders, selectedId]);

  const showNotice = useCallback((text, type = 'success') => setNotice(text ? { text, type } : null), []);
  const load = useCallback(async ({ silent = false } = {}) => {
    try {
      setOrders(await vendorApi.getLogistics());
    } catch (error) {
      if (!silent) showNotice(error.response?.data?.error || 'Unable to load logistics orders.', 'error');
    }
  }, [showNotice]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!selectedId) return undefined;
    const timer = window.setInterval(() => load({ silent: true }), 5000);
    return () => window.clearInterval(timer);
  }, [load, selectedId]);

  const runAction = async (request, successMessage) => {
    if (actionLockRef.current) return false;
    actionLockRef.current = true;
    setBusy(true);
    showNotice(null);
    try {
      await request();
      await load({ silent: true });
      showNotice(successMessage);
      return true;
    } catch (error) {
      showNotice(error.response?.data?.error || 'The request could not be completed.', 'error');
      return false;
    } finally {
      actionLockRef.current = false;
      setBusy(false);
    }
  };

  return <div className="vendor-page vendor-logistics-page">
    <VendorPageHeader title="Logistics Tracker" subtitle="Update shipment stages, share proof and communicate with Aadishakti." />
    <div className="vendor-panel vendor-logistics-list-card">
      <div className="vendor-logistics-list-heading"><div><h3>Assigned logistics orders</h3><p>Open an order to manage its movement and delivery.</p></div><span>{orders.length} total</span></div>
      <div className="vendor-logistics-table-wrap">
        <table className="vendor-table vendor-logistics-table">
          <thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Status</th><th>POD</th><th>Action</th></tr></thead>
          <tbody>
            {orders.map((order) => <tr key={order.id}>
              <td><strong>{order.id}</strong></td><td>{order.customer_name}</td><td>{order.product}</td>
              <td><span className="vendor-logistics-table-status">{readableStatus(order.status)}</span></td>
              <td>{order.pod_status || 'Not submitted'}</td>
              <td><button type="button" className="vendor-logistics-manage" onClick={() => { setSelectedId(order.id); showNotice(null); }}><Eye size={16} /> Manage</button></td>
            </tr>)}
            {!orders.length && <tr><td colSpan="6"><div className="vendor-logistics-empty"><PackageSearch size={30} /><strong>No logistics orders assigned</strong><span>Accepted orders assigned to this vendor will appear here.</span></div></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
    <VendorLogisticsDrawer
      order={selected}
      busy={busy}
      notice={notice}
      onClose={() => { setSelectedId(null); showNotice(null); }}
      onClearNotice={showNotice}
      onStage={(formData) => runAction(() => vendorApi.updateLogisticsStage(selected.id, formData), 'Tracking stage updated successfully.')}
      onPod={(formData) => runAction(() => vendorApi.submitPod(selected.id, formData), 'Proof of delivery submitted for customer review.')}
      onMessage={(message) => runAction(() => vendorApi.addLogisticsMessage(selected.id, { message }), 'Message sent to Aadishakti.')}
    />
  </div>;
}
