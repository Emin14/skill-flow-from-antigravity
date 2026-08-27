# -*- coding: utf-8 -*-
"""
Fix all leftover register abbreviations at the start of translations.
"""
import json, os, sys, re
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

from robust_dictionary_rebuilder import REGISTER_MAP

for item in oxford_data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        
        # Check every register abbrev at start of translation
        changed = True
        while changed:
            changed = False
            for abbrev, full in REGISTER_MAP.items():
                pat = r'^\s*(?:\()?' + re.escape(abbrev) + r'(?:\))?\s*(?:,\s*)?'
                match = re.match(pat, t)
                if match:
                    if full not in m['register']:
                        m['register'].append(full)
                    t = t[match.end():].strip(' ,;:-')
                    changed = True
                    
        # Remove trailing captured headword lines like "coach box ['kautjbnks] n кОзлы"
        t = re.sub(r'\s+[a-zA-Z-]+\s+(?:\[[^\]]+\]|[1-4]\.|\bI+\b).*$', '', t)
        # Remove trailing numbers like "briefcase 90"
        t = re.sub(r'\s+[a-z-]+\s+\d+$', '', t)
        t = re.sub(r'\s+', ' ', t).strip(' ,;:-')
        m['translation'] = t

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("All leftover register abbreviations cleaned!")
