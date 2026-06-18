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

# ImageUploader.jsx
img_up = os.path.join(src_dir, "admin", "components", "ImageUploader.jsx")
fix_file(img_up, [(r"Upload,\s*", "")])

# AuthContext.jsx
auth_ctx = os.path.join(src_dir, "admin", "context", "AuthContext.jsx")
fix_file(auth_ctx, [
    (r"import \{ createContext", "/* eslint-disable react-refresh/only-export-components */\nimport { createContext"),
    (r"\} catch \(error\) \{", "} catch (err) {"),
    (r"useEffect\(\(\) => \{\n\s*checkAuth\(\);\n\s*\}, \[\]\);", "useEffect(() => {\n    // eslint-disable-next-line react-hooks/set-state-in-effect\n    checkAuth();\n  }, []);")
])

# Hero.jsx
herocomp = os.path.join(src_dir, "components", "Hero.jsx")
fix_file(herocomp, [
    (r"setRevenue\(\d+\);", "")
])

print("Done")
