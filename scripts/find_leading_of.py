# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
data = json.load(open('oxford_5000_verified.json', encoding='utf-8'))

print("=== FIND ALL MEANINGS WITH '(of)' AT START ===")
for it in data:
    for m in it.get('meanings', []):
        t = m.get('translation', '')
        if t.startswith('(of)'):
            print(f"[{it['word']:12}] POS: {m['partOfSpeech']:10} | ID: {m['id']} | Trans: {repr(t)}")
