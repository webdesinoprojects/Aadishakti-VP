import os
import glob

css_append = """
/* Pagination Styles */
.vendor-pagination {
  display: flex; justify-content: flex-end; align-items: center; padding: 20px; border-top: 1px solid #eee; gap: 8px;
}
.vendor-page-btn {
  display: flex; align-items: center; justify-content: center; height: 32px; min-width: 32px; padding: 0 10px;
  background: transparent; border: 1px solid transparent; color: #666; font-family: var(--font-primary);
  font-size: 13px; font-weight: 600; border-radius: 4px; cursor: pointer; transition: all 0.2s;
}
.vendor-page-btn:hover:not(:disabled) { background: #f5f5f5; color: #111; }
.vendor-page-btn.active { background: var(--red-core); color: #fff; border-color: var(--red-core); }
.vendor-page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.vendor-page-dots { color: #999; font-weight: bold; margin: 0 4px; }
"""

src_dir = r"c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src"

# Append CSS
vendor_css = os.path.join(src_dir, "vendor", "vendor.css")
with open(vendor_css, "a", encoding="utf-8") as f:
    f.write(css_append)

# Write VendorPagination.jsx
pagination_path = os.path.join(src_dir, "vendor", "components", "VendorPagination.jsx")
pagination_content = """import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function VendorPagination({ currentPage = 1, totalPages = 5 }) {
  return (
    <div className="vendor-pagination">
      <button className="vendor-page-btn" disabled={currentPage === 1}>
        <ChevronLeft size={16} style={{ marginRight: '4px' }} /> Prev
      </button>
      
      <button className="vendor-page-btn active">1</button>
      <button className="vendor-page-btn">2</button>
      <button className="vendor-page-btn">3</button>
      <span className="vendor-page-dots">...</span>
      <button className="vendor-page-btn">{totalPages}</button>

      <button className="vendor-page-btn" disabled={currentPage === totalPages}>
        Next <ChevronRight size={16} style={{ marginLeft: '4px' }} />
      </button>
    </div>
  );
}
"""

with open(pagination_path, "w", encoding="utf-8") as f:
    f.write(pagination_content)

# Update Pages to include pagination
pages_to_update = [
    "RFQsPage.jsx", "PurchaseOrdersPage.jsx", "InvoicesPage.jsx", 
    "QuotationsPage.jsx", "GRNPage.jsx", "PaymentsPage.jsx"
]

for page in pages_to_update:
    file_path = os.path.join(src_dir, "vendor", "pages", page)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        if "VendorPagination" not in content:
            # Add import
            content = content.replace(
                "import VendorPageHeader", 
                "import VendorPagination from '../components/VendorPagination';\nimport VendorPageHeader"
            )
            
            # Inject at the end of vendor-panel
            content = content.replace(
                "        </table>\n      </div>",
                "        </table>\n        <VendorPagination />\n      </div>"
            )
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)

print("Pagination added successfully.")
