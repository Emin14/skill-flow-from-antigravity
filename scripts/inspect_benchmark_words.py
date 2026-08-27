# -*- coding: utf-8 -*-
"""
Full Benchmark Inspection across diverse categories.
"""
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford = json.load(open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
by_word = {x['word']: x for x in oxford}

benchmark_words = [
    # Top verbs
    'get', 'take', 'make', 'go', 'turn', 'bring', 'look',
    # Top nouns with idioms
    'eye', 'hand', 'head', 'heart', 'foot', 'time',
    # Top adjectives
    'good', 'bad', 'high', 'hard', 'free',
    # Prepositions
    'in', 'on', 'at', 'by', 'under', 'against',
    # Homographs
    'can1', 'bear1', 'bear2', 'wind1', 'wind2', 'tear1', 'tear2'
]

print(f"Auditing {len(benchmark_words)} benchmark words...")
for w in benchmark_words:
    if w not in by_word:
        print(f"WARNING: {w} not found!")
        continue
    item = by_word[w]
    meanings = item.get('meanings', [])
    phrases = item.get('phrases', [])
    
    # Check POS diversity
    pos_set = set(m['partOfSpeech'] for m in meanings)
    print(f"=== Word: '{w}' ({item['cefr'].upper()}, rank {item['frequency_rank']}) ===")
    print(f"  Meanings: {len(meanings)} | POS types: {list(pos_set)} | Phrases: {len(phrases)}")
    
    # Print sample meanings
    for m in meanings[:2]:
        ex_str = f" [exs: {len(m.get('examples', []))}]" if m.get('examples') else ""
        reg_str = f" (reg: {m['register']})" if m.get('register') else ""
        print(f"    [{m['id']}] ({m['partOfSpeech']}) {m['translation'][:60]}{ex_str}{reg_str}")
        
    # Print sample phrases
    if phrases:
        for p in phrases[:2]:
            ex_str = f" [exs: {len(p.get('examples', []))}]" if p.get('examples') else ""
            reg_str = f" (reg: {p['register']})" if p.get('register') else ""
            print(f"    phr [{p['id']}] {p['phrase']} ({p['partOfSpeech']}): {p['translation'][:60]}{ex_str}{reg_str}")
    print()
