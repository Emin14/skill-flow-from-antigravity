# -*- coding: utf-8 -*-
import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

with open("oxford_5000.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for item in data:
    if item["word"] == "crush":
        print(f"=== CRUSH ({len(item['meanings'])} meanings) ===")
        for m in item["meanings"]:
            print(f"  #{m['id']} ({m['partOfSpeech']}): {repr(m['translation'])}")
            for ex in m.get("examples", []):
                print(f"     • EN: {ex['en']} | RU: {ex['ru']}")
