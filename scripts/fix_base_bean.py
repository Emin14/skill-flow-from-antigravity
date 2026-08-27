# -*- coding: utf-8 -*-
import json, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

for item in oxford_data:
    if item['word'] == 'base':
        for p in item.get('phrases', []):
            if p['phrase'] == "to be off one's base":
                p['translation'] = "ошибаться; свихнуться, сойти с ума"
                p['register'] = ["американизм", "разговорное"]
                p['partOfSpeech'] = "verb"
                
    if item['word'] == 'bean':
        for p in item.get('phrases', []):
            if p['phrase'] == "to give smb. beans":
                p['translation'] = "задать кому-либо перцу; наказать, побить кого-либо"
                p['register'] = ["разговорное"]
                p['partOfSpeech'] = "verb"

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Fixed base and bean phrases!")
