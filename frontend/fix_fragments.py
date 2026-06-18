import os

src_dir = r"c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src"

# Fix Navbar
navbar = os.path.join(src_dir, "components", "Navbar.jsx")
with open(navbar, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("</>", "</Fragment>")
with open(navbar, 'w', encoding='utf-8') as f:
    f.write(c)

# Fix Footer
footer = os.path.join(src_dir, "components", "Footer.jsx")
with open(footer, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("</>", "</Fragment>")
with open(footer, 'w', encoding='utf-8') as f:
    f.write(c)

# Fix NewsManager (I messed up the replace block)
news = os.path.join(src_dir, "admin", "pages", "cms", "NewsManager.jsx")
with open(news, 'r', encoding='utf-8') as f:
    c = f.read()
# Remove the existing useEffect
c = c.replace("useEffect(() => { load(); }, []);\n", "")
# Add it below load
c = c.replace("  };\n\n  const add = async () => {", "  };\n\n  useEffect(() => { load(); }, []);\n\n  const add = async () => {")
with open(news, 'w', encoding='utf-8') as f:
    f.write(c)

print("Done")
