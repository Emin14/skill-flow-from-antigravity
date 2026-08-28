import json
import re
import os
from collections import Counter
import sys

sys.stdout.reconfigure(encoding='utf-8')

input_file = r"d:\skill-flow-from-antigravity\oxford_5000_2026-08-27.json"
output_file = r"C:\Users\emina\.gemini\antigravity\brain\2a8f7be6-60aa-45df-8b7e-cf6edfda55ab\scratch\audit_findings.json"

with open(input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

findings = []

def add_finding(word, meaning_id, field, error_type, current, suggested=None):
    findings.append({
        "word": word,
        "meaningId": meaning_id,
        "field": field,
        "errorType": error_type,
        "currentValue": current,
        "suggestedFix": suggested
    })

def check_field(entry, meaning, field_name, text):
    if not text:
        return

    word = entry.get('word', '')
    mid = meaning.get('id', -1)
    pos = meaning.get('partOfSpeech', '')

    # 1. Broken word stitches (e.g. пло скость)
    if re.search(r'(?<![а-яА-ЯёЁ])[а-яА-ЯёЁ]{1,2} [а-яА-ЯёЁ]{3,}(?![а-яА-ЯёЁ])|(?<![а-яА-ЯёЁ])[а-яА-ЯёЁ]{3,} [а-яА-ЯёЁ]{1,2}(?![а-яА-ЯёЁ])', text):
        add_finding(word, mid, field_name, "Broken word stitches", text)

    # 2. Clipped roots
    first_word = text.split()[0] if text else ""
    if first_word.islower() and len(first_word) <= 5 and re.match(r'^[а-яё]{1,5}(ный|ый|ать|ить|еть|уть|ти|ся)$', first_word):
        add_finding(word, mid, field_name, "Clipped roots", text)

    # 3. Headword/transcription leaks
    if text.endswith(word) and len(text) > len(word):
        add_finding(word, mid, field_name, "Headword/transcription leaks", text)

    # 4. Phrasal verb bleeds
    if field_name == 'translation' and re.search(r'\b[a-zA-Z]+ (in|out|up|down|on|off|away|back|over|about)\b', text, re.IGNORECASE):
        add_finding(word, mid, field_name, "Phrasal verb bleeds", text)

    # 5. Embedded examples
    if field_name == 'translation' and re.search(r'\b[a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+\b', text):
        add_finding(word, mid, field_name, "Embedded examples", text)

    # 6. Incorrect partOfSpeech
    is_verb_form = first_word.endswith('ть') or first_word.endswith('ти') or first_word.endswith('ся')
    if pos == 'verb' and not is_verb_form and len(first_word) > 3 and not re.search(r'\b(p\.p\.|p\.|pres\.p\.)\b', text):
        add_finding(word, mid, field_name, "Incorrect partOfSpeech (verb)", text)
    elif pos == 'noun' and is_verb_form:
        add_finding(word, mid, field_name, "Incorrect partOfSpeech (noun)", text)

    # 7. Pronoun abbreviations
    if re.search(r'(кто-л\.|что-л\.|чьил\.|кемл\.|чемл\.|-л\.)', text):
        add_finding(word, mid, field_name, "Pronoun abbreviations not expanded", text)

    # 8. Grammar markers standalone
    if text.strip() in ['p.p. от', 'p. от', 'pres.p. от'] or re.search(r'^(p\.p\.|p\.|pres\.p\.) от\b', text.strip()):
        add_finding(word, mid, field_name, "Grammar markers standalone", text)

    # 9. Dangling punctuation
    if re.search(r'(; to|; from|\(for —|тж\.;|;|—|-)$', text.strip()):
        add_finding(word, mid, field_name, "Dangling punctuation at end", text)

for entry in data:
    word = entry.get('word', '')
    for meaning in entry.get('meanings', []):
        trans = meaning.get('translation', '')
        check_field(entry, meaning, 'translation', trans)
        
        for ex in meaning.get('examples', []):
            ru = ex.get('example_ru', '')
            check_field(entry, meaning, 'example_ru', ru)

        for ph in meaning.get('phrases', []):
            ph_tr = ph.get('translation', '')
            check_field(entry, meaning, 'phrase_translation', ph_tr)

os.makedirs(os.path.dirname(output_file), exist_ok=True)
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(findings, f, ensure_ascii=False, indent=2)

summary = Counter(f['errorType'] for f in findings)
print("SUMMARY:")
for k, v in summary.items():
    print(f"{k}: {v}")
print("\nEGREGIOUS:")
for k in summary.keys():
    print(f"--- {k} ---")
    exs = [f for f in findings if f['errorType'] == k][:10]
    for ex in exs:
        print(f"{ex['word']}: {ex['currentValue']}")
