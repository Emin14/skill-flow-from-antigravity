import io, json

data = json.load(io.open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))

VALID_POS = {
    "noun", "verb", "adjective", "adverb", "preposition",
    "conjunction", "pronoun", "numeral", "interjection", "article", "other"
}

errors = []
total_meanings = 0
total_examples = 0
total_phrases = 0

for i, entry in enumerate(data):
    w = entry.get('word')
    if not w:
        errors.append(f"Entry {i} missing word")
    
    meanings = entry.get('meanings', [])
    if not meanings:
        errors.append(f"Entry '{w}' has empty meanings")
    
    total_meanings += len(meanings)
    
    for m in meanings:
        pos = m.get('partOfSpeech')
        if pos not in VALID_POS:
            errors.append(f"Word '{w}' mid {m.get('id')} has invalid POS '{pos}'")
        
        tr = m.get('translation')
        if tr is None or not isinstance(tr, str) or not tr.strip():
            errors.append(f"Word '{w}' mid {m.get('id')} has empty translation")
            
        exs = m.get('examples', [])
        total_examples += len(exs)
        for ex in exs:
            if 'en' not in ex or 'ru' not in ex:
                errors.append(f"Word '{w}' mid {m.get('id')} has malformed example: {ex}")
    
    phrases = entry.get('phrases', [])
    total_phrases += len(phrases)

print(f"Validation finished. Total errors: {len(errors)}")
if errors:
    for err in errors[:20]:
        print(f"  ERROR: {err}")
else:
    print(f"All {len(data)} entries successfully validated!")
    print(f"  Total meanings: {total_meanings}")
    print(f"  Total examples: {total_examples}")
    print(f"  Total phrases:  {total_phrases}")
