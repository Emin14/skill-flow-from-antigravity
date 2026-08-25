# -*- coding: utf-8 -*-
import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(".").resolve()
OXFORD_PATH = ROOT / "oxford_5000.json"

with open(OXFORD_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Loaded {len(data)} words.")

# 1. Inspect glued phrasal verbs (~ word) inside translation
tilde_cases = []
for item in data:
    w = item["word"]
    for m in item.get("meanings", []):
        trans = m.get("translation", "")
        if re.search(r'\b[а-яА-ЯёЁ]+\s+~\s+[a-zA-Z]+', trans) or re.search(r'~\s+[a-zA-Z]+', trans):
            tilde_cases.append((w, m["id"], trans))

print(f"\n1. Glued Phrasal verbs in translation ({len(tilde_cases)}):")
for item in tilde_cases[:20]:
    print(f"  {item[0]} [#{item[1]}]: {item[2]}")

# 2. Inspect government patterns (e.g. (with, against — с; on, about — о))
gov_cases = []
for item in data:
    w = item["word"]
    for m in item.get("meanings", []):
        trans = m.get("translation", "")
        if re.search(r'\([a-zA-Z\s,;—–-]+—\s*[а-яА-ЯёЁ\s,;]+\)', trans) or re.search(r'\([a-zA-Z\s,]+—', trans):
            gov_cases.append((w, m["id"], trans))

print(f"\n2. Government notes with em-dash in translation ({len(gov_cases)}):")
for item in gov_cases[:20]:
    print(f"  {item[0]} [#{item[1]}]: {item[2]}")

# 3. Inspect other English annotations in parentheses: (to), (of), (for), (refl.), etc.
latin_paren_cases = []
for item in data:
    w = item["word"]
    for m in item.get("meanings", []):
        trans = m.get("translation", "")
        matches = re.findall(r'\([a-zA-Z\s.,;]+\)', trans)
        if matches:
            latin_paren_cases.append((w, m["id"], trans, matches))

print(f"\n3. Latin annotations in parentheses ({len(latin_paren_cases)}):")
for item in latin_paren_cases[:20]:
    print(f"  {item[0]} [#{item[1]}]: {item[2]} --> {item[3]}")
