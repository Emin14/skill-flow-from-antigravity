# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
ox_orig = json.load(open('oxford_5000.json', encoding='utf-8'))
ox_upd = json.load(open('oxford_5000_updated.json', encoding='utf-8'))

for idx in [2175, 2176, 2614, 2615, 2616, 2816, 2817, 4734, 4735, 4908, 4909, 4910, 4911]:
    o = ox_orig[idx]
    u = ox_upd[idx]
    print(f"Index {idx}:")
    print(f"  ORIG: word={o.get('word')}, cefr={o.get('cefr')}, phon_br={o.get('phon_br')}, freq={o.get('frequency_rank')}, lists={o.get('lists')}, pos_in_meanings={[m.get('partOfSpeech') for m in o.get('meanings', [])]}")
    print(f"  UPD:  word={u.get('word')}, cefr={u.get('cefr')}, phon_br={u.get('phon_br')}, freq={u.get('frequency_rank')}, lists={u.get('lists')}, num_meanings={len(u.get('meanings', []))}")
