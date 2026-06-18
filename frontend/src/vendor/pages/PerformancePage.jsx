import { useVendorData } from '../hooks/useVendorData';
import VendorPageHeader from '../components/VendorPageHeader';
import { ShieldCheck, Clock, Zap } from 'lucide-react';
import { HistoricalBarChart, OverallRadialChart } from '../components/VendorCharts';

export default function PerformancePage() {
  const { data, loading, error } = useVendorData();

  if (loading) return <div className="vendor-page">Loading Performance...</div>;
  if (error || !data) return <div className="vendor-page" style={{ color: 'var(--red-core)' }}>Error loading data.</div>;

  const { performanceHistory, performance } = data;

  // Calculate averages from history
  const avgQuality = Math.round(performanceHistory.reduce((acc, p) => acc + p.quality, 0) / performanceHistory.length);
  const avgOnTime = Math.round(performanceHistory.reduce((acc, p) => acc + p.onTimeDelivery, 0) / performanceHistory.length);
  const avgResponse = Math.round(performanceHistory.reduce((acc, p) => acc + p.responseTime, 0) / performanceHistory.length);

  return (
    <div className="vendor-page">
      <VendorPageHeader 
        title="My Performance" 
        subtitle="Track your historical metrics and current rating." 
      />

      <section className="vendor-kpi-grid" style={{ marginBottom: '40px' }}>
        <div className="vendor-kpi-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <ShieldCheck className="vendor-svg-anim" size={120} strokeWidth={1} style={{ position: 'absolute', bottom: '-20px', right: '-20px', color: '#2e7d32', opacity: 0.08, zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="vendor-kpi-value">{avgQuality}%</div>
            <div className="vendor-kpi-label">Average Quality</div>
          </div>
        </div>
        <div className="vendor-kpi-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <Clock className="vendor-svg-anim" size={120} strokeWidth={1} style={{ position: 'absolute', bottom: '-20px', right: '-20px', color: '#1976d2', opacity: 0.08, zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="vendor-kpi-value">{avgOnTime}%</div>
            <div className="vendor-kpi-label">Average On-Time Delivery</div>
          </div>
        </div>
        <div className="vendor-kpi-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <Zap className="vendor-svg-anim" size={120} strokeWidth={1} style={{ position: 'absolute', bottom: '-20px', right: '-20px', color: '#f57c00', opacity: 0.08, zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="vendor-kpi-value">{avgResponse}%</div>
            <div className="vendor-kpi-label">Average Response Time</div>
          </div>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div className="vendor-panel">
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700' }}>Historical Breakdown</h3>
          <HistoricalBarChart history={performanceHistory} />
          
          <table className="vendor-table" style={{ marginTop: '30px' }}>
            <thead>
              <tr>
                <th>Month</th>
                <th>Quality</th>
                <th>On-Time Delivery</th>
                <th>Response Time</th>
                <th>Overall</th>
              </tr>
            </thead>
            <tbody>
              {performanceHistory.map((hist, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '600', color: '#111' }}>{hist.month}</td>
                  <td>{hist.quality}%</td>
                  <td>{hist.onTimeDelivery}%</td>
                  <td>{hist.responseTime}%</td>
                  <td style={{ fontWeight: '600' }}>{hist.overall}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="vendor-panel">
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700' }}>Current Month Overall</h3>
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <OverallRadialChart overallScore={performance.overall} />
          </div>
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', margin: 0 }}>
            Your overall performance rating influences your RFQ priority and bid weightage.
          </p>
        </div>
      </div>
    </div>
  );
}
