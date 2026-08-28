import json,re
from collections import Counter
from pathlib import Path
R=Path(__file__).resolve().parents[1];A=R/'oxford_5000_2026-08-27.json';O=R/'tmp/embedded_english_translation_candidates.json'
d=json.loads(A.read_text(encoding='utf8'));out=[];counts=Counter()
for e in d:
 for m in e['meanings']:
  t=m['translation']
  # Two or more Latin letters after a Russian-definition boundary are an
  # actionable candidate.  One-letter abbreviations and prepositions remain
  # excluded from this report.
  if re.search(r'(?:^|;)\s*[A-Za-z][A-Za-z .\'’,-]{2,}',t):
   kind='phrasal_block' if re.search(r';\s*[a-z]+\s+(?:away|back|down|in|off|on|out|over|through|up)\b',t,re.I) else 'embedded_english'
   out.append({'word':e['word'],'meaning_id':m['id'],'partOfSpeech':m['partOfSpeech'],'translation':t,'kind':kind});counts[kind]+=1
O.write_text(json.dumps({'total':len(out),'counts':counts,'candidates':out},ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps({'total':len(out),'counts':counts},ensure_ascii=False))
