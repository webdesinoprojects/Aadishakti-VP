import os
import re

def replace_in_file(filepath, pattern, replacement):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    content = re.sub(pattern, replacement, content, flags=re.MULTILINE)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

src_dir = r"c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src"

# 1. Navbar.jsx - Fragment
navbar = os.path.join(src_dir, "components", "Navbar.jsx")
replace_in_file(navbar, r"<React\.Fragment", "<Fragment")
replace_in_file(navbar, r"import \{ useState, useEffect \} from 'react';", "import { useState, useEffect, Fragment } from 'react';")

# 2. Footer.jsx - Fragment
footer = os.path.join(src_dir, "components", "Footer.jsx")
replace_in_file(footer, r"<React\.Fragment", "<Fragment")
replace_in_file(footer, r"import \{ Link \} from \"react-router-dom\";", "import { Link } from \"react-router-dom\";\nimport { Fragment } from \"react\";")

# 3. VendorApp.jsx - catch block and e
vendor_app = os.path.join(src_dir, "vendor", "VendorApp.jsx")
replace_in_file(vendor_app, r"\} catch\(e\) \{\}", "} catch { /* ignore */ }")
replace_in_file(vendor_app, r"const handleLogout = \(e\) => \{", "const handleLogout = () => {")

# 4. AnnouncementBar.jsx - Empty block
ann_bar = os.path.join(src_dir, "components", "AnnouncementBar.jsx")
replace_in_file(ann_bar, r"\} catch \(err\) \{\s*\}", "} catch (err) { /* ignore */ }")

# 5. PageHero.jsx and Home.jsx
page_hero = os.path.join(src_dir, "components", "PageHero.jsx")
replace_in_file(page_hero, r"import React from ['\"]react['\"];\n?", "")

home = os.path.join(src_dir, "pages", "Home.jsx")
replace_in_file(home, r"import React from ['\"]react['\"];\n?", "")

# 6. Hero.jsx
hero = os.path.join(src_dir, "components", "Hero.jsx")
replace_in_file(hero, r"const \{ revenue \} = useCms\(\);", "")

# 7. ApplicationsManager.jsx and EnquiriesManager.jsx - exhaustive deps
app_mgr = os.path.join(src_dir, "admin", "pages", "crm", "ApplicationsManager.jsx")
replace_in_file(app_mgr, r"import \{ useState, useEffect \} from 'react';", "import { useState, useEffect, useCallback } from 'react';")
replace_in_file(app_mgr, r"async function load\(\) \{", "const load = useCallback(async () => {")
replace_in_file(app_mgr, r"\}\s*async function remove\(\) \{", "}, []);\n\n  async function remove() {")
replace_in_file(app_mgr, r"useEffect\(\(\) => \{ load\(\); \}, \[\]\);", "useEffect(() => { load(); }, [load]);")

enq_mgr = os.path.join(src_dir, "admin", "pages", "crm", "EnquiriesManager.jsx")
replace_in_file(enq_mgr, r"import \{ useState, useEffect \} from 'react';", "import { useState, useEffect, useCallback } from 'react';")
replace_in_file(enq_mgr, r"async function loadEnquiries\(\) \{", "const loadEnquiries = useCallback(async () => {")
replace_in_file(enq_mgr, r"\}\s*function applyFilters\(\) \{", "}, []);\n\n  const applyFilters = useCallback(() => {")
replace_in_file(enq_mgr, r"\}\s*async function updateStatus\(id, newStatus\) \{", "}, [enquiries, filters]);\n\n  async function updateStatus(id, newStatus) {")
replace_in_file(enq_mgr, r"useEffect\(\(\) => \{\n\s*loadEnquiries\(\);\n\s*\}, \[\]\);", "useEffect(() => { loadEnquiries(); }, [loadEnquiries]);")
replace_in_file(enq_mgr, r"useEffect\(\(\) => \{\n\s*applyFilters\(\);\n\s*\}, \[enquiries, filters\]\);", "useEffect(() => { applyFilters(); }, [applyFilters]);")

# 8. ProductsManager.jsx - loadProducts
prod_mgr = os.path.join(src_dir, "admin", "pages", "cms", "ProductsManager.jsx")
replace_in_file(prod_mgr, r"import \{ useState, useEffect \} from 'react';", "import { useState, useEffect, useCallback } from 'react';")
replace_in_file(prod_mgr, r"const loadProducts = async \(\) => \{", "const loadProducts = useCallback(async () => {")
replace_in_file(prod_mgr, r"\}\s*;\s*const handleSave = async \(\) => \{", "}, []);\n\n  const handleSave = async () => {")
replace_in_file(prod_mgr, r"useEffect\(\(\) => \{\n\s*loadProducts\(\);\n\s*\}, \[\]\);", "useEffect(() => { loadProducts(); }, [loadProducts]);")

# 9. TeamManager.jsx - exhaustive deps
team_mgr = os.path.join(src_dir, "admin", "pages", "cms", "TeamManager.jsx")
replace_in_file(team_mgr, r"if \(error\) \{\s*const t = setTimeout\(\(\) => setError\(null\), 3000\);\s*return \(\) => clearTimeout\(t\);\s*\}", "if (error) { const t = setTimeout(() => setError(null), 3000); return () => clearTimeout(t); }")
replace_in_file(team_mgr, r"\}, \[error\]\);", "}, [error, setError]);")
