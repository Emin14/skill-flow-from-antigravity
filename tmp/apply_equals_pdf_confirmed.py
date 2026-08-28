import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]; A=R/'oxford_5000_2026-08-27.json'; B=R/'src/data/oxford_5000.json'; O=R/'tmp/equals_pdf_confirmed_repairs.json'
FIX={('help',5):'порция',('preliminary',3):'вступительный экзамен',('royal',6):'бом-брам-стеньга',('spot',10):'прожектор для подсветки',('stop',6):'пробка; затычка',('framework',4):'точка зрения; критерий; компетенция, сфера деятельности',('practice',8):'применять, осуществлять; практиковать(ся), упражнять(ся); заниматься, практиковать'}
def main():
 d=json.loads(A.read_text(encoding='utf8')); made=[]
 for e in d:
  for m in e['meanings']:
   value=FIX.get((e['word'],m['id']))
   if value and m['translation']=='=':
    m['translation']=value; made.append({'word':e['word'],'meaning_id':m['id'],'before':'=','after':value,'source':'Müller parsed PDF explicit cross-reference'})
 text=json.dumps(d,ensure_ascii=False,indent=2)+'\n'; A.write_text(text,encoding='utf8');B.write_text(text,encoding='utf8');O.write_text(json.dumps(made,ensure_ascii=False,indent=2),encoding='utf8');print(len(made))
if __name__=='__main__':main()
