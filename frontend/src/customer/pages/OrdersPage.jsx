import CustomerPageHeader from '../components/CustomerPageHeader';

export default function OrdersPage() {
  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader
        title="Sales Orders"
        subtitle="Sales Orders are not exposed by the current CIS API contract."
      />
      <div className="customer-card" style={{ maxWidth: '760px' }}>
        <h3 style={{ marginBottom: '12px' }}>Live order data is unavailable</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          CIS currently provides open AR invoices and delivery documents, but it does not provide a Customer
          Sales Order endpoint, order history, order details, or line items. No mock order data is shown here.
        </p>
      </div>
    </div>
  );
}
