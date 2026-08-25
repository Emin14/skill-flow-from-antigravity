# -*- coding: utf-8 -*-
import json
import sys
import re

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

with open("oxford_5000.json", "r", encoding="utf-8") as f:
    data = json.load(f)

cyr_in_en = []
empty_ru = []
for item in data:
    w = item["word"]
    for m in item.get("meanings", []):
        m_id = m.get("id")
        for ex_idx, ex in enumerate(m.get("examples", [])):
            en = ex.get("en", "")
            ru = ex.get("ru", "")
            if re.search(r"[а-яА-ЯёЁ]", en):
                cyr_in_en.append({
                    "word": w,
                    "meaning_id": m_id,
                    "ex_idx": ex_idx,
                    "en": en,
                    "ru": ru,
                    "trans": m.get("translation", "")
                })
            elif not ru:
                empty_ru.append({
                    "word": w,
                    "meaning_id": m_id,
                    "ex_idx": ex_idx,
                    "en": en,
                    "ru": ru,
                    "trans": m.get("translation", "")
                })

print(f"Total occurrences of Cyrillic in ex.en: {len(cyr_in_en)}")
print(f"Total occurrences of empty ru: {len(empty_ru)}")
print("\nFirst 40 cases of Cyrillic in ex.en:")
for c in cyr_in_en[:40]:
    print(f"Word: {c['word']} [#{c['meaning_id']}]")
    print(f"  EN: {repr(c['en'])}")
    print(f"  RU: {repr(c['ru'])}")
    print(f"  TRANS: {repr(c['trans'])}")
    print("---")
