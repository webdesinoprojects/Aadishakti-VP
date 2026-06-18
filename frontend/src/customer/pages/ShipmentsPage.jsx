import { useState } from 'react';
import CustomerPageHeader from '../components/CustomerPageHeader';
import CustomerPagination from '../components/CustomerPagination';
import { useCustomerData } from '../hooks/useCustomerData';

export default function ShipmentsPage() {
  const { data, loading } = useCustomerData();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('All');
  const itemsPerPage = 10;

  if (loading || !data) return <div style={{ padding: '40px' }}>Loading...</div>;

  const trackingData = data.tracking || [];
  const filteredItems = filter === 'All' ? trackingData : trackingData.filter(t => t.status === filter);
  
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirst, indexOfLast);

  const activeShipments = trackingData.filter(t => t.status === 'In Transit').length;




  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader title="Shipments Tracker" subtitle={`You have ${activeShipments} active shipments in transit.`} />
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => { setFilter("All"); setCurrentPage(1); }} style={{ padding: "8px 16px", background: filter === "All" ? "var(--red-core)" : "transparent", color: filter === "All" ? "white" : "var(--text-secondary)", border: "1px solid", borderColor: filter === "All" ? "var(--red-core)" : "var(--border-color)", borderRadius: "20px", fontWeight: "500", fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}>All</button>
        <button onClick={() => { setFilter("In Transit"); setCurrentPage(1); }} style={{ padding: "8px 16px", background: filter === "In Transit" ? "var(--red-core)" : "transparent", color: filter === "In Transit" ? "white" : "var(--text-secondary)", border: "1px solid", borderColor: filter === "In Transit" ? "var(--red-core)" : "var(--border-color)", borderRadius: "20px", fontWeight: "500", fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}>In Transit</button>
        <button onClick={() => { setFilter("Delivered"); setCurrentPage(1); }} style={{ padding: "8px 16px", background: filter === "Delivered" ? "var(--red-core)" : "transparent", color: filter === "Delivered" ? "white" : "var(--text-secondary)", border: "1px solid", borderColor: filter === "Delivered" ? "var(--red-core)" : "var(--border-color)", borderRadius: "20px", fontWeight: "500", fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}>Delivered</button>
      </div>

      <div className="customer-card" style={{ padding: 0 }}>
        <table className="customer-table">
          <thead>
            <tr><th>Shipment ID</th><th>Journey</th><th>Status / ETA</th></tr>
          </thead>
          <tbody>
            {currentItems.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: '600', width: '20%' }}>{t.id}</td>
                <td style={{ width: '50%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ flex: 1, textAlign: 'right', fontWeight: '500' }}>{t.origin}</div>
                    <div style={{ height: '2px', flex: 2, background: t.status === 'Delivered' ? 'var(--status-delivered)' : 'var(--border-color)', position: 'relative' }}>
                       {t.status === 'In Transit' && <div style={{ position: 'absolute', top: '-4px', left: '50%', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--status-intransit)' }}></div>}
                    </div>
                    <div style={{ flex: 1, textAlign: 'left', fontWeight: '500' }}>{t.destination}</div>
                  </div>
                </td>
                <td style={{ width: '30%', textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', color: t.status === 'Delivered' ? 'var(--status-delivered)' : 'var(--status-intransit)' }}>{t.status}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{t.status === 'Delivered' ? `On: ${t.deliveredOn}` : `ETA: ${t.eta}`}</div>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center' }}>No shipments found for this filter.</td></tr>}
          </tbody>
        </table>
        {filteredItems.length > 0 && <CustomerPagination currentPage={currentPage} totalPages={Math.ceil(filteredItems.length / itemsPerPage)} onPageChange={setCurrentPage} totalItems={filteredItems.length} itemsPerPage={itemsPerPage} />}
      </div>
    </div>
  );
}
