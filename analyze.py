import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\emina\.gemini\antigravity\brain\2a8f7be6-60aa-45df-8b7e-cf6edfda55ab\scratch\audit_findings.json', 'r', encoding='utf-8') as f:
    findings = json.load(f)

print("=== 1. Headword leaks ===")
leaks = [f for f in findings if f['errorType'] == "Headword/transcription leaks"]
real_leaks = [f for f in leaks if f['currentValue'].strip().endswith(' ' + f['word'])]
print(f"Total matching 'translation + space + word': {len(real_leaks)}")
for f in real_leaks[:20]:
    print(f"Word: {f['word']} (ID: {f['meaningId']}) - {f['currentValue']}")

print("\n=== 2. Grammar markers standalone ===")
markers = [f for f in findings if f['errorType'] == "Grammar markers standalone"]
print(f"Total grammar markers: {len(markers)}")
for f in markers[:160]:
    print(f"Word: {f['word']} (ID: {f['meaningId']}) - {f['currentValue']}")

print("\n=== 3. Clipped roots ===")
clips = [f for f in findings if f['errorType'] == "Clipped roots"]
valid_roots = {'убить', 'иметь', 'бить', 'вести', 'брать', 'новый', 'стать', 'удить', 'одеть', 'сдать', 'шить', 'мыть', 'дать', 'левый', 'пятый', 'сотый', 'жатый', 'мытый', 'дутый', 'литый', 'мятый'}
real_clips = [f for f in clips if f['currentValue'].split()[0].lower() not in valid_roots]
print(f"Total potentially real clipped roots: {len(real_clips)}")
for f in real_clips[:30]:
    print(f"Word: {f['word']} (ID: {f['meaningId']}) - {f['currentValue']}")

print("\n=== 4. Dangling punctuation ===")
dangling = [f for f in findings if f['errorType'] == "Dangling punctuation at end"]
for f in dangling:
    print(f"Word: {f['word']} (ID: {f['meaningId']}) - {f['currentValue']}")

print("\n=== 5. Phrasal verb bleeds ===")
bleeds = [f for f in findings if f['errorType'] == "Phrasal verb bleeds"]
first_30 = bleeds[:30]
def has_english_phrase(text):
    return bool(re.search(r'[a-zA-Z]+ (in|out|up|down|on|off|away|back|over|about)', text, re.IGNORECASE))
    
with_phrase = [f for f in first_30 if has_english_phrase(f['currentValue'])]
print(f"Out of first 30, {len(with_phrase)} contain english phrase.")
