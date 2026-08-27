# -*- coding: utf-8 -*-
import json, re, sys
sys.path.append('scripts')
from test_global_healing_dryrun import heal_dataset, oxford_data

simulated = heal_dataset(oxford_data)
for it in simulated:
    for m in it['meanings']:
        tr = m.get('translation', '')
        if re.search(r'\b\d+\.\s*(?:n|v|a|adv|prep|cj|int|pron|num)\b', tr):
            print(f"{it['word']} [id:{m['id']}]: \"{tr}\"")
