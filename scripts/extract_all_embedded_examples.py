# -*- coding: utf-8 -*-
"""
Universal Embedded Example Extractor Engine:
1. Detects embedded English examples inside meanings.translation and phrases.translation.
2. Separates the pure Russian translation from the embedded examples.
3. Morphologically expands tildes in English examples.
4. Adds extracted examples into examples: [...] array.
5. Leaves translation completely clean.
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

def parse_embedded_example_segment(seg, base_word):
    # Matches English phrase + Russian translation
    # Example: "the train left (или jumped) the ~s поезд сошёл с рельсов"
    # Example: "to ~ one's purpose (или aim) достичь цели"
    # Example: "~ within 0. 001 mm с точностью до 0,001 мм"
    seg = seg.strip()
    
    # Try finding the split between English and Russian characters
    # Look for the first Russian word (3+ cyrillic letters not part of grammar notes like 'или')
    # Match: English part (letters, tildes, punctuation, 'или', 'тж.') followed by Russian text
    m = re.search(r'^(.*?)\s+([А-Яа-яЁё][А-Яа-яЁё\s,;—–\-\(\)\.≈\d/]+)$', seg)
    if m:
        en_part = m.group(1).strip()
        ru_part = m.group(2).strip()
        # Verify en_part has English or tilde
        if '~' in en_part or re.search(r'[a-zA-Z]{2,}', en_part):
            # Also check if en_part ends with grammar note, adjust if needed
            en_expanded = expand_tilde(en_part, base_word)
            # Clean OCR spaces in numbers: "0. 001" -> "0.001"
            en_expanded = re.sub(r'(\d+)\.\s+(\d+)', r'\1.\2', en_expanded)
            return {"en": en_expanded, "ru": ru_part}
    return None

def clean_meaning_translation(tr, base_word, existing_examples):
    orig_tr = tr
    tr = tr.strip()
    new_examples = list(existing_examples)
    
    # Protect special grammatical notes like "употр. перед...", "служило для..."
    if tr.startswith('употр.') or tr.startswith('служит для') or tr.startswith('вспомогательный глагол'):
        return tr, new_examples
        
    # Split by semicolon
    parts = re.split(r';\s*', tr)
    clean_parts = []
    
    for p in parts:
        p = p.strip()
        if not p: continue
        
        # Check if this part is an embedded example: contains '~' or starts with English phrase
        is_example = False
        if '~' in p:
            is_example = True
        elif re.match(r'^(?:to\s+|a\s+|an\s+|the\s+|in\s+|at\s+|on\s+|for\s+|with\s+|by\s+|from\s+)?[a-zA-Z]{2,}\s+[a-zA-Z]{2,}', p):
            # Check if there is Russian translation in this segment
            if re.search(r'[А-Яа-яЁё]{3,}', p):
                is_example = True
                
        if is_example:
            ex_obj = parse_embedded_example_segment(p, base_word)
            if ex_obj:
                # Check for duplicate
                if not any(e.get('en') == ex_obj['en'] for e in new_examples):
                    new_examples.append(ex_obj)
            else:
                clean_parts.append(p)
        else:
            clean_parts.append(p)
            
    new_tr = '; '.join(clean_parts).strip()
    new_tr = re.sub(r'^[.;,:,\-\s]+', '', new_tr).strip()
    new_tr = re.sub(r'[.;,:,\-\s]+$', '', new_tr).strip()
    
    # If translation became empty (the whole sense was an example without definition)
    if not new_tr and clean_parts:
        new_tr = '; '.join(clean_parts)
        
    return new_tr, new_examples

count_extracted = 0
for item in oxford_data:
    w = item['word']
    for m in item.get('meanings', []):
        tr = m.get('translation', '')
        exs = m.get('examples', [])
        new_tr, new_exs = clean_meaning_translation(tr, w, exs)
        if new_tr != tr or len(new_exs) != len(exs):
            m['translation'] = new_tr
            m['examples'] = new_exs
            count_extracted += 1
            
    for p in item.get('phrases', []):
        tr = p.get('translation', '')
        exs = p.get('examples', [])
        new_tr, new_exs = clean_meaning_translation(tr, w, exs)
        if new_tr != tr or len(new_exs) != len(exs):
            p['translation'] = new_tr
            p['examples'] = new_exs
            count_extracted += 1

print(f"Extracted embedded examples across {count_extracted} entries!")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Saved oxford_5000_2026-08-27.json successfully!")
