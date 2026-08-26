# -*- coding: utf-8 -*-
import json
import re
import sys
import time

sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

from debug_refiner import process_single_entry

for i in range(1000, 2000):
    w = data[i]['word']
    t0 = time.time()
    res = process_single_entry(data[i])
    dt = time.time() - t0
    if dt > 0.05:
        print(f"Word #{i} '{w}' took {dt:.3f}s")
    if i % 100 == 0:
        print(f"Reached #{i} '{w}'")
