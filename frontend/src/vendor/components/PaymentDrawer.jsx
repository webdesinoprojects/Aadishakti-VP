import { X, CheckCircle, Banknote } from 'lucide-react';

export default function PaymentDrawer({ isOpen, onClose, payment }) {
  if (!payment && !isOpen) return null;

  return (
    <div className={`vendor-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className={`vendor-drawer ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
        <button className="vendor-drawer-close" onClick={onClose}>
          <X size={20} />
        </button>

        {payment && (
          <div className="vendor-drawer-content">
            <div className="vendor-drawer-header">
              <h2>Payment Details</h2>
              <span className="vendor-drawer-subtitle">ID: {payment.id}</span>
            </div>

            <div className="vendor-drawer-body">
              <div className="vendor-rfq-detail-card" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)', border: 'none', textAlign: 'center' }}>
                <Banknote size={40} color="#2e7d32" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Amount Paid</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#111' }}>₹ {payment.amount}</div>
              </div>

              <div className="vendor-rfq-detail-card">
                <div className="vendor-rfq-detail-row">
                  <span className="vendor-rfq-detail-label">Invoice No</span>
                  <span className="vendor-rfq-detail-value" style={{ fontWeight: '700' }}>{payment.invoiceNo}</span>
                </div>
                <div className="vendor-rfq-detail-row">
                  <span className="vendor-rfq-detail-label">Paid Date</span>
                  <span className="vendor-rfq-detail-value">{payment.paidDate}</span>
                </div>
                <div className="vendor-rfq-detail-row">
                  <span className="vendor-rfq-detail-label">Payment Mode</span>
                  <span className="vendor-rfq-detail-value">{payment.mode}</span>
                </div>
                <div className="vendor-rfq-detail-row">
                  <span className="vendor-rfq-detail-label">UTR / Ref No</span>
                  <span className="vendor-rfq-detail-value" style={{ fontFamily: 'var(--font-mono)' }}>{payment.utr}</span>
                </div>
              </div>
              
              <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(46, 125, 50, 0.05)', borderRadius: '8px', border: '1px solid rgba(46, 125, 50, 0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle color="#2e7d32" size={24} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#2e7d32' }}>Payment Successful</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#555' }}>The amount has been successfully credited to your registered bank account via {payment.mode}.</p>
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
