# -*- coding: utf-8 -*-
"""
Analyze the entire oxford dataset and compare with parsed_index to find
exactly how many words still have truncated multi-POS or missing phrases.
"""
import json, os, sys, re
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

parsed_index = json.load(open('scripts/parsed_index.json', 'r', encoding='utf-8'))

# List of already rebuilt words in recent batches
rebuilt_words = set([
    'measure',
    'account', 'advance', 'anchor', 'balance', 'board', 'book', 'call', 'clear', 'close', 'fall',
    'act', 'air', 'arm', 'back', 'bear', 'beat', 'box', 'care', 'case', 'cast',
    'catch', 'cause', 'charge', 'check', 'cook', 'cost', 'cover', 'cross', 'cry', 'cure',
    'cut', 'deal', 'demand', 'design', 'desire', 'die', 'doubt', 'draw', 'dress', 'drink',
    'drop', 'end', 'escape', 'excuse', 'face', 'fear', 'feel', 'fight', 'figure', 'fill'
])

candidates = []

for item in oxford_data:
    w = item['word']
    if w in rebuilt_words:
        continue
    
    # Check if raw text for this word has "2. v" or "2. n" or "2. a" or "¬" or "♦"
    raw_texts = []
    if w in parsed_index:
        raw_texts.extend([e.get('text', '') for e in parsed_index[w]])
    else:
        for k in parsed_index:
            if k == w or k.startswith(w + ' ') or k.startswith(w + '1') or k.startswith(w + '2'):
                raw_texts.extend([e.get('text', '') for e in parsed_index[k]])
    
    combined_raw = '\n'.join(raw_texts)
    
    # Check indicators of multi-part or phrases in raw text
    has_pos_2 = bool(re.search(r'\b2\.\s*(?:v|n|a|adv)\b', combined_raw))
    has_phrasal = '¬' in combined_raw
    has_idioms = '♦' in combined_raw
    
    # Check current json state
    current_poses = set(m['partOfSpeech'] for m in item.get('meanings', []))
    current_phrases_count = len(item.get('phrases', []))
    
    # Is it incomplete?
    # If raw has 2. v / 2. n but JSON only has 1 POS, or raw has lots of phrases but JSON has 0
    needs_work = False
    reasons = []
    if has_pos_2 and len(current_poses) < 2:
        needs_work = True
        reasons.append("multi_pos_missing")
    if (has_phrasal or has_idioms) and current_phrases_count == 0 and len(combined_raw) > 200:
        needs_work = True
        reasons.append("phrases_missing")
    
    if needs_work:
        candidates.append({
            "word": w,
            "reasons": reasons,
            "raw_len": len(combined_raw),
            "current_meanings": len(item.get('meanings', [])),
            "current_phrases": current_phrases_count
        })

print(f"Total words in dataset: {len(oxford_data)}")
print(f"Words already perfectly rebuilt in deep batches: {len(rebuilt_words)}")
print(f"Remaining candidates needing multi-POS / phrase reconstruction: {len(candidates)}")

# Print by priority (longest raw text / high frequency rank)
candidates.sort(key=lambda x: x['raw_len'], reverse=True)
print("\nTop 30 remaining priority words:")
for i, c in enumerate(candidates[:30]):
    print(f"{i+1:2d}. {c['word']:15s} (reasons: {', '.join(c['reasons'])}, raw_len: {c['raw_len']}, cur_meanings: {c['current_meanings']}, cur_phrases: {c['current_phrases']})")
