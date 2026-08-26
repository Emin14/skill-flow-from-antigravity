import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

batches_dir = Path("tmp/batches")
issues = []
total_words = 0
total_meanings = 0
total_examples = 0
pos_counts = {}
sample_words = []

for b in range(101, 151):
    v_file = batches_dir / f"batch_{b:03d}_verified.json"
    i_file = batches_dir / f"batch_{b:03d}_input.json"
    
    if not v_file.exists():
        issues.append(f"Missing verified file: batch_{b:03d}")
        continue
    if not i_file.exists():
        issues.append(f"Missing input file: batch_{b:03d}")
        continue
        
    with open(v_file, "r", encoding="utf-8") as f:
        v_data = json.load(f)
    with open(i_file, "r", encoding="utf-8") as f:
        i_data = json.load(f)
        
    v_words = v_data.get("words", [])
    i_items = i_data.get("items", [])
    
    if len(v_words) != len(i_items):
        issues.append(f"Batch {b}: word count mismatch ({len(v_words)} vs {len(i_items)})")
        
    for w_idx, (vw, item) in enumerate(zip(v_words, i_items)):
        total_words += 1
        orig = item["oxford_entry"]
        word_name = vw.get("word", "")
        
        if total_words in [1, 250, 500, 750, 1000, 1250]:
            sample_words.append({
                "batch": b,
                "word": word_name,
                "pos": [m.get("partOfSpeech") for m in vw.get("meanings", [])],
                "sample_trans": [m.get("translation") for m in vw.get("meanings", [])[:2]],
                "cefr": vw.get("cefr"),
                "phon_br": vw.get("phon_br")
            })
        
        # Check metadata preservation
        for field in ["word", "frequency_rank", "cefr", "phon_br", "phon_n_am", "lists"]:
            if orig.get(field) != vw.get(field):
                issues.append(f"Batch {b}, word {word_name}: metadata mismatch on {field}")
                
        # Check meanings
        meanings = vw.get("meanings", [])
        if not meanings:
            issues.append(f"Batch {b}, word {word_name}: no meanings")
            
        for m in meanings:
            total_meanings += 1
            pos = m.get("partOfSpeech")
            pos_counts[pos] = pos_counts.get(pos, 0) + 1
            
            tr = m.get("translation", "")
            if not tr:
                issues.append(f"Batch {b}, word {word_name}: empty translation in meaning {m.get('id')}")
                
            # Check OCR artifacts
            for bad_char, name in [("\u0002", "U+0002"), ("\u0006", "U+0006"), ("\u00ad", "U+00AD"), ("\ue000", "U+E000")]:
                if bad_char in tr:
                    issues.append(f"Batch {b}, word {word_name}: OCR artifact {name} in translation: {tr}")
                    
            for ex in m.get("examples", []):
                total_examples += 1
                en_ex = ex.get("en", "")
                ru_ex = ex.get("ru", "")
                for bad_char, name in [("\u0002", "U+0002"), ("\u0006", "U+0006"), ("\u00ad", "U+00AD"), ("\ue000", "U+E000")]:
                    if bad_char in en_ex or bad_char in ru_ex:
                        issues.append(f"Batch {b}, word {word_name}: OCR artifact {name} in example")

print("=== AUDIT RESULTS (Batches 101 to 150) ===")
print(f"Total batches audited: 50 (Batch 101 to Batch 150)")
print(f"Total words verified: {total_words}")
print(f"Total meanings verified: {total_meanings}")
print(f"Total examples verified: {total_examples}")
print(f"POS distribution: {json.dumps(pos_counts, ensure_ascii=False, indent=2)}")
print(f"Total issues found: {len(issues)}")
if issues:
    for iss in issues[:20]:
        print("  -", iss)

print("\n=== SAMPLE VERIFIED WORDS ===")
print(json.dumps(sample_words, ensure_ascii=False, indent=2))
