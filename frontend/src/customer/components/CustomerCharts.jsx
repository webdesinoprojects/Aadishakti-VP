import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatAmount, formatCompactAmount } from '../utils/customerFormatters';

const COLORS = {
  Open: '#f59e0b',
  Closed: '#10b981',
  Cancelled: '#ef4444',
  default: '#94a3b8',
};

export function PurchaseVolumeChart({ data = [], available = true }) {
  const chartData = data.map(({ period, amount }) => ({ name: period, value: amount }));
  const emptyMessage = available
    ? 'No order-value data was returned.'
    : 'Order-value data is temporarily unavailable.';

  return (
    <div className="customer-card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#111' }}>
        Monthly Order Value
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '6px' }}>
        Amounts shown without an assumed currency.
      </p>
      <div style={{ flexGrow: 1, minHeight: 0, marginTop: '20px' }}>
        {chartData.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>
            {emptyMessage}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#888' }}
                tickFormatter={formatCompactAmount}
              />
              <Tooltip formatter={(value) => [formatAmount(value), 'Order value']} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--red-core)"
                strokeWidth={3}
                fill="var(--red-subtle)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export function OrderStatusPieChart({ data = [], available = true }) {
  const chartData = data.map(({ status, count }) => ({ name: status, value: count }));
  const emptyMessage = available
    ? 'No order-status data was returned.'
    : 'Order-status data is temporarily unavailable.';

  return (
    <div className="customer-card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Orders by SAP Status</h3>
      <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
        {chartData.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>
            {emptyMessage}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name] || COLORS.default} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Orders']} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
