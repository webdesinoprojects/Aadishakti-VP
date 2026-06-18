import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Prepare data for Purchase Volume (Area Chart)
const processVolumeData = (orders) => {
  const monthlyData = {};
  orders.forEach(order => {
    // "15 May 2024" -> "May 2024"
    const parts = order.date.split(' ');
    if (parts.length === 3) {
      const month = `${parts[1]} ${parts[2]}`;
      if (!monthlyData[month]) monthlyData[month] = 0;
      monthlyData[month] += order.amount;
    }
  });
  
  // Convert to array
  return Object.keys(monthlyData).map(month => ({
    name: month,
    Volume: monthlyData[month]
  })).reverse(); // Assuming orders are newest first, we reverse for chronological
};

// Prepare data for Order Status (Pie Chart)
const processStatusData = (orders) => {
  const statusCounts = {};
  orders.forEach(order => {
    if (!statusCounts[order.status]) statusCounts[order.status] = 0;
    statusCounts[order.status]++;
  });
  
  return Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));
};

const COLORS = {
  'Delivered': '#10b981',
  'In Transit': '#f59e0b',
  'Confirmed': '#3b82f6',
  'Cancelled': '#ef4444',
  'default': '#94a3b8'
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
        <p style={{ margin: 0, color: 'var(--red-core)' }}>
          ₹ {payload[0].value.toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
};

export const PurchaseVolumeChart = ({ orders }) => {
  const data = processVolumeData(orders);

  return (
    <div className="customer-card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Monthly Purchase Volume</h3>
      <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--red-core)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--red-core)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--text-muted)'}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--text-muted)'}} dx={-10} tickFormatter={(val) => `₹${val/100000}L`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="Volume" stroke="var(--red-core)" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const OrderStatusPieChart = ({ orders }) => {
  const data = processStatusData(orders);

  return (
    <div className="customer-card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Orders by Status</h3>
      <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
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
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS['default']} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [value, 'Orders']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px' }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
