import os

src_dir = r"c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src"

# 1. Add CSS Animation
vendor_css = os.path.join(src_dir, "vendor", "vendor.css")
css_append = """
@keyframes float-svg {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}
.vendor-svg-anim {
  animation: float-svg 4s ease-in-out infinite;
}
"""
with open(vendor_css, "a", encoding="utf-8") as f:
    f.write(css_append)

# 2. Add Charts to VendorCharts.jsx
charts_path = os.path.join(src_dir, "vendor", "components", "VendorCharts.jsx")
with open(charts_path, "r", encoding="utf-8") as f:
    charts_content = f.read()

charts_content = charts_content.replace(
    "PieChart, Pie, Cell, Legend",
    "PieChart, Pie, Cell, Legend, BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis"
)

new_charts = """

export function HistoricalBarChart({ history }) {
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer>
        <BarChart data={history} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            cursor={{ fill: 'rgba(0,0,0,0.03)' }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', color: '#666', fontWeight: '600' }} />
          <Bar dataKey="quality" name="Quality" fill="#2e7d32" radius={[4, 4, 0, 0]} barSize={12} />
          <Bar dataKey="onTimeDelivery" name="On-Time Delivery" fill="#1976d2" radius={[4, 4, 0, 0]} barSize={12} />
          <Bar dataKey="responseTime" name="Response Time" fill="#f57c00" radius={[4, 4, 0, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OverallRadialChart({ overallScore }) {
  const data = [{ name: 'Overall', value: overallScore, fill: 'var(--red-core)' }];
  return (
    <div style={{ width: '100%', height: '200px' }}>
      <ResponsiveContainer>
        <RadialBarChart 
          cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={15} data={data} 
          startAngle={90} endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar minAngle={15} background={{ fill: '#f5f5f5' }} clockWise dataKey="value" cornerRadius={10} />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '28px', fontWeight: '800', fill: '#111' }}>
            {overallScore}%
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
"""

if "HistoricalBarChart" not in charts_content:
    with open(charts_path, "a", encoding="utf-8") as f:
        f.write(new_charts)

# 3. Update PerformancePage.jsx
perf_path = os.path.join(src_dir, "vendor", "pages", "PerformancePage.jsx")
with open(perf_path, "r", encoding="utf-8") as f:
    perf_content = f.read()

perf_content = perf_content.replace(
    "import VendorPageHeader from '../components/VendorPageHeader';",
    "import VendorPageHeader from '../components/VendorPageHeader';\nimport { ShieldCheck, Clock, Zap } from 'lucide-react';\nimport { HistoricalBarChart, OverallRadialChart } from '../components/VendorCharts';"
)

perf_content = perf_content.replace(
    """<div className="vendor-kpi-card">
          <div className="vendor-kpi-value">{avgQuality}%</div>
          <div className="vendor-kpi-label">Average Quality</div>
        </div>""",
    """<div className="vendor-kpi-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <ShieldCheck className="vendor-svg-anim" size={120} strokeWidth={1} style={{ position: 'absolute', bottom: '-20px', right: '-20px', color: '#2e7d32', opacity: 0.08, zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="vendor-kpi-value">{avgQuality}%</div>
            <div className="vendor-kpi-label">Average Quality</div>
          </div>
        </div>"""
)

perf_content = perf_content.replace(
    """<div className="vendor-kpi-card">
          <div className="vendor-kpi-value">{avgOnTime}%</div>
          <div className="vendor-kpi-label">Average On-Time Delivery</div>
        </div>""",
    """<div className="vendor-kpi-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <Clock className="vendor-svg-anim" size={120} strokeWidth={1} style={{ position: 'absolute', bottom: '-20px', right: '-20px', color: '#1976d2', opacity: 0.08, zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="vendor-kpi-value">{avgOnTime}%</div>
            <div className="vendor-kpi-label">Average On-Time Delivery</div>
          </div>
        </div>"""
)

perf_content = perf_content.replace(
    """<div className="vendor-kpi-card">
          <div className="vendor-kpi-value">{avgResponse}%</div>
          <div className="vendor-kpi-label">Average Response Time</div>
        </div>""",
    """<div className="vendor-kpi-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <Zap className="vendor-svg-anim" size={120} strokeWidth={1} style={{ position: 'absolute', bottom: '-20px', right: '-20px', color: '#f57c00', opacity: 0.08, zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="vendor-kpi-value">{avgResponse}%</div>
            <div className="vendor-kpi-label">Average Response Time</div>
          </div>
        </div>"""
)

perf_content = perf_content.replace(
    """<table className="vendor-table">
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
          </table>""",
    """<HistoricalBarChart history={performanceHistory} />"""
)

perf_content = perf_content.replace(
    """<div className="performance-chart" style={{ justifyContent: 'center', marginTop: '40px', marginBottom: '40px' }}>
            <div 
              className="donut-wrapper"
              style={{ background: `conic-gradient(var(--red-core) 0% ${performance.overall}%, #f0f0f0 ${performance.overall}% 100%)` }}
            >
              <div className="donut-inner" style={{ fontSize: '18px', fontWeight: '800' }}>{performance.overall}%</div>
            </div>
          </div>""",
    """<div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <OverallRadialChart overallScore={performance.overall} />
          </div>"""
)

with open(perf_path, "w", encoding="utf-8") as f:
    f.write(perf_content)

print("Performance page updated.")
