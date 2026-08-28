import json
from pathlib import Path
R=Path(__file__).resolve().parents[1];A=R/'oxford_5000_2026-08-27.json';B=R/'src/data/oxford_5000.json'
d=json.loads(A.read_text(encoding='utf8'));e=next(x for x in d if x['word']=='mention');m=next(x for x in e['meanings'] if x['id']==1)
assert m['translation']=='упоминание; ссылка; honourable mention; похвальный отзыв; благодарность в приказе'
m['translation']='упоминание; ссылка';m['register']=[]
ex={'en':'honourable mention','ru':'а) похвальный отзыв; б) воен. благодарность в приказе'}
if ex not in m['examples']:m['examples'].append(ex)
t=json.dumps(d,ensure_ascii=False,indent=2)+'\n';A.write_text(t,encoding='utf8');B.write_text(t,encoding='utf8')
