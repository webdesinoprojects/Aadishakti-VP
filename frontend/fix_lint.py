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

# 1. VendorApp.jsx - Syntax Error Fix
app_jsx = os.path.join(src_dir, "vendor", "VendorApp.jsx")
replace_in_file(app_jsx, r"if \(session\) \{\s*try \{\s*JSON\.parse\(session\);\s*isAuth = true;\s*\} catch\(e\) \{\}", r"if (session) {\n    try {\n      JSON.parse(session);\n      isAuth = true;\n    } catch(e) {}\n  }")

# 2. ApplicationsManager.jsx - load before declaration
app_mgr = os.path.join(src_dir, "admin", "pages", "crm", "ApplicationsManager.jsx")
with open(app_mgr, 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r'useEffect\(\(\) => \{ load\(\); \}, \[\]\);\n', '', content)
# insert it after const load = async () => { ... };
# Actually we can just find "const load = async" and insert the useEffect after it ends.
# But it's simpler to just change the functions to regular function definitions so they are hoisted.
content = re.sub(r'const load = async \(\) =>', 'async function load()', content)
content = re.sub(r'const remove = async \(\) =>', 'async function remove()', content)
content = re.sub(r'const updateStatus = async \(id, newStatus\) =>', 'async function updateStatus(id, newStatus)', content)
with open(app_mgr, 'w', encoding='utf-8') as f:
    f.write(content)

# 3. EnquiriesManager.jsx - loadEnquiries before declaration
enq_mgr = os.path.join(src_dir, "admin", "pages", "crm", "EnquiriesManager.jsx")
with open(enq_mgr, 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r'const loadEnquiries = async \(\) =>', 'async function loadEnquiries()', content)
content = re.sub(r'const applyFilters = \(\) =>', 'function applyFilters()', content)
content = re.sub(r'const updateStatus = async \(id, newStatus\) =>', 'async function updateStatus(id, newStatus)', content)
with open(enq_mgr, 'w', encoding='utf-8') as f:
    f.write(content)

# 4. AnnouncementBar.jsx - Empty block
ann_bar = os.path.join(src_dir, "components", "AnnouncementBar.jsx")
replace_in_file(ann_bar, r"\} catch \(err\) \{\s*\}", r"} catch (err) { /* ignore */ }")

# 5. Careers.jsx - Loader2 unused
careers = os.path.join(src_dir, "components", "Careers.jsx")
replace_in_file(careers, r"Loader2,\s*", "")

# 6. Contact.jsx - Mail, Phone, Loader2 unused
contact = os.path.join(src_dir, "components", "Contact.jsx")
replace_in_file(contact, r"Mail,\s*", "")
replace_in_file(contact, r"Phone,\s*", "")
replace_in_file(contact, r"Loader2,\s*", "")

# 7. Footer.jsx - React not defined
footer = os.path.join(src_dir, "components", "Footer.jsx")
replace_in_file(footer, r"<React\.Fragment>", "<>")
replace_in_file(footer, r"</React\.Fragment>", "</>")

# 8. Header.jsx - darkMode unused
header = os.path.join(src_dir, "components", "Header.jsx")
replace_in_file(header, r", darkMode, setDarkMode", "")

# 9. Hero.jsx - revenue unused
hero = os.path.join(src_dir, "components", "Hero.jsx")
replace_in_file(hero, r"const \{ revenue \} = useCms\(\);", "const cmsData = useCms();") # Just something valid

# 10. Navbar.jsx - React not defined, unused eslint-disable
navbar = os.path.join(src_dir, "components", "Navbar.jsx")
replace_in_file(navbar, r"// eslint-disable-next-line react-hooks/set-state-in-effect\n\s*", "")
replace_in_file(navbar, r"<React\.Fragment>", "<>")
replace_in_file(navbar, r"</React\.Fragment>", "</>")

# 11. PageHero.jsx - React unused
page_hero = os.path.join(src_dir, "components", "PageHero.jsx")
replace_in_file(page_hero, r"import React from 'react';\n", "")

# 12. Products.jsx - ArrowRight unused
products = os.path.join(src_dir, "components", "Products.jsx")
replace_in_file(products, r"import \{ ArrowRight \} from \"lucide-react\";\n", "")

# 13. Businesses.jsx - Link unused
businesses = os.path.join(src_dir, "pages", "Businesses.jsx")
replace_in_file(businesses, r"import \{ Link, useLocation \} from \"react-router-dom\";", "import { useLocation } from \"react-router-dom\";")

# 14. Home.jsx - React unused
home = os.path.join(src_dir, "pages", "Home.jsx")
replace_in_file(home, r"import React from 'react';\n", "")
