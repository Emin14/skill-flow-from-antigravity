# -*- coding: utf-8 -*-
"""
Apply approximate equivalent sign ≈ (U+2248) to all corresponding idioms in oxford_5000_2026-08-27.json.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
parsed_index_path = 'scripts/parsed_index.json'

with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

with open(parsed_index_path, 'r', encoding='utf-8') as f:
    parsed_index = json.load(f)

# Update accident specifically
for item in oxford_data:
    if item['word'] == 'accident':
        for p in item.get('phrases', []):
            if 'accidents will happen' in p['phrase']:
                p['translation'] = "≈ в семье не без урода; скандал в благородном семействе"

# Check all other words with ≅ in raw parsed index
count_approx = 0
for item in oxford_data:
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    raw_text = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_text = parsed_index[k][0].get('text', '')
            break
    if not raw_text or '≅' not in raw_text:
        continue
        
    # Check phrases and meanings
    for p in item.get('phrases', []):
        p_clean = p['phrase'].replace(clean_w, '~').lower()
        if p_clean in raw_text.lower() or p['phrase'].lower() in raw_text.lower():
            # Check if ≅ is near this phrase in raw_text
            pattern = re.escape(p['phrase'].split()[0]) + r'.*?≅\s*([^;\n]+)'
            m_approx = re.search(pattern, raw_text, re.I | re.DOTALL)
            if m_approx and not p['translation'].startswith('≈'):
                p['translation'] = "≈ " + p['translation'].lstrip('≈ ')
                count_approx += 1

print(f"Applied ≈ equivalent marker to phrases across dataset!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Saved oxford_5000_2026-08-27.json successfully!")
