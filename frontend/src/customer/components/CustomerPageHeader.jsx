export default function CustomerPageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>{title}</h1>
        {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
