import os

base_dir = r"c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src"

# --- VENDOR PORTAL ---
vendor_app = os.path.join(base_dir, "vendor", "VendorApp.jsx")
with open(vendor_app, "r", encoding="utf-8") as f:
    v_app = f.read()
if "ReconciliationPage" not in v_app:
    v_app = v_app.replace("import RFQsPage from './pages/RFQsPage';", "import RFQsPage from './pages/RFQsPage';\nimport ReconciliationPage from './pages/ReconciliationPage';")
    v_app = v_app.replace("<Route path=\"rfqs\" element={<RFQsPage />} />", "<Route path=\"rfqs\" element={<RFQsPage />} />\n            <Route path=\"reconciliation\" element={<ReconciliationPage />} />")
    with open(vendor_app, "w", encoding="utf-8") as f:
        f.write(v_app)

vendor_side = os.path.join(base_dir, "vendor", "components", "VendorSidebar.jsx")
with open(vendor_side, "r", encoding="utf-8") as f:
    v_side = f.read()
if "/vendor/reconciliation" not in v_side:
    v_side = v_side.replace("import { Home, Package, FileText, User } from 'lucide-react';", "import { Home, Package, FileText, User, FileSpreadsheet } from 'lucide-react';")
    v_side = v_side.replace("label: 'My Profile' }", "label: 'My Profile' },\n  { to: '/vendor/reconciliation', icon: FileSpreadsheet, label: 'Statements & Reco' }")
    with open(vendor_side, "w", encoding="utf-8") as f:
        f.write(v_side)

# --- CUSTOMER PORTAL ---
cust_app = os.path.join(base_dir, "customer", "CustomerApp.jsx")
with open(cust_app, "r", encoding="utf-8") as f:
    c_app = f.read()
if "ReconciliationPage" not in c_app:
    c_app = c_app.replace("import OrdersPage from './pages/OrdersPage';", "import OrdersPage from './pages/OrdersPage';\nimport ReconciliationPage from './pages/ReconciliationPage';")
    c_app = c_app.replace("<Route path=\"orders\" element={<OrdersPage />} />", "<Route path=\"orders\" element={<OrdersPage />} />\n            <Route path=\"reconciliation\" element={<ReconciliationPage />} />")
    with open(cust_app, "w", encoding="utf-8") as f:
        f.write(c_app)

cust_side = os.path.join(base_dir, "customer", "components", "CustomerSidebar.jsx")
with open(cust_side, "r", encoding="utf-8") as f:
    c_side = f.read()
if "/customer/reconciliation" not in c_side:
    c_side = c_side.replace("import { Home, Package, FileText, Leaf, Shield } from 'lucide-react';", "import { Home, Package, FileText, Leaf, Shield, FileSpreadsheet } from 'lucide-react';")
    c_side = c_side.replace("label: 'Sustainability Reports' }", "label: 'Sustainability Reports' },\n  { to: '/customer/reconciliation', icon: FileSpreadsheet, label: 'Statements & Reco' }")
    with open(cust_side, "w", encoding="utf-8") as f:
        f.write(c_side)

# --- ADMIN PORTAL ---
admin_app = os.path.join(base_dir, "admin", "AdminApp.jsx")
with open(admin_app, "r", encoding="utf-8") as f:
    a_app = f.read()
if "ReconciliationsManager" not in a_app:
    a_app = a_app.replace("import VendorApprovalsManager from './pages/operations/VendorApprovalsManager';", "import VendorApprovalsManager from './pages/operations/VendorApprovalsManager';\nimport ReconciliationsManager from './pages/operations/ReconciliationsManager';")
    a_app = a_app.replace("<Route path=\"operations/approvals\" element={<VendorApprovalsManager />} />", "<Route path=\"operations/approvals\" element={<VendorApprovalsManager />} />\n                      <Route path=\"operations/reconciliations\" element={<ReconciliationsManager />} />")
    with open(admin_app, "w", encoding="utf-8") as f:
        f.write(a_app)

admin_side = os.path.join(base_dir, "admin", "components", "Sidebar.jsx")
with open(admin_side, "r", encoding="utf-8") as f:
    a_side = f.read()
if "/admin/operations/reconciliations" not in a_side:
    a_side = a_side.replace("icon: Briefcase, label: 'Vendor Approvals' },", "icon: Briefcase, label: 'Vendor Approvals' },\n        { to: '/admin/operations/reconciliations', icon: FileSpreadsheet, label: 'Quarterly Reconciliations' },")
    a_side = a_side.replace("import { Home, Layers, Settings, LogOut, Package, MapPin, Briefcase } from 'lucide-react';", "import { Home, Layers, Settings, LogOut, Package, MapPin, Briefcase, FileSpreadsheet } from 'lucide-react';")
    with open(admin_side, "w", encoding="utf-8") as f:
        f.write(a_side)

print("Routes injected.")
