import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'oxford_5000_2026-08-27.json'; MIRROR=ROOT/'src/data/oxford_5000.json'
OUT=ROOT/'tmp/new_structural_repairs.json'

def m(e,i): return next(x for x in e['meanings'] if x['id']==i)
def phrase(e,p,t):
 q=e.setdefault('phrases',[])
 if not any(x['phrase']==p for x in q): q.append({'id':max([x['id'] for x in q],default=0)+1,'phrase':p,'partOfSpeech':'verb','translation':t,'examples':[],'register':[]})
def main():
 d=json.loads(DATA.read_text(encoding='utf8')); w={x['word']:x for x in d}; r=[]
 # Grammar labels had been emitted as fake English examples.  Keep their
 # already-extracted Russian content beside the sense, where README permits
 # grammatical specification, rather than preserving invalid ExampleEntry.
 for e in d:
  for x in e['meanings']:
   bad=[z for z in x['examples'] if z['en']=='pron poss. ()']
   if bad:
    b=x['translation']; suffix='; '.join(z['ru'] for z in bad)
    x['translation']=b+'; '+suffix if suffix not in b else b
    x['examples']=[z for z in x['examples'] if z not in bad]
    r.append({'word':e['word'],'meaning_id':x['id'],'before':b,'after':x['translation'],'reason':'grammar-label-not-example'})
 it=m(w['itself'],1); b=it['translation']; it['translation']='сам, сама, само; -ся, -сь; себе; себя'; it['examples']=[z for z in it['examples'] if z['en']!='refl.']; r.append({'word':'itself','meaning_id':1,'before':b,'after':it['translation'],'reason':'truncated-reflexive-pronoun'})
 x=m(w['jurisdiction'],3); ex=next(z for z in x['examples'] if z['en']=="it doesn't lie within my jurisdiction"); b=ex['ru']; ex['ru']='это не входит в мою компетенцию'; r.append({'word':'jurisdiction','meaning_id':3,'before':b,'after':ex['ru'],'reason':'next-headword/page leak'})
 x=m(w['jury'],1); ex=next(z for z in x['examples'] if z['en'].startswith('petty ')); b=ex['en']; ex['en']='petty (или common, trial) jury'; r.append({'word':'jury','meaning_id':1,'before':b,'after':ex['en'],'reason':'page-number leak'})
 x=m(w['lift'],21); b=x['translation']; x['translation']='ликвидировать задолженность, уплатить долги'; phrase(w['lift'],'lift down','поднять и затем опустить вниз'); r.append({'word':'lift','meaning_id':21,'before':b,'after':x['translation'],'reason':'phrasal-verb block'})
 x=m(w['light'],1); b=x['translation']; x['translation']='свет; освещение; дневной свет'; phrase(w['light'],'to see the light','1) увидеть свет, родиться; 2) выйти из печати; 3) обратиться (в какую-либо веру и т. п.); 4) понять; убедиться; 5) перен. мешать, стоять на дороге'); r.append({'word':'light','meaning_id':1,'before':b,'after':x['translation'],'reason':'idiom block'})
 x=m(w['light'],4); b=x['translation']; x['translation']='(часто при англ. мн. ч.:) светофор'; phrase(w['light'],'green light','«зелёная улица»'); r.append({'word':'light','meaning_id':4,'before':b,'after':x['translation'],'reason':'idiom block'})
 text=json.dumps(d,ensure_ascii=False,indent=2)+'\n'; DATA.write_text(text,encoding='utf8'); MIRROR.write_text(text,encoding='utf8'); OUT.write_text(json.dumps(r,ensure_ascii=False,indent=2),encoding='utf8'); print(len(r))
if __name__=='__main__':main()
