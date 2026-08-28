import json
import re

with open(r'C:\Users\emina\.gemini\antigravity\brain\2a8f7be6-60aa-45df-8b7e-cf6edfda55ab\scratch\audit_findings.json', 'r', encoding='utf-8') as f:
    findings = json.load(f)

out = []

out.append("### 1. Headword/transcription leaks")
leaks = [f for f in findings if f['errorType'] == "Headword/transcription leaks"]
real_leaks = [f for f in leaks if f['currentValue'].strip().endswith(' ' + f['word'])]
out.append(f"Количество форматов 'перевод + пробел + СЛОВО': {len(real_leaks)}")
for f in real_leaks[:20]:
    out.append(f"- **{f['word']}** (ID: {f['meaningId']}): {f['currentValue']}")

out.append("\n### 2. Grammar markers standalone")
markers = [f for f in findings if f['errorType'] == "Grammar markers standalone"]
out.append(f"Всего найдено: {len(markers)}. Вот полный список:")
for f in markers:
    out.append(f"- **{f['word']}** (ID: {f['meaningId']}): {f['currentValue']}")

out.append("\n### 3. Clipped roots")
clips = [f for f in findings if f['errorType'] == "Clipped roots"]
valid_roots = {'убить', 'иметь', 'бить', 'вести', 'брать', 'новый', 'стать', 'удить', 'одеть', 'сдать', 'шить', 'мыть', 'дать', 'левый', 'пятый', 'сотый', 'жатый', 'мытый', 'дутый', 'литый', 'мятый', 'самый'}
real_clips = [f for f in clips if f['currentValue'].split()[0].lower() not in valid_roots]
out.append(f"Исключив распространенные словарные слова, оставшихся (вероятно реальных) обрезанных корней: {len(real_clips)}. Топ-30:")
for f in real_clips[:30]:
    out.append(f"- **{f['word']}** (ID: {f['meaningId']}): {f['currentValue']}")

out.append("\n### 4. Dangling punctuation")
dangling = [f for f in findings if f['errorType'] == "Dangling punctuation at end"]
out.append("Все 9 случаев:")
for f in dangling:
    out.append(f"- **{f['word']}** (ID: {f['meaningId']}): {f['currentValue']}")

out.append("\n### 5. Phrasal verb bleeds")
bleeds = [f for f in findings if f['errorType'] == "Phrasal verb bleeds"]
def has_english_phrase(text):
    return bool(re.search(r'[a-zA-Z]+ (in|out|up|down|on|off|away|back|over|about)', text, re.IGNORECASE))
first_30 = bleeds[:30]
with_phrase = [f for f in first_30 if has_english_phrase(f['currentValue'])]
out.append(f"Из первых 30 случаев {len(with_phrase)} ({len(with_phrase)/30*100:.0f}%) содержат английскую фразу внутри русского перевода.")

with open(r'd:\skill-flow-from-antigravity\report.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))
