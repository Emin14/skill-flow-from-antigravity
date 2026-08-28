import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]; A=R/'oxford_5000_2026-08-27.json'; B=R/'src/data/oxford_5000.json'
def main():
 d=json.loads(A.read_text(encoding='utf8')); w={e['word']:e for e in d}
 def m(e,i):return next(x for x in e['meanings'] if x['id']==i)
 x=m(w['local'],1); x['translation']='местный'; x['examples'].append({'en':'local name','ru':'название местности; местное название'})
 x=m(w['member'],4); ex=next(z for z in x['examples'] if z['en']=='member state'); ex['ru']='государство-член (ООН и т. п.)'
 x=m(w['memorable'],1); x['translation']='(досто-)памятный, незабвенный, незабываемый'
 text=json.dumps(d,ensure_ascii=False,indent=2)+'\n'; A.write_text(text,encoding='utf8');B.write_text(text,encoding='utf8')
if __name__=='__main__':main()
