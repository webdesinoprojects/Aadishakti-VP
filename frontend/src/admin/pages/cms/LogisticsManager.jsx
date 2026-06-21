import { useState, useEffect } from 'react';
import { Search, MapPin, CheckCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import TopBar from '../../components/TopBar';

export default function LogisticsManager() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/orders');
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleReviewPOD = async (action) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${selectedOrder.id}/review-pod`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        loadOrders();
        setSelectedOrder(prev => ({ ...prev, podStatus: action === 'accept' ? 'Accepted' : 'Rejected' }));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  let filtered = orders;
  if (filter !== 'All') {
    if (filter === 'POD Under Review') filtered = orders.filter(o => o.podStatus === 'Under Review');
    else filtered = orders.filter(o => o.status === filter);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(o => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q));
  }

  return (
    <>
      <TopBar breadcrumb="Operations / Logistics Tracker" />
      
      <div style={{ padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}><MapPin /> Logistics & Tracking</h1>
            <p style={{ color: "var(--text-secondary)" }}>Track active orders, monitor vendor shipments, and review Proof of Deliveries.</p>
          </div>
          <button onClick={loadOrders} className="btn-icon" title="Refresh">
            <RefreshCw size={20} className={loading ? "spin" : ""} />
          </button>
        </div>

        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: "400px" }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search Order ID or Customer..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>
          <select className="form-input" style={{ width: "200px" }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="All">All Stages</option>
            <option value="Order Confirmed">Order Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Shipment Started">Shipment Started</option>
            <option value="POD Under Review">POD Under Review</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '30px' }}>
          
          <div style={{ flex: 1 }}>
            <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid var(--border-light)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-light)", textAlign: "left" }}>
                    <th style={{ padding: "16px", fontWeight: 600 }}>Order ID</th>
                    <th style={{ padding: "16px", fontWeight: 600 }}>Vendor</th>
                    <th style={{ padding: "16px", fontWeight: 600 }}>Customer</th>
                    <th style={{ padding: "16px", fontWeight: 600 }}>Status</th>
                    <th style={{ padding: "16px", fontWeight: 600 }}>POD</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(order => (
                    <tr 
                      key={order.id} 
                      onClick={() => navigate(`/admin/logistics/${order.id}`)}
                      style={{ 
                        borderBottom: "1px solid var(--border-light)", 
                        cursor: "pointer",
                        background: selectedOrder?.id === order.id ? "rgba(204,34,0,0.05)" : "transparent"
                      }}
                      className="table-row-hover"
                    >
                      <td style={{ padding: "16px", fontWeight: 700 }}>{order.id}</td>
                      <td style={{ padding: "16px" }}>{order.vendorName}</td>
                      <td style={{ padding: "16px" }}>{order.customerName}</td>
                      <td style={{ padding: "16px" }}>
                        <span style={{ 
                          padding: "4px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 600,
                          background: order.status === 'Delivered' ? '#e8f5e9' : 'rgba(0,0,0,0.05)',
                          color: order.status === 'Delivered' ? '#2e7d32' : 'var(--text-secondary)'
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span style={{ 
                          padding: "4px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 600,
                          background: order.podStatus === 'Accepted' ? '#e8f5e9' : order.podStatus === 'Under Review' ? '#fff3e0' : 'rgba(0,0,0,0.05)',
                          color: order.podStatus === 'Accepted' ? '#2e7d32' : order.podStatus === 'Under Review' ? '#e65100' : 'var(--text-secondary)'
                        }}>
                          {order.podStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No orders found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          </div>
      </div>
    </>
  );
}
