# -*- coding: utf-8 -*-
import json
import random
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_updated.json', encoding='utf-8'))
random.seed(42)
sample = random.sample(data, 5)
for item in sample:
    print('========================================')
    print("WORD: %s (cefr: %s, meanings: %d)" % (item['word'], item.get('cefr'), len(item['meanings'])))
    print(json.dumps(item['meanings'][:3], ensure_ascii=False, indent=2))
