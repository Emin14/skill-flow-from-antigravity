# -*- coding: utf-8 -*-
"""
Universal Plural Normalizer (Rule 6.4).
Converts all raw 'pl' notations into standardized prefixes:
- 'pl' -> 'при англ. мн. ч.: '
- '(обыкн. pl)' / 'обыкн. pl' -> 'обыкн. при англ. мн. ч.: '
- '(собир. pl)' / 'собир. pl' / 'pl собир.' -> 'собир. при англ. мн. ч.: '
- '(часто pl)' / 'часто pl' -> 'часто при англ. мн. ч.: '
- '(преим. pl)' / 'преим. pl' -> 'преим. при англ. мн. ч.: '
- '(редк. pl)' / 'редк. pl' -> 'редк. при англ. мн. ч.: '
- '(pl без измен.)' -> 'без измен. при англ. мн. ч.: '
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

def normalize_pl_string(text):
    orig = text
    text = text.strip()
    
    # 1. Patterns with prefixes
    patterns = [
        # (обыкн. pl) or обыкн. pl
        (r'^\(?обыкн\.\s*pl\)?\s*[:;,\-\s]*', 'обыкн. при англ. мн. ч.: '),
        # (собир. pl) or собир. pl or pl собир. or (pl собир.)
        (r'^\(?собир\.\s*pl\)?\s*[:;,\-\s]*', 'собир. при англ. мн. ч.: '),
        (r'^\(?pl\s+собир\.\)?\s*[:;,\-\s]*', 'собир. при англ. мн. ч.: '),
        # (часто pl) or часто pl
        (r'^\(?часто\s*pl\)?\s*[:;,\-\s]*', 'часто при англ. мн. ч.: '),
        # (преим. pl) or преим. pl
        (r'^\(?преим\.\s*pl\)?\s*[:;,\-\s]*', 'преим. при англ. мн. ч.: '),
        # (редк. pl) or редк. pl or (редко pl)
        (r'^\(?редк[о\.]*\s*pl\)?\s*[:;,\-\s]*', 'редк. при англ. мн. ч.: '),
        # (the ~s) pl or (the ~s) or (the ~) pl
        (r'^\(?the\s*~s?\)?\s*pl\s*[:;,\-\s]*', 'при англ. мн. ч.: '),
        # (pl без измен.) or (pl обыкн. без измен.) or (pl тж. без измен.)
        (r'^\(?pl\s+(?:обыкн\.\s+|тж\.\s+)?без измен\.\)?\s*[:;,\-\s]*', 'без измен. при англ. мн. ч.: '),
        # (обыкн. pl the authorities)
        (r'^\(?обыкн\.\s*pl\s+the\s+[^)]+\)\s*', 'обыкн. при англ. мн. ч.: '),
        # (the ~s)
        (r'^\(the\s*~s\)\s*', 'при англ. мн. ч.: '),
        # standard ^pl or ^(pl) or ^pl.
        (r'^\(?pl\.?\)?\s*[:;,\-\s]*', 'при англ. мн. ч.: ')
    ]
    
    for pat, repl in patterns:
        if re.match(pat, text, re.I):
            text = re.sub(pat, repl, text, count=1, flags=re.I)
            break
            
    # Clean any double prefixes like "при англ. мн. ч.: при англ. мн. ч.: "
    text = re.sub(r'(?:при англ\. мн\. ч\.:\s*)+', 'при англ. мн. ч.: ', text)
    text = re.sub(r'(?:обыкн\. при англ\. мн\. ч\.:\s*)+', 'обыкн. при англ. мн. ч.: ', text)
    text = re.sub(r'(?:собир\. при англ\. мн\. ч\.:\s*)+', 'собир. при англ. мн. ч.: ', text)
    text = re.sub(r'(?:часто при англ\. мн\. ч\.:\s*)+', 'часто при англ. мн. ч.: ', text)
    
    return text.strip()

count_modified = 0
for item in oxford_data:
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        # Only process if pl is at or near the beginning (not inside English sentence or word like 'complete')
        if re.search(r'^\(?[a-я\.\s]*pl', tr, re.I):
            new_tr = normalize_pl_string(tr)
            if new_tr != tr:
                m['translation'] = new_tr
                count_modified += 1

print(f"Normalized {count_modified} meanings with standardized plural prefixes!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Saved oxford_5000_2026-08-27.json successfully!")
