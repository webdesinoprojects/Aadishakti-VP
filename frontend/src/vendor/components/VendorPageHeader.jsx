
export default function VendorPageHeader({ title, subtitle, children }) {
  if (children) {
    return (
      <header className="vendor-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="vendor-page-title">{title}</h1>
          <p className="vendor-page-subtitle">{subtitle}</p>
        </div>
        {children}
      </header>
    );
  }

  return (
    <header className="vendor-page-header">
      <h1 className="vendor-page-title">{title}</h1>
      <p className="vendor-page-subtitle">{subtitle}</p>
    </header>
  );
}
