import json,re
from collections import defaultdict
from pathlib import Path
R=Path(__file__).resolve().parents[1]; d=json.loads((R/'oxford_5000_2026-08-27.json').read_text(encoding='utf8')); out=defaultdict(list)
for e in d:
 for m in e['meanings']:
  t=m['translation']; key=(e['word'],m['id'])
  if t=='=': out['equals'].append(key)
  if re.search(r'\([^)]*$',t): out['open_parenthesis'].append(key)
  if re.search(r'[A-Za-z]{3,}',t): out['latin_run'].append(key)
(R/'tmp/full_audit_inventory.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8'); print({k:len(v) for k,v in out.items()},'entries',len(d),'meanings',sum(len(e['meanings']) for e in d))
