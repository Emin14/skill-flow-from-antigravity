# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
import json

with open('primary_evaluation_1000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Let's find diverse examples:
# 1. Polysemous word (noun + verb)
# 2. Word where Intersection leaves 0 primaries (fails)
# 3. Word where Union adds too many (bloat)
# 4. Word where Smart Hybrid is perfect
# 5. Advanced C1 word

samples = []
for d in data:
    w = d['word']
    pos = d['pos']
    ideal = d['ideal_meanings']
    cld = d['cld_formatted']
    sam = d['sam_formatted']
    union = d['union_formatted']
    inter = d['intersection_formatted']
    hybrid = d['smart_hybrid_formatted']
    
    # Check for polysemous
    if w in ['book', 'light', 'run', 'court', 'bank', 'break', 'spring', 'board', 'charge', 'matter', 'order', 'face', 'sign', 'post', 'state', 'mind', 'train', 'plant', 'touch']:
        samples.append(d)

print(f"Found {len(samples)} polysemous sample words. First 10:")
for s in samples[:8]:
    print('='*75)
    print(f"СЛОВО: {s['word'].upper()} ({s['pos']})")
    print(f"  [ИДЕАЛ]: {', '.join(s['ideal_meanings'])}")
    print(f"  [1. Только CLD]: {', '.join(s['cld_formatted'][:5])}")
    print(f"  [2. Только Sam]: {', '.join(s['sam_formatted'][:5])}")
    print(f"  [3. Union (CLD OR Sam)]: {', '.join(s['union_formatted'][:5])}")
    print(f"  [4. Inter (CLD AND Sam)]: {', '.join(s['intersection_formatted'][:5])}")
    print(f"  [5. Smart Hybrid]: {', '.join(s['smart_hybrid_formatted'][:5])}")

