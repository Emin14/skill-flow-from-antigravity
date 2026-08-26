import json
import sys
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')


batches_dir = Path("tmp/batches")
oxford_data = json.load(open("oxford_5000.json", "r", encoding="utf-8"))
oxford_map = {item["word"]: item for item in oxford_data}

total_words = 0
issues = []
ocr_artifacts = ['\u0002', '\u0006', '\u00ad', '\ue000', '\x00', '\x01', '\x02', '\x03', '\x04', '\x05', '\x06', '\x07', '\x08', '\x0b', '\x0c', '\x0e', '\x1f', '\u200b', '\ufeff']

for b in range(151, 201):
    fpath = batches_dir / f"batch_{b:03d}_verified.json"
    if not fpath.exists():
        issues.append(f"Batch {b} missing!")
        continue
    data = json.load(open(fpath, "r", encoding="utf-8"))
    words = data.get("words", [])
    total_words += len(words)
    
    for w in words:
        word_name = w["word"]
        orig = oxford_map.get(word_name)
        if not orig:
            issues.append(f"Word {word_name} not found in oxford_5000.json")
            continue
            
        # Check metadata preservation
        for meta_key in ["frequency_rank", "cefr", "phon_br", "phon_n_am", "lists"]:
            if orig.get(meta_key) != w.get(meta_key):
                issues.append(f"{word_name}: Metadata mismatch in {meta_key}: orig={orig.get(meta_key)} vs verified={w.get(meta_key)}")
                
        # Check meanings
        meanings = w.get("meanings", [])
        if not meanings:
            issues.append(f"{word_name}: No meanings found")
            
        for m in meanings:
            pos = m.get("partOfSpeech")
            tr = m.get("translation", "")
            if not pos:
                issues.append(f"{word_name}: Missing pos")
            if not tr:
                issues.append(f"{word_name}: Empty translation")
            for art in ocr_artifacts:
                if art in tr:
                    issues.append(f"{word_name}: OCR artifact {repr(art)} in translation: {tr}")
            for ex in m.get("examples", []):
                for art in ocr_artifacts:
                    if art in ex.get("en", ""):
                        issues.append(f"{word_name}: OCR artifact in en example: {ex['en']}")
                    if art in ex.get("ru", ""):
                        issues.append(f"{word_name}: OCR artifact in ru example: {ex['ru']}")

print(f"Total words in batches 151-200: {total_words}")
print(f"Total issues found: {len(issues)}")
if issues:
    for iss in issues[:20]:
        print("  Issue:", iss)

print("\n--- SAMPLE ENTRIES ---")
for b in [151, 165, 180, 195, 200]:
    fpath = batches_dir / f"batch_{b:03d}_verified.json"
    data = json.load(open(fpath, "r", encoding="utf-8"))
    print(f"\n[BATCH {b}] ({data['total_words']} words)")
    for w in data['words'][:2]:
        print(f"Word: {w['word']} | CEFR: {w.get('cefr')} | Phon: {w.get('phon_br')}")
        for m in w['meanings']:
            print(f"  [{m['partOfSpeech']}] {m['translation']}")
            if m.get('examples'):
                ex = m['examples'][0]
                print(f"    Ex: {ex.get('en')} -> {ex.get('ru')}")

