import json
from pathlib import Path
R=Path(__file__).resolve().parents[1];A=R/'oxford_5000_2026-08-27.json';B=R/'src/data/oxford_5000.json'
d=json.loads(A.read_text(encoding='utf8'))
e=next(x for x in d if x['word']=='gallon');m=next(x for x in e['meanings'] if x['id']==1)
assert m['translation']=='галлон (мера жидких и сыпучих тел; англ. = 4,54 л, тж. imperial gallon; амер. = 3,78'
m['translation']+=' л)'
t=json.dumps(d,ensure_ascii=False,indent=2)+'\n';A.write_text(t,encoding='utf8');B.write_text(t,encoding='utf8')
