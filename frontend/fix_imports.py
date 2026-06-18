import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    content = re.sub(r'^import\s+React\s+from\s+[\'\"]react[\'\"];?\n?', '', content, flags=re.MULTILINE)
    content = re.sub(r'^import\s+React\s*,\s*\{\s*', 'import { ', content, flags=re.MULTILINE)
    
    if original != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

for root, dirs, files in os.walk(r'c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))
