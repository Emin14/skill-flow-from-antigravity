import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]; A=R/'oxford_5000_2026-08-27.json'; B=R/'src/data/oxford_5000.json'
d=json.loads(A.read_text(encoding='utf8'))
for e in d:
 for m in e['meanings']:
  if e['word']=='champion' and m['id']==4:
   for x in m['examples']: x['en']=x['en'].replace('chessplayer','chess player')
  if e['word']=='curtain' and m['id']==3: m['translation']=m['translation'].replace('curtaincall','curtain call')
t=json.dumps(d,ensure_ascii=False,indent=2)+'\n';A.write_text(t,encoding='utf8');B.write_text(t,encoding='utf8')
