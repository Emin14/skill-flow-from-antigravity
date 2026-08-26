# -*- coding: utf-8 -*-
import json
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

print("=== Scanning for grammatical cross-reference cuts (compar, superl, pp, past, pt, pl, см) ===")
gram_issues = []
for it in data:
    w = it['word']
    for m in it.get('meanings', []):
        m_id = m['id']
        t = m.get('translation', '')
        exs = m.get('examples', [])
        
        # Check if translation ends with 'от' or 'см' or 'в'
        if re.search(r'\b(compar|superl|pp|past|pt|pl|см|см\.)\s+от\s*$', t) or t in ['см', 'см.', 'от', 'compar от', 'superl от', 'pp от', 'past от']:
            gram_issues.append((w, m_id, t, exs))
        # Check if examples contain fake grammatical targets like 'much II -> и'
        for ex in exs:
            if re.search(r'\b(much|many|good|bad|little|far|bear|do|go|have|be)\s+(I|II|III|IV|\d+)\b', ex.get('en', '')):
                gram_issues.append((w, m_id, f"Fake grammatical example: {ex['en']} -> {ex['ru']}", exs))

print(f"Found {len(gram_issues)} grammatical reference issues:")
for g in gram_issues:
    print(f"  Word: {g[0]} (id {g[1]}): {g[2]} | exs: {g[3]}")
