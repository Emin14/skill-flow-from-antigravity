import json,re
from pathlib import Path
from audit_meanings import DATA_PATH, INDEX_PATH, base_word, build_source_map
R=Path(__file__).resolve().parents[1]; MIRROR=R/'src/data/oxford_5000.json'; OUT=R/'tmp/source_confirmed_english_split_repairs.json'
def pairs(raw):
 return set(re.findall(r'(?<![A-Za-z])([A-Za-z]{2,})(?:\u00ad|-)[ \t]*\n[ \t]*([A-Za-z]{1,})(?![A-Za-z])',raw,re.I))
def fix(v,ps):
 made=[]
 for a,b in ps:
  pat=rf'(?<![A-Za-z]){re.escape(a)}\s+{re.escape(b)}(?![A-Za-z])'
  if re.search(pat,v): v,n=re.subn(pat,a+b,v); made += [(a+' '+b,a+b)]*n
 return v,made
def main():
 d=json.loads(DATA_PATH.read_text(encoding='utf8')); s=build_source_map(json.loads(INDEX_PATH.read_text(encoding='utf8'))); out=[]
 for e in d:
  ps=set().union(*(pairs(raw) for _,raw in s.get(base_word(e['word']),[])))
  for m in e['meanings']:
   for field,obj,key in [('translation',m,'translation')]+[('examples.en',x,'en') for x in m.get('examples',[])]:
    before=obj[key]; after,changes=fix(before,ps)
    if changes: obj[key]=after; out.append({'word':e['word'],'meaning_id':m['id'],'field':field,'before':before,'after':after,'repairs':changes})
 text=json.dumps(d,ensure_ascii=False,indent=2)+'\n'; DATA_PATH.write_text(text,encoding='utf8');MIRROR.write_text(text,encoding='utf8');OUT.write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8');print(len(out),sum(len(x['repairs']) for x in out))
if __name__=='__main__':main()
