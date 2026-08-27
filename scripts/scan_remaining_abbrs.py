# -*- coding: utf-8 -*-
"""
Scan for any remaining abbreviations ending with dot inside translations.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

# Collect all 2-6 letter words followed by dot at beginning of translation
abbrs = set()
found_items = []
for item in oxford_data:
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        # Check start of string for abbreviation
        m_start = re.match(r'^([а-яА-ЯёЁ]{2,6}\.)\s*', tr)
        if m_start:
            abbr = m_start.group(1)
            if abbr not in ['т.е.', 'т.к.', 'и.т.д.', 'и.т.п.']:
                abbrs.add(abbr)
                found_items.append((item['word'], m['id'], tr))

print(f"Remaining leading abbreviations found ({len(abbrs)}): {sorted(list(abbrs))}")
print(f"Total entries with leading abbreviations: {len(found_items)}")
for it in found_items[:15]:
    print(f"  {it[0]} [{it[1]}]: '{it[2]}'")
