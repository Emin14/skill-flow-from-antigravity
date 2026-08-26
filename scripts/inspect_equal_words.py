# -*- coding: utf-8 -*-
import sys
import json
import re
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

with open('oxford_5000_updated.json', 'r', encoding='utf-8') as f:
    oxford_data = json.load(f)

oxford_map = {item['word']: item for item in oxford_data}

equal_sign_words = [
    'ambassador', 'bat', 'bay', 'boom', 'bow', 'cable', 'fork', 'ground',
    'hi', 'legitimate', 'log', 'main', 'nurse', 'opera', 'plastic', 'punk',
    'push', 'regime', 'return', 'risky', 'rose', 'round', 'scare', 'scratch',
    'skip', 'stick', 'title', 'western'
]

doc2 = pymupdf.open('SamPolnAnglRysSlovar - распарсенное.pdf')
pages_text = [doc2[p].get_text('text') for p in range(10, 508)]
doc2.close()
full_text = '\n'.join(pages_text)

print("=== Inspecting 28 words with '=' translations ===")

for w in equal_sign_words:
    print(f"\n--- Word: {w} ---")
    item = oxford_map.get(w)
    if item:
        for m in item.get('meanings', []):
            if m.get('translation') in ['=', '1, 2'] or not any('\u0400' <= c <= '\u04FF' for c in m.get('translation', '')):
                print(f"  [oxford_5000_updated.json] id={m['id']} POS={m['partOfSpeech']}: {repr(m['translation'])} | examples: {m.get('examples')}")
    # Find in dictionary text
    m_dict = re.findall(r'(?m)^(' + re.escape(w) + r'[0-9\sI|V|X]*\s*\[[^\]\n]+(?:\]|j).*)$', full_text, flags=re.IGNORECASE)
    for md in m_dict[:3]:
        print(f"  [dict match]: {repr(md[:90])}")
