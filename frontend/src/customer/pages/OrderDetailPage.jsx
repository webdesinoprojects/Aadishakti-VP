import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function UnavailableOrderDetail() {
  return (
    <div style={{ padding: '40px' }}>
      <Link
        to="/customer/orders"
        style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', textDecoration: 'none' }}
      >
        <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Sales Orders
      </Link>
      <div className="customer-card" style={{ maxWidth: '760px', marginTop: '24px' }}>
        <h2 style={{ marginBottom: '12px' }}>Order detail unavailable</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          The current CIS API does not expose Customer Sales Orders, order details, document lines, or
          order-to-delivery associations. This page intentionally does not display previous mock records.
        </p>
      </div>
    </div>
  );
}

export default UnavailableOrderDetail;
export const OrderDetailIndex = UnavailableOrderDetail;
export const OrderDetailShipments = UnavailableOrderDetail;
export const OrderDetailDocuments = UnavailableOrderDetail;
export const OrderDetailInvoices = UnavailableOrderDetail;
export const OrderDetailPayments = UnavailableOrderDetail;
