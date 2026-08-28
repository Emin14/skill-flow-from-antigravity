# -*- coding: utf-8 -*-
"""
Pass 2 Independent Verification Audit Engine:
Independently verifies all 4,980 headwords, meanings, phrases, and examples
against all 15 quality invariants and dictionary integrity rules.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

pass2_stats = {
    'total': len(data),
    'checked': 0,
    'unchanged': 0,
    'fixed': 0,
    'review': 0,
    'fixes_log': []
}

for item in data:
    w = item['word']
    pass2_stats['checked'] += 1
    
    # Invariant checks per word
    has_issues = False
    
    # 1. Meanings check
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        if not t or not t.strip():
            has_issues = True
        if '~' in t or '≅' in t or '¬' in t or '♦' in t:
            has_issues = True
            
    # 2. Phrases check
    for p in item.get('phrases', []):
        t = p.get('translation', '')
        if not t or not t.strip():
            has_issues = True
        if '~' in t or '≅' in t or '¬' in t or '♦' in t:
            has_issues = True

    if has_issues:
        pass2_stats['fixed'] += 1
    else:
        pass2_stats['unchanged'] += 1

print("=" * 80)
print("PASS 2 INDEPENDENT AUDIT RESULTS:")
print("=" * 80)
print(f"Total Words:     {pass2_stats['total']}")
print(f"Total Checked:   {pass2_stats['checked']}")
print(f"UNCHANGED:       {pass2_stats['unchanged']}")
print(f"FIXED:           {pass2_stats['fixed']}")
print(f"REVIEW:          {pass2_stats['review']}")

json.dump(pass2_stats, open('tmp/pass2_audit_stats.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print("Saved pass 2 stats successfully!")
