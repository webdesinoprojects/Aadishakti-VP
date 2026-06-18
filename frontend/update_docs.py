import os
import re

css_append = """
/* Document Modal Styles */
.doc-modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6);
  z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px;
  backdrop-filter: blur(4px);
}
.doc-modal-paper {
  background: #fff; width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto;
  border-radius: 4px; padding: 50px; position: relative; color: #333; font-family: var(--font-primary);
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}
.doc-modal-close {
  position: absolute; top: 20px; right: 20px; background: none; border: none; cursor: pointer; color: #999; transition: color 0.2s;
}
.doc-modal-close:hover { color: #111; }
.doc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 30px; }
.doc-logo { height: 45px; }
.doc-title { font-size: 24px; font-weight: 800; color: #111; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
.doc-meta { display: flex; justify-content: space-between; margin-bottom: 40px; font-size: 14px; line-height: 1.6; }
.doc-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
.doc-table th, .doc-table td { border: 1px solid #ddd; padding: 14px 16px; text-align: left; font-size: 14px; }
.doc-table th { background: #f9f9f9; font-weight: 700; color: #111; text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em; }
.doc-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 60px; border-top: 1px solid #eee; padding-top: 30px; }
.doc-stamp { border: 4px solid var(--green-core, #2e7d32); color: var(--green-core, #2e7d32); font-weight: 800; font-size: 22px; letter-spacing: 0.1em; padding: 10px 20px; transform: rotate(-5deg); display: inline-block; text-transform: uppercase; opacity: 0.85; border-radius: 4px; }
.doc-signature { font-family: 'Brush Script MT', 'Lucida Handwriting', cursive; font-size: 32px; color: #000; margin-bottom: 5px; }
.vendor-table-row-clickable { cursor: pointer; transition: background-color 0.2s ease, box-shadow 0.2s ease; }
.vendor-table-row-clickable:hover { background-color: #fdfdfd !important; box-shadow: inset 2px 0 0 var(--red-core); }
"""

src_dir = r"c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src"

# Append CSS
vendor_css = os.path.join(src_dir, "vendor", "vendor.css")
with open(vendor_css, "a", encoding="utf-8") as f:
    f.write(css_append)

def replace_in_file(filepath, pattern, replacement):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    content = re.sub(pattern, replacement, content)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

# Update InvoicesPage.jsx
invoices = os.path.join(src_dir, "vendor", "pages", "InvoicesPage.jsx")
with open(invoices, "r", encoding="utf-8") as f:
    inv_content = f.read()

if "DocumentViewerModal" not in inv_content:
    inv_content = inv_content.replace(
        "import VendorPageHeader from '../components/VendorPageHeader';",
        "import { useState } from 'react';\nimport VendorPageHeader from '../components/VendorPageHeader';\nimport DocumentViewerModal from '../components/DocumentViewerModal';"
    )
    inv_content = inv_content.replace(
        "const { data, loading, error } = useVendorData();",
        "const { data, loading, error } = useVendorData();\n  const [selectedDoc, setSelectedDoc] = useState(null);"
    )
    inv_content = inv_content.replace(
        "const { invoices, kpis } = data;",
        "const { invoices, kpis, profile } = data;"
    )
    inv_content = inv_content.replace(
        "<tr key={inv.id}>",
        "<tr key={inv.id} className=\"vendor-table-row-clickable\" onClick={() => setSelectedDoc(inv)}>"
    )
    inv_content = inv_content.replace(
        "</div>\n    </div>\n  );\n}",
        "</div>\n      <DocumentViewerModal \n        isOpen={!!selectedDoc} \n        onClose={() => setSelectedDoc(null)} \n        data={selectedDoc} \n        type=\"invoice\" \n        vendorProfile={profile} \n      />\n    </div>\n  );\n}"
    )
    with open(invoices, "w", encoding="utf-8") as f:
        f.write(inv_content)

# Update GRNPage.jsx
grn = os.path.join(src_dir, "vendor", "pages", "GRNPage.jsx")
with open(grn, "r", encoding="utf-8") as f:
    grn_content = f.read()

if "DocumentViewerModal" not in grn_content:
    grn_content = grn_content.replace(
        "import VendorPageHeader from '../components/VendorPageHeader';",
        "import { useState } from 'react';\nimport VendorPageHeader from '../components/VendorPageHeader';\nimport DocumentViewerModal from '../components/DocumentViewerModal';"
    )
    grn_content = grn_content.replace(
        "const { data, loading, error } = useVendorData();",
        "const { data, loading, error } = useVendorData();\n  const [selectedDoc, setSelectedDoc] = useState(null);"
    )
    grn_content = grn_content.replace(
        "const { grn } = data;",
        "const { grn, profile } = data;"
    )
    grn_content = grn_content.replace(
        "<tr key={receipt.id}>",
        "<tr key={receipt.id} className=\"vendor-table-row-clickable\" onClick={() => setSelectedDoc(receipt)}>"
    )
    grn_content = grn_content.replace(
        "</div>\n    </div>\n  );\n}",
        "</div>\n      <DocumentViewerModal \n        isOpen={!!selectedDoc} \n        onClose={() => setSelectedDoc(null)} \n        data={selectedDoc} \n        type=\"grn\" \n        vendorProfile={profile} \n      />\n    </div>\n  );\n}"
    )
    with open(grn, "w", encoding="utf-8") as f:
        f.write(grn_content)

print("Updates completed successfully.")
