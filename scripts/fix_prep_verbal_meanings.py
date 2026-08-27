# -*- coding: utf-8 -*-
"""
Inspect and fix preposition definition vs collocational pattern examples.
"""
import json, re, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

oxford_path = 'oxford_5000_2026-08-27.json'
with open(oxford_path, 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

# Update about meaning 8
for item in oxford_data:
    if item['word'] == 'about':
        for m in item['meanings']:
            if m['id'] == 8 and m['partOfSpeech'] == 'preposition':
                m['translation'] = "при (себе), с (собой)"
                m['examples'] = [
                    {
                        "en": "to have smth. about one",
                        "ru": "иметь что-либо при себе, с собой"
                    },
                    {
                        "en": "I had all the documents about me",
                        "ru": "все документы были у меня с собой (или при мне, под рукой)"
                    }
                ]

# Inspect other prepositions where translation starts with a verb like "иметь", "быть", "делать"
verb_preps = []
for item in oxford_data:
    for m in item.get('meanings', []):
        if m.get('partOfSpeech') == 'preposition':
            tr = m.get('translation', '')
            if re.match(r'^(?:иметь|быть|делать|находиться|совершать|происходить)\b', tr):
                verb_preps.append((item['word'], m['id'], tr))

print(f"Prepositions with verbal translations: {len(verb_preps)}")
for vp in verb_preps:
    print(f"Word '{vp[0]}' [id:{vp[1]}]: '{vp[2]}'")

with open(oxford_path, 'w', encoding='utf-8') as f:
    json.dump(oxford_data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print("Updated oxford_5000_2026-08-27.json successfully!")
