import os
import re

def fix_file(filepath, replacements):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()
    for p, r in replacements:
        c = re.sub(p, r, c)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(c)

src_dir = r"c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src"

# AuthContext.jsx
auth_ctx = os.path.join(src_dir, "admin", "context", "AuthContext.jsx")
with open(auth_ctx, 'r', encoding='utf-8') as f:
    c = f.read()
# move checkAuth up
c = c.replace("  useEffect(() => {\n    checkAuth();\n  }, []);\n\n  const checkAuth = async () => {", "  const checkAuth = async () => {")
c = c.replace("  };\n\n  const login = async (credentials) => {", "  };\n\n  useEffect(() => {\n    checkAuth();\n  }, []);\n\n  const login = async (credentials) => {")
c = c.replace("const { success, error } = useToast();", "const { success } = useToast();")
with open(auth_ctx, 'w', encoding='utf-8') as f:
    f.write(c)

# ToastContext.jsx
toast = os.path.join(src_dir, "admin", "context", "ToastContext.jsx")
fix_file(toast, [
    (r"import \{ createContext", "/* eslint-disable react-refresh/only-export-components */\nimport { createContext")
])

# Dashboard.jsx
dash = os.path.join(src_dir, "admin", "pages", "Dashboard.jsx")
fix_file(dash, [
    (r"// eslint-disable-next-line react-hooks/exhaustive-deps\n  useEffect\(\(\) => \{ loadDashboardData\(\); \}, \[\]\);", "useEffect(() => {\n    // eslint-disable-next-line react-hooks/set-state-in-effect\n    loadDashboardData();\n  }, []);")
])

# HeroEditor.jsx
hero = os.path.join(src_dir, "admin", "pages", "cms", "HeroEditor.jsx")
fix_file(hero, [
    (r"// eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect\n  useEffect\(\(\) => \{\n    loadData\(\);\n  \}, \[\]\);", "useEffect(() => {\n    // eslint-disable-next-line react-hooks/set-state-in-effect\n    loadData();\n  }, []);")
])

# Hero.jsx
herocomp = os.path.join(src_dir, "components", "Hero.jsx")
fix_file(herocomp, [
    (r"setRevenue\(\d+\);", "")
])

# EnquiriesManager.jsx - warnings cleanup
enq = os.path.join(src_dir, "admin", "pages", "crm", "EnquiriesManager.jsx")
fix_file(enq, [
    (r"// eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect\n  useEffect\(\(\) => \{ loadEnquiries\(\); \}, \[loadEnquiries\]\);", "useEffect(() => {\n    // eslint-disable-next-line react-hooks/set-state-in-effect\n    loadEnquiries();\n  }, [loadEnquiries]);"),
    (r"// eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect\n  useEffect\(\(\) => \{ applyFilters\(\); \}, \[applyFilters\]\);", "useEffect(() => {\n    // eslint-disable-next-line react-hooks/set-state-in-effect\n    applyFilters();\n  }, [applyFilters]);")
])

# ApplicationsManager.jsx - warnings cleanup
app_mgr = os.path.join(src_dir, "admin", "pages", "crm", "ApplicationsManager.jsx")
fix_file(app_mgr, [
    (r"// eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect\n  useEffect\(\(\) => \{ load\(\); \}, \[load\]\);", "useEffect(() => {\n    // eslint-disable-next-line react-hooks/set-state-in-effect\n    load();\n  }, [load]);")
])

# ProductsManager.jsx - warnings cleanup
prod_mgr = os.path.join(src_dir, "admin", "pages", "cms", "ProductsManager.jsx")
fix_file(prod_mgr, [
    (r"// eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect\n  useEffect\(\(\) => \{ loadProducts\(\); \}, \[loadProducts\]\);", "useEffect(() => {\n    // eslint-disable-next-line react-hooks/set-state-in-effect\n    loadProducts();\n  }, [loadProducts]);")
])

print("Done")
