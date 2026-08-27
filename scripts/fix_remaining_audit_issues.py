# -*- coding: utf-8 -*-
"""
Inspect and cleanly format words that have audit issues:
throw, tired, turn, value, etc.
"""
import json, os, sys, re
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = os.path.abspath('oxford_5000_2026-08-27.json')
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    w = item['word']
    for m in item.get('meanings', []):
        t = m['translation']
        # Replace ≅ with ≈
        t = t.replace('≅', '≈').replace(' . ', ' ').replace('..', '.')
        # If translation contains a phrasal verb dump like "throw about...", truncate to pure translation
        if re.search(r'\b(?:throw|turn|take|set|get|go|put|make|come|look|bring|keep)\s+(?:about|against|aside|away|back|down|in|off|on|out|over|round|to|up|upon)\b', t):
            # Split before the phrasal verb
            parts = re.split(r'\b(?:throw|turn|take|set|get|go|put|make|come|look|bring|keep)\s+(?:about|against|aside|away|back|down|in|off|on|out|over|round|to|up|upon)\b', t)
            t = parts[0].strip(' ;:,.-')
        # Clean detached letters like "ж) ... з) ..."
        t = re.sub(r'\s+[а-я]\)\s*', '; ', t)
        t = re.sub(r';;+', ';', t)
        t = re.sub(r'\s+', ' ', t).strip(' ;:,.-')
        m['translation'] = t
        
    for p in item.get('phrases', []):
        t = p['translation']
        t = t.replace('≅', '≈').replace(' . ', ' ').replace('..', '.')
        t = re.sub(r'\s+[а-я]\)\s*', '; ', t)
        t = re.sub(r';;+', ';', t)
        t = re.sub(r'\s+', ' ', t).strip(' ;:,.-')
        p['translation'] = t

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Audit issues cleaned successfully!")
