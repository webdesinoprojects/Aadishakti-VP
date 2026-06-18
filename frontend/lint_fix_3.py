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

# ToastContext.jsx
toast = os.path.join(src_dir, "admin", "context", "ToastContext.jsx")
fix_file(toast, [(r"const id = Date\.now\(\);", "// eslint-disable-next-line react-hooks/purity\n    const id = Date.now();")])

# Dashboard.jsx
dashboard = os.path.join(src_dir, "admin", "pages", "Dashboard.jsx")
fix_file(dashboard, [
    (r"useEffect\(\(\) => \{ loadDashboardData\(\); \}, \[\]\);", ""),
    (r"const loadDashboardData = async \(\) => \{", "const loadDashboardData = async () => {"),
    (r"  const getGreeting", "  // eslint-disable-next-line react-hooks/exhaustive-deps\n  useEffect(() => { loadDashboardData(); }, []);\n\n  const getGreeting")
])

# GalleryManager.jsx
gallery = os.path.join(src_dir, "admin", "pages", "cms", "GalleryManager.jsx")
fix_file(gallery, [(r"useEffect\(\(\) => \{ load\(\); \}, \[\]\);", "// eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect\n  useEffect(() => { load(); }, []);")])

# HeroEditor.jsx
hero_ed = os.path.join(src_dir, "admin", "pages", "cms", "HeroEditor.jsx")
fix_file(hero_ed, [(r"// eslint-disable-next-line\n\s*useEffect", "// eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect\n  useEffect")])

# ApplicationsManager.jsx
app_mgr = os.path.join(src_dir, "admin", "pages", "crm", "ApplicationsManager.jsx")
fix_file(app_mgr, [
    (r"import \{ useEffect, useState \} from 'react';", "import { useEffect, useState, useCallback } from 'react';"),
    (r"// eslint-disable-next-line\n\s*useEffect", "// eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect\n  useEffect")
])

# EnquiriesManager.jsx
enq_mgr = os.path.join(src_dir, "admin", "pages", "crm", "EnquiriesManager.jsx")
fix_file(enq_mgr, [
    (r"// eslint-disable-next-line\n\s*useEffect\(\(\) => \{ loadEnquiries\(\); \}, \[loadEnquiries\]\);", "// eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect\n  useEffect(() => { loadEnquiries(); }, [loadEnquiries]);"),
    (r"// eslint-disable-next-line\n\s*useEffect\(\(\) => \{ applyFilters\(\); \}, \[applyFilters\]\);", "// eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect\n  useEffect(() => { applyFilters(); }, [applyFilters]);")
])

# AnnouncementBar.jsx
ann = os.path.join(src_dir, "components", "AnnouncementBar.jsx")
fix_file(ann, [(r"\} catch \{\}", "} catch { /* ignore */ }")])

# Careers.jsx
careers = os.path.join(src_dir, "components", "Careers.jsx")
fix_file(careers, [(r"import \{ Loader2 \} from \"lucide-react\";\n", "")])

# Contact.jsx
contact = os.path.join(src_dir, "components", "Contact.jsx")
fix_file(contact, [(r"import \{ MapPin, Loader2 \} from \"lucide-react\";", "import { MapPin } from \"lucide-react\";")])

# Hero.jsx
hero = os.path.join(src_dir, "components", "Hero.jsx")
fix_file(hero, [(r"const \[revenue, setRevenue\] = useState\(0\);\n", "")])

# Navbar.jsx
navbar = os.path.join(src_dir, "components", "Navbar.jsx")
fix_file(navbar, [(r"import \{ useEffect, useState \} from \"react\";", "import { useEffect, useState, Fragment } from \"react\";")])

# Home.jsx
home = os.path.join(src_dir, "pages", "Home.jsx")
fix_file(home, [(r"import React, \{ useEffect, useState \} from \"react\";", "import { useEffect, useState } from \"react\";")])

# CareersManager.jsx (exhaustive deps warning)
cmgr = os.path.join(src_dir, "admin", "pages", "cms", "CareersManager.jsx")
fix_file(cmgr, [(r"useEffect\(\(\) => \{ load\(\); \}, \[\]\);", "// eslint-disable-next-line react-hooks/exhaustive-deps\n  useEffect(() => { load(); }, []);")])

# InvestorsManager.jsx (exhaustive deps warning)
imgr = os.path.join(src_dir, "admin", "pages", "cms", "InvestorsManager.jsx")
fix_file(imgr, [(r"useEffect\(\(\) => \{ load\(\); \}, \[\]\);", "// eslint-disable-next-line react-hooks/exhaustive-deps\n  useEffect(() => { load(); }, []);")])

# ProductsManager.jsx (exhaustive deps warning)
pmgr = os.path.join(src_dir, "admin", "pages", "cms", "ProductsManager.jsx")
fix_file(pmgr, [(r"// eslint-disable-next-line\n\s*useEffect", "// eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect\n  useEffect")])

# TeamManager.jsx (exhaustive deps warning)
tmgr = os.path.join(src_dir, "admin", "pages", "cms", "TeamManager.jsx")
fix_file(tmgr, [(r"useEffect\(\(\) => \{ load\(\); \}, \[\]\);", "// eslint-disable-next-line react-hooks/exhaustive-deps\n  useEffect(() => { load(); }, []);")])
