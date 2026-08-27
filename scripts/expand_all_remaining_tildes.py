# -*- coding: utf-8 -*-
"""
Expand all parenthetical tildes inside translation strings across all 4980 words.
Example: 'авизо (тж. letter of ~)' -> 'авизо (тж. letter of advice)'
Example: 'важная персона, «шишка» (тж. big ~)' -> 'важная персона, «шишка» (тж. big cheese)'
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

def expand_tilde(text, base_word):
    stem = re.sub(r"[1-9]$", "", base_word).strip()
    y_stem = stem[:-1] if stem.endswith("y") and len(stem) > 1 and stem[-2] not in "aeiou" else stem
    e_stem = stem[:-1] if stem.endswith("e") else stem
    replacements = [
        ("~est", stem + "est"),
        ("~er", stem + "er"),
        ("~ies", y_stem + "ies"),
        ("~ied", y_stem + "ied"),
        ("~ing", e_stem + "ing"),
        ("~ed", e_stem + "ed"),
        ("~d", e_stem + "d"),
        ("~s", y_stem + "ies" if stem.endswith("y") and len(stem) > 1 and stem[-2] not in "aeiou" else stem + "s"),
        ("~'s", stem + "'s"),
        ("~", stem),
    ]
    for pattern, repl in replacements:
        text = text.replace(pattern, repl)
    return text

count_expanded = 0
for item in oxford_data:
    w = item['word']
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        if '~' in tr:
            new_tr = expand_tilde(tr, w)
            if new_tr != tr:
                m['translation'] = new_tr
                count_expanded += 1
                
    for p in item.get('phrases', []):
        tr = p.get('translation', '')
        if '~' in tr:
            new_tr = expand_tilde(tr, w)
            if new_tr != tr:
                p['translation'] = new_tr
                count_expanded += 1

print(f"Expanded tildes across {count_expanded} translation strings!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Saved oxford_5000_2026-08-27.json successfully!")
