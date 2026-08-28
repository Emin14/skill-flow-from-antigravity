import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]; A=R/'oxford_5000_2026-08-27.json'; B=R/'src/data/oxford_5000.json'; O=R/'tmp/reverted_equals_cross_references.json'
TARGET={('help',5),('preliminary',3),('royal',6),('spot',10),('stop',6),('framework',4),('practice',8)}
def main():
 d=json.loads(A.read_text(encoding='utf8')); made=[]
 for e in d:
  for m in e['meanings']:
   if (e['word'],m['id']) in TARGET and m['translation']!='=':
    made.append({'word':e['word'],'meaning_id':m['id'],'before':m['translation'],'after':'='}); m['translation']='='
 text=json.dumps(d,ensure_ascii=False,indent=2)+'\n'; A.write_text(text,encoding='utf8');B.write_text(text,encoding='utf8');O.write_text(json.dumps(made,ensure_ascii=False,indent=2),encoding='utf8');print(len(made))
if __name__=='__main__':main()
