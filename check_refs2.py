import os, re

html_files = sorted([f for f in os.listdir('.') if f.endswith('.html')])
for hf in html_files:
    with open(hf, 'r', encoding='utf-8') as f:
        content = f.read()
    # Check img src
    for m in re.finditer(r'<img[^>]+src="(?!http|#)([^"]+)"', content):
        ref = m.group(1)
        if not os.path.exists(ref):
            print(f'{hf}: MISSING IMG -> {ref}')
    # Check link href (CSS, favicon) - skip mailto, http, # anchors
    for m in re.finditer(r'<link[^>]+href="(?!http|#|mailto)([^"]+)"', content):
        ref = m.group(1)
        if '?' in ref:
            ref = ref.split('?')[0]
        if not os.path.exists(ref):
            print(f'{hf}: MISSING LINK -> {ref}')
    # Check script src
    for m in re.finditer(r'<script[^>]+src="(?!http)([^"]+)"', content):
        ref = m.group(1)
        if not os.path.exists(ref):
            print(f'{hf}: MISSING SCRIPT -> {ref}')
    # Check a href - only local file references with no anchors
    for m in re.finditer(r'<a[^>]+href="(?!http|#|mailto)([^"]+)"', content):
        ref = m.group(1)
        if '?' in ref:
            ref = ref.split('?')[0]
        if '#' in ref:
            ref = ref.split('#')[0]
        if ref and not os.path.exists(ref):
            print(f'{hf}: MISSING LINK -> {ref}')
