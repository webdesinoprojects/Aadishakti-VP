import os
import re

css_append = """
/* Drawer Styles */
.vendor-drawer-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5);
  z-index: 3000; display: flex; justify-content: flex-end; opacity: 0; visibility: hidden; transition: all 0.3s ease;
  backdrop-filter: blur(2px);
}
.vendor-drawer-overlay.open { opacity: 1; visibility: visible; }
.vendor-drawer {
  background: #fff; width: 100%; max-width: 500px; height: 100vh; overflow-y: auto;
  transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -5px 0 25px rgba(0,0,0,0.1); display: flex; flex-direction: column;
}
.vendor-drawer-overlay.open .vendor-drawer { transform: translateX(0); }
.vendor-drawer-header {
  padding: 30px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: flex-start;
  position: sticky; top: 0; background: #fff; z-index: 10;
}
.vendor-drawer-title { font-size: 20px; font-weight: 800; color: #111; margin-bottom: 8px; }
.vendor-drawer-close { background: none; border: none; cursor: pointer; color: #666; padding: 5px; }
.vendor-drawer-close:hover { color: #111; }
.vendor-drawer-body { padding: 30px; flex-grow: 1; }
.vendor-drawer-section { margin-bottom: 30px; }
.vendor-drawer-section h4 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 12px; font-weight: 700; }
.vendor-drawer-section p { font-size: 14px; color: #333; line-height: 1.6; margin: 0; }
.vendor-drawer-list { margin: 0; padding-left: 20px; color: #333; font-size: 14px; line-height: 1.6; }
.vendor-drawer-list li { margin-bottom: 6px; }
.vendor-quote-form { background: #fafafa; padding: 24px; border: 1px solid #eee; border-radius: 4px; }
"""

src_dir = r"c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src"

# Append CSS
vendor_css = os.path.join(src_dir, "vendor", "vendor.css")
with open(vendor_css, "a", encoding="utf-8") as f:
    f.write(css_append)

# Write RFQDrawer.jsx
drawer_path = os.path.join(src_dir, "vendor", "components", "RFQDrawer.jsx")
drawer_content = """import { X, Calendar, Tag, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function RFQDrawer({ isOpen, onClose, rfq }) {
  const [quotePrice, setQuotePrice] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Reset form when RFQ changes or opens
  useEffect(() => {
    if (isOpen) {
      setQuotePrice('');
      setRemarks('');
      setSubmitted(false);
    }
  }, [isOpen, rfq]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className={`vendor-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={handleOverlayClick}>
      <div className="vendor-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="vendor-drawer-header">
          <div>
            <div className="vendor-drawer-title">{rfq?.title}</div>
            <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#666' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Tag size={14} /> {rfq?.category}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={14} /> Due: {rfq?.deadline}
              </span>
            </div>
          </div>
          <button className="vendor-drawer-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="vendor-drawer-body">
          <div className="vendor-drawer-section">
            <h4>Description</h4>
            <p>{rfq?.description || 'No detailed description provided.'}</p>
          </div>

          <div className="vendor-drawer-section">
            <h4>Requirements</h4>
            {rfq?.requirements && rfq.requirements.length > 0 ? (
              <ul className="vendor-drawer-list">
                {rfq.requirements.map((req, i) => <li key={i}>{req}</li>)}
              </ul>
            ) : (
              <p className="vendor-drawer-list">Standard quality requirements apply.</p>
            )}
          </div>

          {rfq?.status === 'Open' && (
            <div className="vendor-drawer-section">
              <h4>Submit Your Quotation</h4>
              {submitted ? (
                <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={20} />
                  <div>
                    <strong>Quotation Submitted!</strong><br/>
                    <span style={{ fontSize: '13px' }}>Your bid has been successfully recorded.</span>
                  </div>
                </div>
              ) : (
                <form className="vendor-quote-form" onSubmit={handleSubmit}>
                  <div className="float-form-group">
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Price per MT (₹)</label>
                    <input 
                      type="number" 
                      required 
                      className="float-form-control" 
                      placeholder="e.g. 150000"
                      value={quotePrice}
                      onChange={(e) => setQuotePrice(e.target.value)}
                    />
                  </div>
                  <div className="float-form-group">
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Remarks (Optional)</label>
                    <textarea 
                      className="float-form-control" 
                      placeholder="Delivery timeline, payment terms, etc."
                      rows="3"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      style={{ resize: 'vertical' }}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-solid-red" style={{ width: '100%', height: '44px' }}>
                    Submit Bid
                  </button>
                </form>
              )}
            </div>
          )}

          {rfq?.status !== 'Open' && (
            <div className="vendor-drawer-section">
              <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '4px', textAlign: 'center', color: '#666' }}>
                This RFQ is currently <strong style={{ textTransform: 'uppercase' }}>{rfq?.status}</strong> and is not accepting new quotations.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
"""

with open(drawer_path, "w", encoding="utf-8") as f:
    f.write(drawer_content)


# Update RFQsPage.jsx
rfq_page = os.path.join(src_dir, "vendor", "pages", "RFQsPage.jsx")
with open(rfq_page, "r", encoding="utf-8") as f:
    rfq_content = f.read()

rfq_content = rfq_content.replace(
    "import VendorPageHeader from '../components/VendorPageHeader';",
    "import { useState } from 'react';\nimport VendorPageHeader from '../components/VendorPageHeader';\nimport RFQDrawer from '../components/RFQDrawer';"
)

rfq_content = rfq_content.replace(
    "const { data, loading, error } = useVendorData();",
    "const { data, loading, error } = useVendorData();\n  const [drawerRfq, setDrawerRfq] = useState(null);\n  const [isDrawerOpen, setIsDrawerOpen] = useState(false);\n\n  const handleRowClick = (rfq) => {\n    setDrawerRfq(rfq);\n    setIsDrawerOpen(true);\n  };"
)

rfq_content = rfq_content.replace(
    "<tr key={rfq.id}>",
    "<tr key={rfq.id} className=\"vendor-table-row-clickable\" onClick={() => handleRowClick(rfq)}>"
)

rfq_content = rfq_content.replace(
    "<button\n                    disabled={rfq.status !== 'Open'}\n                    className={`btn-rfq ${rfq.status === 'Open' ? 'btn-rfq-active' : 'btn-rfq-disabled'}`}\n                  >\n                    Submit Quotation\n                  </button>",
    "<button\n                    className={`btn-rfq ${rfq.status === 'Open' ? 'btn-rfq-active' : 'btn-rfq-disabled'}`}\n                    onClick={(e) => {\n                      e.stopPropagation();\n                      handleRowClick(rfq);\n                    }}\n                  >\n                    {rfq.status === 'Open' ? 'Submit Quotation' : 'View Details'}\n                  </button>"
)

rfq_content = rfq_content.replace(
    "</div>\n    </div>\n  );\n}",
    "</div>\n      <RFQDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} rfq={drawerRfq} />\n    </div>\n  );\n}"
)

with open(rfq_page, "w", encoding="utf-8") as f:
    f.write(rfq_content)

print("Updates completed.")
