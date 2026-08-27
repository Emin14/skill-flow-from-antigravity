# -*- coding: utf-8 -*-
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))

leaks = []
for item in oxford:
    w = item['word']
    for m in item['meanings']:
        tr = m['translation']
        # Check if english phrase leaked at the end of translation
        if re.search(r';\s*(?:to\s+[a-zA-Z]|by\s+[a-zA-Z]|in\s+[a-zA-Z]|[a-zA-Z\s\-\']{3,})\s*$', tr):
            m_leak = re.search(r';\s*([a-zA-Z\s\-\'\,\(\)\~]{3,})\s*$', tr)
            if m_leak:
                leaks.append((w, m['id'], tr, m_leak.group(1)))

print(f'Found {len(leaks)} leaked english phrases in translation strings:')
for w, mid, tr, lk in leaks[:25]:
    print(f'{w} [id:{mid}]: "{tr}" (leaked: "{lk}")')
