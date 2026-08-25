# -*- coding: utf-8 -*-
"""
Deep verification of the entire oxford_5000.json dataset.
"""

import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(".").resolve()
OXFORD_PATH = ROOT / "oxford_5000.json"
APP_OXFORD_PATH = ROOT / "src" / "data" / "oxford_5000.json"

with open(OXFORD_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

with open(APP_OXFORD_PATH, "r", encoding="utf-8") as f:
    app_data = json.load(f)

assert len(data) == len(app_data), f"Size mismatch: {len(data)} vs {len(app_data)}"

print(f"Auditing all {len(data)} words in {OXFORD_PATH}...")

issues = []
total_meanings = 0
total_examples = 0

for item in data:
    w = item.get("word")
    meanings = item.get("meanings", [])
    if not meanings:
        issues.append(f"{w}: NO MEANINGS")
    
    for idx, m in enumerate(meanings, 1):
        total_meanings += 1
        pos = m.get("partOfSpeech")
        if not pos:
            issues.append(f"{w} [#{idx}]: missing partOfSpeech")
        
        trans = m.get("translation", "")
        examples = m.get("examples", [])
        total_examples += len(examples)
        
        if not trans and not examples:
            issues.append(f"{w} [#{idx}]: empty translation and examples")
            
        if "~" in trans:
            issues.append(f"{w} [#{idx}]: unexpanded tilde in translation: '{trans[:60]}'")
            
        if re.search(r'\([a-zA-Z\s,;]+(?:\s*[—–]\s*|\s+-\s+)', trans):
            issues.append(f"{w} [#{idx}]: uncleaned government note in translation: '{trans[:60]}'")
            
        if re.search(r'\brefl\.\b', trans, flags=re.IGNORECASE):
            issues.append(f"{w} [#{idx}]: uncleaned refl marker in translation: '{trans[:60]}'")

        ru_texts = [trans] + [ex.get("ru", "") for ex in examples]
        for t in ru_texts:
            if re.search(r'\b(кого|кому|кем|ком|что|чему|чем|чём|чей|чья|чьё|чьи|какой|какая|какое|какие|где|куда|откуда|когда|как)-л\b\.?', t):
                issues.append(f"{w} [#{idx}]: unexpanded -л in '{t[:60]}'")
            if re.search(r'\b(pl|sing)\b', t, flags=re.IGNORECASE):
                issues.append(f"{w} [#{idx}]: unexpanded pl/sing in '{t[:60]}'")
            if re.search(r'\b(smb|smth|sb|sth)\b\.?', t):
                issues.append(f"{w} [#{idx}]: unexpanded English abbreviation in ru: '{t[:60]}'")
            if "занесение насчёт" in t or re.search(r'\bначей\b', t):
                issues.append(f"{w} [#{idx}]: glued word in: '{t[:60]}'")

        for ex in examples:
            en_t = ex.get("en", "")
            ru_t = ex.get("ru", "")
            
            if re.search(r'[а-яА-ЯёЁ]', en_t):
                issues.append(f"{w} [#{idx}]: Cyrillic in ex.en: '{en_t[:60]}'")
            if not ru_t:
                issues.append(f"{w} [#{idx}]: empty ex.ru for en: '{en_t[:60]}'")
            if re.search(r'\b(smb|smth|sb|sth)\b\.?', en_t):
                issues.append(f"{w} [#{idx}]: unexpanded English abbreviation in en: '{en_t[:60]}'")
            if "~" in en_t:
                issues.append(f"{w} [#{idx}]: unexpanded tilde ~ in en: '{en_t[:60]}'")

print(f"============================================================")
print(f"AUDIT COMPLETED:")
print(f"Total Words Checked:    {len(data)}")
print(f"Total Meanings Checked: {total_meanings}")
print(f"Total Examples Checked: {total_examples}")
print(f"Total Issues Found:     {len(issues)}")
print(f"============================================================")

if issues:
    print(f"Showing first 30 issues:")
    for iss in issues[:30]:
        print(" -", iss)
else:
    print("ALL CHECKS PASSED: ZERO ISSUES ACROSS THE ENTIRE DATASET!")
