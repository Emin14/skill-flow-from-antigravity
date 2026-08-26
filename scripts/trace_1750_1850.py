# -*- coding: utf-8 -*-
import json
import re
import sys
import time

sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

from trace_1000_2000 import process_single_entry

for i in range(1750, 1850):
    w = data[i]['word']
    t0 = time.time()
    res = process_single_entry(data[i])
    dt = time.time() - t0
    print(f"#{i} '{w}': {len(res['meanings'])} meanings ({dt:.3f}s)")
