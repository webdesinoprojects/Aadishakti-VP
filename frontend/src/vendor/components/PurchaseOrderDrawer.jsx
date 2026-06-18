import { X, CheckCircle, Package } from 'lucide-react';
import { getStatusClass } from '../utils/statusHelpers';

export default function PurchaseOrderDrawer({ isOpen, onClose, order }) {
  if (!order && !isOpen) return null;

  return (
    <div className={`vendor-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className={`vendor-drawer ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
        <button className="vendor-drawer-close" onClick={onClose}>
          <X size={20} />
        </button>

        {order && (
          <div className="vendor-drawer-content">
            <div className="vendor-drawer-header">
              <h2>Purchase Order</h2>
              <span className="vendor-drawer-subtitle">{order.poNumber}</span>
            </div>

            <div className="vendor-drawer-body">
              <div className="vendor-rfq-detail-card" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)', border: 'none', textAlign: 'center' }}>
                <Package size={40} color="#1976d2" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Total Amount</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#111' }}>₹ {order.amount}</div>
              </div>

              <div className="vendor-rfq-detail-card">
                <div className="vendor-rfq-detail-row">
                  <span className="vendor-rfq-detail-label">Status</span>
                  <span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span>
                </div>
                <div className="vendor-rfq-detail-row">
                  <span className="vendor-rfq-detail-label">Order Date</span>
                  <span className="vendor-rfq-detail-value">{order.date}</span>
                </div>
                <div className="vendor-rfq-detail-row">
                  <span className="vendor-rfq-detail-label">Expected Delivery</span>
                  <span className="vendor-rfq-detail-value" style={{ fontWeight: '700' }}>{order.deliveryDate}</span>
                </div>
              </div>
              
              <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(25, 118, 210, 0.05)', borderRadius: '8px', border: '1px solid rgba(25, 118, 210, 0.2)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle color="#1976d2" size={24} style={{ marginTop: '2px' }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#1976d2' }}>Next Steps</h4>
                  <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#555', lineHeight: '1.5' }}>
                    Ensure the required materials are delivered by <b>{order.deliveryDate}</b>. Once delivered, generate the corresponding invoice referencing this PO number to initiate payment processing.
                  </p>
                </div>
              </div>


              <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <button className="vendor-btn-outline" onClick={onClose} style={{ width: '100%', padding: '12px' }}>
                  Close Sidebar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
