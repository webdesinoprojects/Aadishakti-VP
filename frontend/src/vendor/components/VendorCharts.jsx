import { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';


const COLORS = ['#2e7d32', '#f57c00', '#d32f2f'];

export function VendorRevenueChart({ data = {} }) {
  const [filter, setFilter] = useState('month');

  const chartData = data[filter] || [];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#111' }}>Revenue Trends</h3>
        <div style={{ display: 'flex', background: '#f5f5f5', borderRadius: '4px', padding: '2px' }}>
          {['week', 'month', 'year'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? '#fff' : 'transparent',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '2px',
                fontSize: '12px',
                fontWeight: filter === f ? '700' : '600',
                color: filter === f ? 'var(--red-core)' : '#666',
                cursor: 'pointer',
                boxShadow: filter === f ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flexGrow: 1, minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2e7d32" stopOpacity={0.6}/>  {/* High (Green) */}
                <stop offset="50%" stopColor="#1976d2" stopOpacity={0.4}/> {/* Medium (Blue) */}
                <stop offset="100%" stopColor="#d32f2f" stopOpacity={0.1}/> {/* Low (Red) */}
              </linearGradient>
              <linearGradient id="colorStroke" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2e7d32" stopOpacity={1}/>
                <stop offset="50%" stopColor="#1976d2" stopOpacity={1}/>
                <stop offset="100%" stopColor="#d32f2f" stopOpacity={1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(val) => `₹${val/1000}k`} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#111', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="url(#colorStroke)" strokeWidth={3} fillOpacity={1} fill="url(#colorFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function VendorPerformancePie({ performance }) {
  // Using the performance object from data to create chart data
  const data = [
    { name: 'Quality', value: performance?.quality || 95 },
    { name: 'On-Time', value: performance?.onTimeDelivery || 90 },
    { name: 'Response', value: performance?.responseTime || 91 },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '800', color: '#111' }}>Performance Metrics</h3>
      <div style={{ flexGrow: 1, minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Score']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '13px', fontWeight: '600', color: '#666' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


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
  const data = [
    { name: 'Score', value: overallScore },
    { name: 'Remaining', value: 100 - overallScore }
  ];

  let statusText = 'Excellent';
  let gradientStop1 = '#f57c00'; // Orange
  let gradientStop2 = '#2e7d32'; // Green
  
  if (overallScore < 70) {
    statusText = 'Needs Focus';
    gradientStop1 = '#d32f2f'; // Red
    gradientStop2 = '#f57c00'; // Orange
  } else if (overallScore < 90) {
    statusText = 'Good';
    gradientStop1 = '#1976d2'; // Blue
    gradientStop2 = '#f57c00'; // Orange
  }

  return (
    <div style={{ width: '100%', height: '220px', position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={gradientStop1} />
              <stop offset="100%" stopColor={gradientStop2} />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={gradientStop2} floodOpacity="0.2"/>
            </filter>
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="75%"
            startAngle={180}
            endAngle={0}
            innerRadius="75%"
            outerRadius="100%"
            dataKey="value"
            stroke="none"
            paddingAngle={0}
          >
            <Cell key="cell-0" fill="url(#gaugeGradient)" filter="url(#shadow)" cornerRadius={8} />
            <Cell key="cell-1" fill="#f0f0f0" />
          </Pie>
          <text x="50%" y="68%" textAnchor="middle" dominantBaseline="baseline" style={{ fontSize: '42px', fontWeight: '800', fill: '#111', letterSpacing: '-1px' }}>
            {overallScore}%
          </text>
          <text x="50%" y="82%" textAnchor="middle" dominantBaseline="hanging" style={{ fontSize: '14px', fill: gradientStop2, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>
            {statusText}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
