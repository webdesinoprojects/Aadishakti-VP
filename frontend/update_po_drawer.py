import os

src_dir = r"c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src"
drawer_path = os.path.join(src_dir, "vendor", "components", "PurchaseOrderDrawer.jsx")

drawer_content = """import { X, CheckCircle, Package } from 'lucide-react';
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

po_page_path = os.path.join(src_dir, "vendor", "pages", "PurchaseOrdersPage.jsx")
with open(po_page_path, "r", encoding="utf-8") as f:
    po_content = f.read()

# Add imports
if "PurchaseOrderDrawer" not in po_content:
    po_content = po_content.replace(
        "import VendorPageHeader from '../components/VendorPageHeader';",
        "import VendorPageHeader from '../components/VendorPageHeader';\nimport PurchaseOrderDrawer from '../components/PurchaseOrderDrawer';"
    )

    # Add state
    po_content = po_content.replace(
        "const [filter, setFilter] = useState('All');",
        "const [filter, setFilter] = useState('All');\n  const [selectedOrder, setSelectedOrder] = useState(null);\n  const [isDrawerOpen, setIsDrawerOpen] = useState(false);\n\n  const handleRowClick = (order) => {\n    setSelectedOrder(order);\n    setIsDrawerOpen(true);\n  };"
    )

    # Make rows clickable
    po_content = po_content.replace(
        "<tr key={po.poNumber}>",
        '<tr key={po.poNumber} className="vendor-table-row-clickable" onClick={() => handleRowClick(po)}>'
    )

    # Add drawer
    po_content = po_content.replace(
        "</div>\n    </div>",
        "</div>\n      <PurchaseOrderDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} order={selectedOrder} />\n    </div>"
    )

    with open(po_page_path, "w", encoding="utf-8") as f:
        f.write(po_content)
    print("Updated PurchaseOrdersPage.jsx with drawer")
