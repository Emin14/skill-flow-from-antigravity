# -*- coding: utf-8 -*-
import json
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

with open("oxford_5000.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for item in data:
    w = item["word"]
    for m in item.get("meanings", []):
        trans = m.get("translation", "")
        if "втискивать" in trans or "смять" in trans:
            print(f"=== FOUND in {w} #{m.get('id')} ===")
            print("  TRANS:", repr(trans))
            for ex in m.get("examples", []):
                print(f"    EX: {ex.get('en')} -> {ex.get('ru')}")
    if w == "argue":
        print(f"=== ARGUE ({len(item.get('meanings', []))} meanings) ===")
        for m in item.get("meanings", []):
            print(f"  #{m.get('id')} ({m.get('partOfSpeech')}): {m.get('translation')}")
            for ex in m.get("examples", []):
                print(f"     • EN: {ex.get('en')} | RU: {ex.get('ru')}")
