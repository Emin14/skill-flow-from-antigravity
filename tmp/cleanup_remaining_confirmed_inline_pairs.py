import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'oxford_5000_2026-08-27.json'
MIRROR=ROOT/'src/data/oxford_5000.json'
OUT=ROOT/'tmp/cleanup_remaining_confirmed_inline_pairs.json'

ITEMS={
('blue',13):('to have (или to get) the blues, to be in the blues','быть в плохом настроении, хандрить'),
('drum',8):("to drum smth. into smb., to drum smth. into smb.'s head",'вдалбливать что-либо кому-либо'),
('other',4):('some day (или some time) or other','когда-нибудь, рано или поздно'),
('pair',5):('pair of stairs (или of steps)','марш, этаж'),
('pass',34):('pass your eyes (или glance) over this letter','просмотрите это письмо'),
('publishing',2):('publishing house (или office)','издательство'),
('retrieve',8):('beyond (или past) retrieve','безвозвратно, непоправимо'),
('throw',10):('the book is sold at $5 a throw','книга продаётся по 5 долларов (за экземпляр)'),
('while',2):('to while away the time (или a few hours)','проводить, коротать время'),
('why',2):("I can think of no reason why you shouldn't go there",'почему бы вам не пойти туда?'),
}
def main():
 d=json.loads(DATA.read_text(encoding='utf8')); made=[]
 for e in d:
  for m in e['meanings']:
   pair=ITEMS.get((e['word'],m['id']))
   if pair and m['translation']==pair[0]+' '+pair[1]:
    m['translation']=''
    m.setdefault('examples',[]).append({'en':pair[0],'ru':pair[1]})
    made.append({'word':e['word'],'meaning_id':m['id'],'en':pair[0],'ru':pair[1]})
 text=json.dumps(d,ensure_ascii=False,indent=2)+'\n'; DATA.write_text(text,encoding='utf8'); MIRROR.write_text(text,encoding='utf8'); OUT.write_text(json.dumps(made,ensure_ascii=False,indent=2),encoding='utf8'); print(len(made))
if __name__=='__main__': main()
