import os, re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
missing_refs = []
for hf in sorted(html_files):
    with open(hf, 'r', encoding='utf-8') as f:
        content = f.read()
    for m in re.finditer(r'(?:src|href)="(?!http)([^"]+)"', content):
        ref = m.group(1)
        if ref.startswith(('#', 'mailto:', 'tel:', 'javascript:')):
            continue
        if '#' in ref:
            ref = ref.split('#')[0]
        if '?' in ref:
            ref = ref.split('?')[0]
        if not ref:
            continue
        if not os.path.exists(ref):
            missing_refs.append((hf, ref))

for hf, ref in missing_refs:
    print(f'{hf}: MISSING -> {ref}')
if not missing_refs:
    print('All local file references exist.')
