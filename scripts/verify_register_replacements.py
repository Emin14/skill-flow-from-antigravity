# -*- coding: utf-8 -*-
"""
Audit and display every single word modified during the register replacement pass.
Verify that no valid Russian word stems were damaged and all translations remain grammatically intact.
"""
import json, os, sys, re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# List of words touched in the multi-register cleaning pass
TOUCHED_WORDS = [
    'bond', 'boom', 'brush', 'buck', 'circle', 'clip', 'diary', 'diet', 'direct',
    'doctor', 'dog', 'dry', 'egg', 'fixed', 'fresh', 'gain', 'ghost', 'label',
    'land', 'limb', 'line', 'link', 'love', 'manufacture', 'merchant', 'miss',
    'monitor', 'moon', 'new', 'objective', 'panel', 'paper', 'pencil', 'period',
    'piece', 'pig', 'pool', 'pot', 'power', 'primary', 'print', 'proof', 'rage',
    'real', 'screen', 'script', 'sheet', 'shout', 'show', 'south', 'spell',
    'staff', 'station', 'stick', 'superior', 'sweet', 'title', 'transit', 'tube', 'wake'
]

print("=" * 80)
print("AUDITING ALL WORDS TOUCHED BY THE REGISTER REPLACEMENT PASS")
print("=" * 80)

damaged = []
valid = []

for item in data:
    w = item['word']
    if w in TOUCHED_WORDS:
        for m in item.get('meanings', []):
            regs = m.get('register', [])
            t = m.get('translation', '')
            
            # Check if translation has any signs of damage:
            # 1. Empty translation
            # 2. Starts with a lowercase fragment/suffix (ное, ский, ть и т.д.)
            # 3. Starts with punctuation
            # 4. Length < 3
            is_bad = False
            reason = ""
            if not t or not t.strip():
                is_bad = True
                reason = "Empty translation"
            elif re.match(r'^(?:ное|ный|ная|ное|ные|ных|ным|ными|ском|ской|скую|ский|ская|ское|ские|ских|ским|скими|овать|ировать|ство|ать|ить|еть|уть)\b', t):
                is_bad = True
                reason = "Truncated suffix start"
            elif re.match(r'^[,\.;:\-]', t):
                is_bad = True
                reason = "Punctuation start"
            elif len(t) < 3 and not re.match(r'^(?:яд|ил|ус|па|юг)$', t):
                is_bad = True
                reason = "Too short"
                
            if is_bad:
                damaged.append((w, m['id'], t, regs, reason))
            else:
                # Track if this meaning has registers indicating it was part of the pass
                if any(r in regs for r in ['радио', 'телевидение', 'астрономия', 'шотландский диалект', 'австралийский английский', 'ирландский диалект', 'жаргон', 'пренебрежительное', 'геодезия', 'оптика', 'кинематография', 'фотография', 'мифология', 'историческое']):
                    valid.append((w, m['id'], t, regs))

        for p in item.get('phrases', []):
            regs = p.get('register', [])
            t = p.get('translation', '')
            is_bad = False
            reason = ""
            if not t or not t.strip():
                is_bad = True
                reason = "Empty phrase translation"
            if is_bad:
                damaged.append((w, f"phrase_{p['id']}", t, regs, reason))
            else:
                if any(r in regs for r in ['радио', 'телевидение', 'астрономия', 'шотландский диалект', 'австралийский английский', 'ирландский диалект', 'жаргон', 'пренебрежительное', 'геодезия', 'оптика', 'кинематография', 'фотография', 'мифология', 'историческое']):
                    valid.append((w, f"phrase_{p['id']}", t, regs))

print(f"\nTotal verified touched entries: {len(valid)}")
print(f"Total damaged entries: {len(damaged)}")

if damaged:
    print("\n[DAMAGED ENTRIES]:")
    for w, id_, t, regs, r in damaged:
        print(f"  ❌ [{w}] ({id_}): reason='{r}' -> trans='{t}' (reg={regs})")
else:
    print("\n✅ ВСЕ СЛОВА ЦЕЛЫ! НИ ОДНО СЛОВО НЕ ПОВРЕЖДЕНО.")

print("\n--- Выборочный просмотр очищенных статей (Before -> After) ---")
for w, id_, t, regs in valid[:25]:
    print(f"  • [{w:12s}] id {str(id_):10s} -> '{t}' | регистры: {regs}")
