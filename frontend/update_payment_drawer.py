import os

src_dir = r"c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src"
drawer_path = os.path.join(src_dir, "vendor", "components", "PaymentDrawer.jsx")

drawer_content = """import { X, CheckCircle, Banknote } from 'lucide-react';

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

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
"""

with open(drawer_path, "w", encoding="utf-8") as f:
    f.write(drawer_content)

payments_page_path = os.path.join(src_dir, "vendor", "pages", "PaymentsPage.jsx")
with open(payments_page_path, "r", encoding="utf-8") as f:
    payments_content = f.read()

# Add imports
if "PaymentDrawer" not in payments_content:
    payments_content = payments_content.replace(
        "import VendorPagination from '../components/VendorPagination';",
        "import VendorPagination from '../components/VendorPagination';\nimport { useState } from 'react';\nimport PaymentDrawer from '../components/PaymentDrawer';"
    )

    # Add state
    payments_content = payments_content.replace(
        "const { payments } = data;",
        "const { payments } = data;\n  const [selectedPayment, setSelectedPayment] = useState(null);\n  const [isDrawerOpen, setIsDrawerOpen] = useState(false);\n\n  const handleRowClick = (pay) => {\n    setSelectedPayment(pay);\n    setIsDrawerOpen(true);\n  };"
    )

    # Make rows clickable
    payments_content = payments_content.replace(
        "<tr key={pay.id}>",
        '<tr key={pay.id} className="vendor-table-row-clickable" onClick={() => handleRowClick(pay)}>'
    )

    # Add drawer
    payments_content = payments_content.replace(
        "</div>\n    </div>",
        "</div>\n      <PaymentDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} payment={selectedPayment} />\n    </div>"
    )

    with open(payments_page_path, "w", encoding="utf-8") as f:
        f.write(payments_content)
    print("Updated PaymentsPage.jsx with drawer")
