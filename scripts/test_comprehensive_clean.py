# -*- coding: utf-8 -*-
"""
Simulation: Comprehensive POS Propagation, False Phrases Migration, and English Leaks Isolation.
"""
import json, re, sys, copy
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
parsed_index_path = 'scripts/parsed_index.json'

with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

with open(parsed_index_path, 'r', encoding='utf-8') as f:
    parsed_index = json.load(f)

from parse_utils import POS_MAP, REGISTER_MAP

PHRASAL_PARTICLES = {
    'in', 'out', 'up', 'down', 'off', 'on', 'away', 'back', 'by', 
    'over', 'through', 'about', 'across', 'ahead', 'along', 'around', 
    'forth', 'forward', 'into', 'onto', 'to', 'together', 'under', 
    'apart', 'aside', 'behind', 'between', 'round'
}

def clean_ocr_text(t):
    if not t:
        return ""
    t = re.sub(r'([А-Яа-яA-Za-z])-\s*≅?\s*([а-яa-z])', r'\1\2', t)
    t = t.replace('≅', '').replace('\xad', '').replace('\u00ad', '').replace('\ue000', '')
    t = re.sub(r'\.\s+\.\s+\.', '...', t)
    t = re.sub(r'^\s*[\.\,\;\:]+\s*', '', t)
    t = re.sub(r'\s*[\,\;\:]+\s*$', '', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def fix_pos_propagation_for_item(item):
    new_item = copy.deepcopy(item)
    w = item['word']
    meanings = new_item.get('meanings', [])
    
    # Propagate last known valid POS forward
    current_pos = None
    for m in meanings:
        pos = m.get('partOfSpeech')
        if pos and pos != 'other':
            current_pos = pos
        elif pos == 'other' and current_pos:
            m['partOfSpeech'] = current_pos
            
    # If still other and has 1 meaning, guess from Oxford POS or raw text
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    raw_text = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_text = parsed_index[k][0].get('text', '')
            break
            
    if not current_pos and raw_text:
        m_pos = re.search(r'\b(n|v|a|adv|prep|cj|int|pron|num)\b', raw_text)
        if m_pos:
            detected = POS_MAP.get(m_pos.group(1), 'noun')
            for m in meanings:
                if m.get('partOfSpeech') == 'other':
                    m['partOfSpeech'] = detected
                    
    return new_item

def fix_english_leaks_in_meanings(item):
    new_item = copy.deepcopy(item)
    for m in new_item.get('meanings', []):
        tr = m.get('translation', '')
        # Check pattern: e.g. "to have smb. on the carpet давать нагоняй кому-либо"
        m_lead_to = re.match(r'^(to\s+[a-zA-Z\s\-\'\,\(\)\/\.\~]+?)\s+([а-яА-Я].*)$', tr)
        if m_lead_to:
            ex_en = m_lead_to.group(1).replace('~', item['word']).strip(' ;,')
            ex_ru = m_lead_to.group(2).strip(' ;,')
            m['translation'] = ex_ru
            if not m.get('examples'):
                m['examples'] = []
            m['examples'].append({'en': ex_en, 'ru': ex_ru})
            
        # Check multiple semicolons with "to ..."
        # e.g. "to appeal to the fact ссылаться на факт; to appeal to reason апеллировать к здравому смыслу"
        if 'to ' in tr and ';' in tr and re.search(r'\bto\s+[a-z]{3,}\s+[а-яА-Я]', tr):
            parts = [p.strip() for p in tr.split(';') if p.strip()]
            new_trs = []
            new_exs = list(m.get('examples', []))
            for p in parts:
                m_part = re.match(r'^(?:or\s+)?(to\s+[a-zA-Z\s\-\'\,\(\)\/\.\~]+?)\s+([а-яА-Я].*)$', p)
                if m_part:
                    p_en = m_part.group(1).replace('~', item['word']).strip(' ;,')
                    p_ru = m_part.group(2).strip(' ;,')
                    new_trs.append(p_ru)
                    new_exs.append({'en': p_en, 'ru': p_ru})
                else:
                    new_trs.append(p)
            if new_trs:
                m['translation'] = '; '.join(new_trs)
                m['examples'] = new_exs
                
    return new_item

def fix_false_phrases(item):
    """
    If a word has phrases but in raw text it has NO ♦ and NO ¬,
    check if the phrases are actually regular examples (like 'accessible to bribery', 'adjustment in direction').
    If they are regular examples, merge them back into meanings[].examples!
    """
    new_item = copy.deepcopy(item)
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    raw_text = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_text = parsed_index[k][0].get('text', '')
            break
            
    if not new_item.get('phrases'):
        return new_item
        
    has_diamond = '♦' in raw_text
    has_phrasal = ('¬' in raw_text or '­ ~' in raw_text)
    
    # If word has genuine diamonds or phrasal verbs, keep phrases
    if has_diamond or has_phrasal:
        return new_item
        
    # Otherwise, evaluate phrases
    kept_phrases = []
    for p in new_item['phrases']:
        p_text = p.get('phrase', '')
        # Check if it is a genuine phrasal verb: e.g. "bail out"
        tokens = p_text.lower().split()
        if len(tokens) == 2 and tokens[0] == clean_w and tokens[1] in PHRASAL_PARTICLES:
            kept_phrases.append(p)
            continue
        if len(tokens) >= 2 and tokens[0] == 'to' and tokens[1] == clean_w and len(tokens) >= 3 and tokens[2] in PHRASAL_PARTICLES:
            kept_phrases.append(p)
            continue
            
        # It's an example (like 'accessible to bribery', 'admission by ticket')
        # Add to first meaning's examples
        if new_item.get('meanings'):
            target_meaning = new_item['meanings'][0]
            if not target_meaning.get('examples'):
                target_meaning['examples'] = []
            target_meaning['examples'].append({
                'en': p_text,
                'ru': p.get('translation', '')
            })
            
    for idx, p in enumerate(kept_phrases, start=1):
        p['id'] = idx
        
    if kept_phrases:
        new_item['phrases'] = kept_phrases
    else:
        if 'phrases' in new_item:
            del new_item['phrases']
            
    return new_item

print("Testing transformations on dataset...")
simulated = []
for item in oxford_data:
    it = fix_pos_propagation_for_item(item)
    it = fix_english_leaks_in_meanings(it)
    it = fix_false_phrases(it)
    simulated.append(it)

# Audit simulated results
other_count = sum(1 for item in simulated for m in item['meanings'] if m.get('partOfSpeech') == 'other')
leak_count = sum(1 for item in simulated for m in item['meanings'] if re.search(r'\bto\s+[a-z]{3,}\s+[a-z]{3,}', m.get('translation', ''), re.I))
false_phrase_count = 0
for item in simulated:
    w = item['word']
    clean_w = re.sub(r'[1-9]$', '', w.lower())
    raw_text = ""
    for k in [w.lower(), f"{w.lower()} i", f"{w.lower()} ii", clean_w]:
        if k in parsed_index and parsed_index[k]:
            raw_text = parsed_index[k][0].get('text', '')
            break
    if item.get('phrases') and '♦' not in raw_text and '¬' not in raw_text and '­ ~' not in raw_text:
        false_phrase_count += 1

print(f"\n=== Results of Simulation ===")
print(f"partOfSpeech == 'other': {other_count} (Was 1346)")
print(f"English phrase leaks: {leak_count} (Was 27)")
print(f"Words with false phrases without diamond/phrasal: {false_phrase_count} (Was 101)")

# Inspect action, accessible, appeal, carpet
print("\n=== Word: action ===")
action_sim = next(x for x in simulated if x['word'] == 'action')
for m in action_sim['meanings'][:6]:
    print(f"  [{m['id']}] ({m['partOfSpeech']}) {m['translation']}")

print("\n=== Word: accessible ===")
acc_sim = next(x for x in simulated if x['word'] == 'accessible')
print(f"  Meanings ({len(acc_sim['meanings'])}):")
for m in acc_sim['meanings']:
    print(f"    [{m['id']}] ({m['partOfSpeech']}) {m['translation']} | exs: {m.get('examples')}")
print(f"  Has phrases: {'phrases' in acc_sim}")

print("\n=== Word: appeal ===")
appeal_sim = next(x for x in simulated if x['word'] == 'appeal')
for m in appeal_sim['meanings']:
    if 'прибегать' in m['translation'] or 'ссылаться' in m['translation']:
        print(f"  [{m['id']}] ({m['partOfSpeech']}) {m['translation']} | exs: {m.get('examples')}")
