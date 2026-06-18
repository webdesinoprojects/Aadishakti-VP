import os

src_dir = r"c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src"

# 1. Update CSS
css_path = os.path.join(src_dir, "vendor", "vendor.css")
with open(css_path, "r", encoding="utf-8") as f:
    css_content = f.read()

css_content = css_content.replace(
    ".vendor-drawer {\n  background: #fff; width: 100%; max-width: 500px; height: 100vh; overflow-y: auto;",
    ".vendor-drawer {\n  background: #fff; width: 100%; max-width: 500px; height: 100vh; overflow-y: auto; position: relative;"
)

css_content = css_content.replace(
    ".vendor-drawer-close { background: none; border: none; cursor: pointer; color: #666; padding: 5px; }",
    ".vendor-drawer-close { position: absolute; top: 25px; right: 25px; background: none; border: none; cursor: pointer; color: #666; padding: 5px; z-index: 20; transition: all 0.2s; }"
)

with open(css_path, "w", encoding="utf-8") as f:
    f.write(css_content)

# 2. Update Drawers to have a bottom close button
drawers = ["RFQDrawer.jsx", "QuotationDrawer.jsx", "PaymentDrawer.jsx", "PurchaseOrderDrawer.jsx"]
close_btn_html = """
              <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <button className="vendor-btn-outline" onClick={onClose} style={{ width: '100%', padding: '12px' }}>
                  Close Sidebar
                </button>
              </div>
            </div>
          </div>"""

for drawer in drawers:
    path = os.path.join(src_dir, "vendor", "components", drawer)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Ensure we only replace once by checking if "Close Sidebar" is already there
        if "Close Sidebar" not in content:
            content = content.replace(
                "            </div>\n          </div>\n        )}",
                close_btn_html + "\n        )}"
            )
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)

print("Updated drawers with close buttons and fixed CSS")
