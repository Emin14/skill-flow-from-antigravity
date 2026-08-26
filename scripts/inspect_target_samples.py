# -*- coding: utf-8 -*-
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

print("=== Quality and Register Validation Across oxford_5000_updated_verified.json ===")

with open('oxford_5000_updated_verified.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total entries: {len(data)}")

total_meanings = 0
meanings_with_register = 0
phrases_count = 0
examples_count = 0
empty_meanings = 0
invalid_registers = 0

sample_check_targets = [
    'оправдывать (подсудимого)',
    'разряжать (аккумулятор)',
    'парень, малый',
    'хомутик, поводок',
    'плохо заряженный',
    'посланник; советник посольства',
    'считывание (информации)',
    'подвергать действию внешней силы',
    'гибридизация, скрещивание'
]

found_samples = {}

for item in data:
    w = item['word']
    meanings = item.get('meanings', [])
    phrases = item.get('phrases', [])
    
    if not meanings:
        empty_meanings += 1
        
    for m in meanings:
        total_meanings += 1
        tr = m.get('translation', '')
        regs = m.get('register', [])
        if regs:
            meanings_with_register += 1
            
        for tgt in sample_check_targets:
            if tgt in tr:
                found_samples[tgt] = (w, m['id'], tr, regs)
                
        for ex in m.get('examples', []):
            examples_count += 1
            
    for p in phrases:
        phrases_count += 1

print(f"Total words: {len(data)}")
print(f"Total meanings: {total_meanings}")
print(f"Meanings with structured 'register' field: {meanings_with_register}")
print(f"Total phrases (phrasal verbs & idioms): {phrases_count}")
print(f"Total examples: {examples_count}")
print(f"Empty meanings words: {empty_meanings}")

print("\n=== Verification of User Target Samples ===")
for tgt, info in found_samples.items():
    print(f"\n[Word: {info[0]}] meaning id={info[1]}")
    print(f"  translation: {repr(info[2])}")
    print(f"  register:    {info[3]}")
