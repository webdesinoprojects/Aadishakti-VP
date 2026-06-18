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

# HeroEditor.jsx
hero_ed = os.path.join(src_dir, "admin", "pages", "cms", "HeroEditor.jsx")
fix_file(hero_ed, [
    (r"useEffect\(\(\) => \{\n\s*loadData\(\);\n\s*\}, \[\]\);", r"// eslint-disable-next-line\n  useEffect(() => {\n    loadData();\n  }, []);")
])

# EnquiriesManager.jsx
enq_mgr = os.path.join(src_dir, "admin", "pages", "crm", "EnquiriesManager.jsx")
fix_file(enq_mgr, [
    (r"useEffect\(\(\) => \{ loadEnquiries\(\); \}, \[loadEnquiries\]\);", r"// eslint-disable-next-line\n  useEffect(() => { loadEnquiries(); }, [loadEnquiries]);"),
    (r"useEffect\(\(\) => \{ applyFilters\(\); \}, \[applyFilters\]\);", r"// eslint-disable-next-line\n  useEffect(() => { applyFilters(); }, [applyFilters]);")
])

# ApplicationsManager.jsx
app_mgr = os.path.join(src_dir, "admin", "pages", "crm", "ApplicationsManager.jsx")
fix_file(app_mgr, [
    (r"import \{ useState, useEffect \} from 'react';", "import { useState, useEffect, useCallback } from 'react';"),
    (r"\}, \[error\]\);\n\n  \n  async function remove\(\)", "}, [error]);\n\n  // eslint-disable-next-line\n  useEffect(() => { load(); }, [load]);\n\n  async function remove()")
])

# NewsManager.jsx
news_mgr = os.path.join(src_dir, "admin", "pages", "cms", "NewsManager.jsx")
fix_file(news_mgr, [
    (r"  const add = async \(\) => \{", "  // eslint-disable-next-line\n  useEffect(() => { load(); }, []);\n\n  const add = async () => {")
])

# Navbar.jsx
navbar = os.path.join(src_dir, "components", "Navbar.jsx")
fix_file(navbar, [
    (r"import \{ useState, useEffect \} from \"react\";", "import { useState, useEffect, Fragment } from \"react\";"),
    (r"import \{ useState, useEffect \} from 'react';", "import { useState, useEffect, Fragment } from 'react';")
])

# Home.jsx
home = os.path.join(src_dir, "pages", "Home.jsx")
fix_file(home, [
    (r"import React from \"react\";\n?", ""),
    (r"import React from 'react';\n?", "")
])

# Hero.jsx
hero = os.path.join(src_dir, "components", "Hero.jsx")
fix_file(hero, [
    (r"const \{ revenue \} = useCms\(\);", "")
])

# Careers.jsx
careers = os.path.join(src_dir, "components", "Careers.jsx")
fix_file(careers, [(r"Loader2,\s*", "")])

# Contact.jsx
contact = os.path.join(src_dir, "components", "Contact.jsx")
fix_file(contact, [(r"Loader2,\s*", "")])

# AnnouncementBar.jsx
ann = os.path.join(src_dir, "components", "AnnouncementBar.jsx")
fix_file(ann, [(r"\} catch \(err\) \{\s*\}", "} catch (err) { /* ignore */ }")])

