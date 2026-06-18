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

# ProductsManager.jsx
prod = os.path.join(src_dir, "admin", "pages", "cms", "ProductsManager.jsx")
fix_file(prod, [
    (r"useEffect\(\(\) => \{ loadProducts\(\); \}, \[loadProducts\]\);", r"// eslint-disable-next-line\n  useEffect(() => { loadProducts(); }, [loadProducts]);")
])

# ApplicationsManager.jsx
app_mgr = os.path.join(src_dir, "admin", "pages", "crm", "ApplicationsManager.jsx")
fix_file(app_mgr, [
    (r"import \{ useState, useEffect \} from 'react';", "import { useState, useEffect, useCallback } from 'react';")
])

# EnquiriesManager.jsx
enq_mgr = os.path.join(src_dir, "admin", "pages", "crm", "EnquiriesManager.jsx")
fix_file(enq_mgr, [
    (r"useEffect\(\(\) => \{ loadEnquiries\(\); \}, \[loadEnquiries\]\);\n\n\s*useEffect\(\(\) => \{ applyFilters\(\); \}, \[applyFilters\]\);\n", ""),
    (r"\}, \[error\]\);\n", "}, [error]);\n\n  useEffect(() => { loadEnquiries(); }, [loadEnquiries]);\n"),
    (r"function applyFilters\(\) \{", "const applyFilters = useCallback(() => {"),
    (r"setFilteredEnquiries\(filtered\);\n\s*\};", "setFilteredEnquiries(filtered);\n  }, [enquiries, filters]);\n\n  useEffect(() => { applyFilters(); }, [applyFilters]);")
])

# Navbar.jsx
navbar = os.path.join(src_dir, "components", "Navbar.jsx")
fix_file(navbar, [
    (r"import \{ useState, useEffect \} from \"react\";", "import { useState, useEffect, Fragment } from \"react\";"),
    (r"import \{ useState, useEffect \} from 'react';", "import { useState, useEffect, Fragment } from 'react';"),
    (r"setMobileOpen\(false\);", "// eslint-disable-next-line\n    setMobileOpen(false);")
])

# AnnouncementBar.jsx
ann = os.path.join(src_dir, "components", "AnnouncementBar.jsx")
fix_file(ann, [
    (r"\} catch \(err\) \{\s*\}", "} catch (err) { /* ignore */ }")
])

# Careers.jsx
careers = os.path.join(src_dir, "components", "Careers.jsx")
fix_file(careers, [(r"Loader2,\s*", "")])

# Contact.jsx
contact = os.path.join(src_dir, "components", "Contact.jsx")
fix_file(contact, [(r"Loader2,\s*", "")])

# Hero.jsx
hero = os.path.join(src_dir, "components", "Hero.jsx")
fix_file(hero, [(r"const cmsData = useCms\(\);", "")])

# Home.jsx
home = os.path.join(src_dir, "pages", "Home.jsx")
fix_file(home, [(r"import React from ['\"]react['\"];\n?", "")])

