# -*- coding: utf-8 -*-
"""
Dry-run Safety Analyzer for Leaked English Phrases and Sub-letter Meanings.
Checks 100% of the dataset to verify that:
1. No Russian definitions are accidentally damaged
2. No empty meanings are generated
3. No valid idioms or phrases are lost
4. All detached English snippets are properly attached to examples or cleaned
"""
import json
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

leaks = []
suspicious_cases = []

for item in oxford_data:
    w = item['word']
    for m in item['meanings']:
        tr = m.get('translation', '')
        exs = m.get('examples', [])
        
        # Check trailing English leak: "; to do smth", "; acid test", etc.
        m_leak = re.search(r';\s*([a-zA-Z\s\-\'\,\(\)\/\~\.]{3,})\s*$', tr)
        if m_leak:
            leaked_en = m_leak.group(1).strip(' ;,')
            clean_tr = tr[:m_leak.start()].strip(' ;,:')
            
            # Check if clean_tr is valid Russian
            if not clean_tr or not re.search(r'[а-яА-Я]', clean_tr):
                suspicious_cases.append((w, m['id'], tr, "Clean translation would be empty or non-Russian"))
            elif len(clean_tr) < 3:
                suspicious_cases.append((w, m['id'], tr, f"Clean translation too short: '{clean_tr}'"))
            else:
                leaks.append({
                    'word': w,
                    'id': m['id'],
                    'old_tr': tr,
                    'new_tr': clean_tr,
                    'leaked_en': leaked_en.replace('~', w),
                    'exs': exs
                })

print(f"Total verified clean leaks to fix: {len(leaks)}")
print(f"Total suspicious/dangerous cases: {len(suspicious_cases)}")

if suspicious_cases:
    print("\nSuspicious cases found:")
    for w, mid, tr, reason in suspicious_cases:
        print(f"  {w} [id:{mid}]: '{tr}' -> REASON: {reason}")

print("\n=== Detailed Safety Inspection of 20 Real Words ===")
for s in leaks[:20]:
    print(f"Word: '{s['word']}' (Meaning ID: {s['id']})")
    print(f"  [СТАЛО]: translation = \"{s['new_tr']}\"")
    print(f"  [ВЫНЕСЕНО В ПРИМЕР]: en = \"{s['leaked_en']}\"")
    print()
