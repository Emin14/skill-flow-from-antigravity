import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]; A=R/'oxford_5000_2026-08-27.json'; B=R/'src/data/oxford_5000.json'
def main():
 d=json.loads(A.read_text(encoding='utf8')); w={e['word']:e for e in d}; c=[]
 def m(e,i): return next(x for x in e['meanings'] if x['id']==i)
 def ph(e,s,t):
  q=e.setdefault('phrases',[])
  if not any(x['phrase']==s for x in q): q.append({'id':max([x['id'] for x in q],default=0)+1,'phrase':s,'partOfSpeech':'verb','translation':t,'examples':[],'register':[]})
 # Source-defined phrasal blocks leaked into senses.
 x=m(w['light'],20); x['translation']='освещать; светить (кому-либо)'; ph(w['light'],'light up','1) закурить (трубку и т. п.); 2) зажечь свет; 3) оживлять(ся), загораться, светиться (о лице, глазах)'); c.append('light')
 x=m(w['line'],29); x['translation']='стоять, тянуться вдоль (чего-либо; тж. line up)'; ph(w['line'],'line up','1) строить(ся), выстраивать(ся) (в линию); 2) становиться в очередь; 3) размежёвываться; 4) подыскать, подобрать; 5) собирать голоса; 6) присоединяться, солидаризироваться (with)'); c.append('line')
 x=m(w['line'],33); x['translation']='выкладывать, облицовывать; футеровать'; c.append('line')
 # Duplicate shorthand labels and unambiguous OCR losses.
 for i in (2,4):
  x=m(w['lion'],i); x['examples']=[z for z in x['examples'] if z['en']!='(L.)']; c.append('lion')
 for e in d:
  for x in e['meanings']:
   if x['translation'].startswith('егка '): x['translation']='сл'+x['translation']; c.append(e['word'])
   if x['translation'].startswith('егка,'): x['translation']='сл'+x['translation']; c.append(e['word'])
 x=m(w['list'],2); x['translation']='при англ. мн. ч.: огороженное место; арена (турнира, состязания)'; ph(w['list'],'to enter the lists','бросить вызов; принять вызов; участвовать в состязании'); c.append('list')
 text=json.dumps(d,ensure_ascii=False,indent=2)+'\n'; A.write_text(text,encoding='utf8'); B.write_text(text,encoding='utf8'); print(len(c))
if __name__=='__main__':main()
