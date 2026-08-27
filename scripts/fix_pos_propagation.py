# -*- coding: utf-8 -*-
"""
POS Propagation and Cleanup for multi-part entries like doctor, essay, living, etc.
"""
import json
import re
import sys
import copy

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

# Fix doctor
for item in oxford_data:
    if item['word'] == 'doctor':
        for m in item['meanings']:
            if m['id'] in [6, 7, 8, 9, 10]:
                m['partOfSpeech'] = 'verb'
    if item['word'] == 'living':
        for m in item['meanings']:
            if m['id'] in [9, 10, 11, 12, 13, 14]:
                m['partOfSpeech'] = 'noun'
    if item['word'] == 'quote':
        for m in item['meanings']:
            if m['id'] in [4]:
                m['partOfSpeech'] = 'noun'
    if item['word'] == 'essay':
        for m in item['meanings']:
            if m['id'] in [4]:
                m['partOfSpeech'] = 'verb'
    if item['word'] == 'fare':
        for m in item['meanings']:
            if m['id'] in [4, 5]:
                m['partOfSpeech'] = 'verb'

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Doctor, living, quote, essay POS updated successfully!")
