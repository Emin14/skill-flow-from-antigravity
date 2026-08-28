# -*- coding: utf-8 -*-
"""
Deep Diagnostic and Repair for the specific error classes from user examples:
1. Smashed phrasal verbs / multi-numbered dumps (e.g. in 'send', 'set', etc.)
2. Orphaned English leading phrases in translation (e.g. 'of smth.; ...')
3. Chopped Russian beginnings in translation, examples.ru, phrases (e.g. 'ната', 'огий', 'сбивать (с но; 4)')
4. Embedded idioms in translations (e.g. 'after (или in) a sort; ...')
5. Hanging unfinished brackets/notes (e.g. '[см. тж', '; часто')
6. Orphaned opening/closing brackets at start of translation
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

print("=" * 80)
print("DIAGNOSING THE 7 ERROR PATTERNS FROM USER EXAMPLES")
print("=" * 80)

# Pattern 1: Multi-numbered dumps in translations or examples (e.g. '1) ... 2) ... 2) ... 3) ...')
p1_smashed_dumps = []

# Pattern 2: Leading English fragments in translation (e.g. 'of smth.; ...', 'to smth.; ...')
p2_leading_english = []

# Pattern 3: Chopped Russian word beginnings in translations, examples, phrases
p3_chopped_beginnings = []

# Pattern 4: Embedded English idioms in translation (e.g. 'after (или in) a sort; ...')
p4_embedded_idioms = []

# Pattern 5: Hanging brackets/cross references at end of translation (e.g. '[см. тж', '; часто')
p5_hanging_ends = []

# Pattern 6: Orphaned opening/closing brackets at start of translation (e.g. 'to — к чему-либо);')
p6_orphaned_brackets = []

for item in data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m.get('translation', '')
        
        # P1: Smashed multiple numbered dumps
        if re.search(r'\b1\)\s*.*?\b2\)\s*.*?\b2\)\s*', t) or re.search(r'\b2\)\s*.*?\b3\)\s*.*?\b4\)\s*.*?\b2\)\s*', t):
            p1_smashed_dumps.append((w, 'meaning', m['id'], t))
            
        # P2: Leading English fragments
        if re.match(r'^(?:of|to|for|in|with|on|at|by|from|about|against|into)\s+(?:smb\.|smth\.|the\s+\w+)\s*[;:,]\s*', t):
            p2_leading_english.append((w, 'meaning', m['id'], t))
            
        # P3: Chopped beginnings
        if re.match(r'^(?:ната|огий|огая|огие|огих|огим|огими|ь\s+на|с\s+но;\s*4|сбивать\s+\(с\s+но)\b', t):
            p3_chopped_beginnings.append((w, 'meaning', m['id'], t))
            
        # P4: Embedded idioms with 'after (или in)...', 'in (или on)...', 'to [en] [ru]'
        if re.search(r';\s*(?:after|in|on|at|by|to|for|with|of)\s*\((?:или\s+)?(?:in|on|at|by|to|for|with|of|[a-zA-Z\s]+)\)\s+[a-zA-Z\s]+\s*;\s*[\u0400-\u04FF]', t):
            p4_embedded_idioms.append((w, 'meaning', m['id'], t))
            
        # P5: Hanging brackets
        if re.search(r'(?:\[см\.?|\[см\.?\s*тж|\(см\.?\s*тж|;\s*часто|\[часто|\(часто)\s*$', t):
            p5_hanging_ends.append((w, 'meaning', m['id'], t))
            
        # P6: Orphaned brackets at start
        if re.match(r'^[a-zA-Z\s,—\-]+\s*—\s*[\u0400-\u04FF\s,—\-]+\);\s*', t) or re.match(r'^[^\(]*?\)\s*;\s*', t):
            p6_orphaned_brackets.append((w, 'meaning', m['id'], t))
            
        for ex_idx, ex in enumerate(m.get('examples', [])):
            ru = ex.get('ru', '')
            if re.search(r'\b1\)\s*.*?\b2\)\s*.*?\b2\)\s*', ru) or re.search(r'\b2\)\s*.*?\b3\)\s*.*?\b4\)\s*.*?\b2\)\s*', ru):
                p1_smashed_dumps.append((w, 'meaning_ex', m['id'], ru))
            if re.match(r'^(?:ната|огий|огая|огие|огих|огим|огими|ь\s+на|с\s+но;\s*4|сбивать\s+\(с\s+но)\b', ru):
                p3_chopped_beginnings.append((w, 'meaning_ex', m['id'], ru))
            if re.search(r'(?:\[см\.?|\[см\.?\s*тж|\(см\.?\s*тж|;\s*часто|\[часто|\(часто)\s*$', ru):
                p5_hanging_ends.append((w, 'meaning_ex', m['id'], ru))

    for p in item.get('phrases', []):
        t = p.get('translation', '')
        if re.search(r'\b1\)\s*.*?\b2\)\s*.*?\b2\)\s*', t) or re.search(r'\b2\)\s*.*?\b3\)\s*.*?\b4\)\s*.*?\b2\)\s*', t):
            p1_smashed_dumps.append((w, 'phrase', p['id'], t))
        if re.match(r'^(?:of|to|for|in|with|on|at|by|from|about|against|into)\s+(?:smb\.|smth\.|the\s+\w+)\s*[;:,]\s*', t):
            p2_leading_english.append((w, 'phrase', p['id'], t))
        if re.match(r'^(?:ната|огий|огая|огие|огих|огим|огими|ь\s+на|с\s+но;\s*4|сбивать\s+\(с\s+но)\b', t):
            p3_chopped_beginnings.append((w, 'phrase', p['id'], t))
        if re.search(r'(?:\[см\.?|\[см\.?\s*тж|\(см\.?\s*тж|;\s*часто|\[часто|\(часто)\s*$', t):
            p5_hanging_ends.append((w, 'phrase', p['id'], t))
        if re.match(r'^[a-zA-Z\s,—\-]+\s*—\s*[\u0400-\u04FF\s,—\-]+\);\s*', t) or re.match(r'^[^\(]*?\)\s*;\s*', t):
            p6_orphaned_brackets.append((w, 'phrase', p['id'], t))
            
        for ex_idx, ex in enumerate(p.get('examples', [])):
            ru = ex.get('ru', '')
            if re.search(r'\b1\)\s*.*?\b2\)\s*.*?\b2\)\s*', ru):
                p1_smashed_dumps.append((w, 'phrase_ex', p['id'], ru))
            if re.match(r'^(?:ната|огий|огая|огие|огих|огим|огими|ь\s+на|с\s+но;\s*4|сбивать\s+\(с\s+но)\b', ru):
                p3_chopped_beginnings.append((w, 'phrase_ex', p['id'], ru))

print(f"Pattern 1 (Smashed multi-numbered dumps): {len(p1_smashed_dumps)}")
for item in p1_smashed_dumps:
    print(f"  P1: [{item[0]}] ({item[1]} {item[2]}): '{item[3][:120]}...'")

print(f"\nPattern 2 (Leading English fragments): {len(p2_leading_english)}")
for item in p2_leading_english:
    print(f"  P2: [{item[0]}] ({item[1]} {item[2]}): '{item[3]}'")

print(f"\nPattern 3 (Chopped beginnings): {len(p3_chopped_beginnings)}")
for item in p3_chopped_beginnings:
    print(f"  P3: [{item[0]}] ({item[1]} {item[2]}): '{item[3]}'")

print(f"\nPattern 4 (Embedded idioms): {len(p4_embedded_idioms)}")
for item in p4_embedded_idioms:
    print(f"  P4: [{item[0]}] ({item[1]} {item[2]}): '{item[3]}'")

print(f"\nPattern 5 (Hanging brackets / unfinished ends): {len(p5_hanging_ends)}")
for item in p5_hanging_ends:
    print(f"  P5: [{item[0]}] ({item[1]} {item[2]}): '{item[3]}'")

print(f"\nPattern 6 (Orphaned brackets at start): {len(p6_orphaned_brackets)}")
for item in p6_orphaned_brackets:
    print(f"  P6: [{item[0]}] ({item[1]} {item[2]}): '{item[3]}'")
