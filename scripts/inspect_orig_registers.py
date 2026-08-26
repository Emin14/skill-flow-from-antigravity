# -*- coding: utf-8 -*-
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    orig = json.load(f)

reg_count = 0
samples = []
for item in orig:
    for m in item.get('meanings', []):
        if m.get('register'):
            reg_count += 1
            if len(samples) < 20:
                samples.append((item['word'], m))

print(f"Total meanings with register in oxford_5000.json: {reg_count}")
for w, m in samples:
    print(f"[{w}] register={m.get('register')} | translation={repr(m.get('translation'))}")
