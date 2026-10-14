"""Read-only screening, in batches. Flags require human source review; no repairs."""
import json,re,hashlib,collections
from pathlib import Path
root=Path(__file__).resolve().parent.parent
out=Path(__file__).resolve().parent
raw=(root/'oxford_5000_2026-08-27.json').read_bytes()
data=json.loads(raw)
text=(root/'tmp/muller_full_text.txt').read_text()
heads=collections.defaultdict(list)
page=None
for line in text.splitlines():
 p=re.fullmatch(r'<<<PAGE(\d+)>>>',line.strip())
 if p:page=int(p[1]);continue
 h=re.match(r'^([A-Za-z][A-Za-z\-\x16]*(?: [A-Za-z]+){0,3})(?: [IVX]+)?\s*\[',line)
 if h:
  w=re.sub(r' [IVX]+$','',h[1]).replace('\x16','-')
  heads[w].append(page)
flags=[];rows=[];batches=[]
for start in range(0,len(data),100):
 count_before=len(flags)
 for idx in range(start,min(start+100,len(data))):
  x=data[idx];w=x['word'];base=re.sub(r'\d+$','',w)
  def flag(path,kind,value):flags.append({'index':idx,'word':w,'path':path,'kind':kind,'value':value,'status':'requires_review'})
  for sec in ['meanings','phrases']:
   items=x.get(sec,[]);ids=[m.get('id') for m in items]
   if len(ids)!=len(set(ids)):flag('/'+sec,'duplicate_ids',ids)
   for j,m in enumerate(items):
    path=f'/{sec}/{j}'
    if m.get('partOfSpeech') not in {'noun','verb','adjective','adverb','preposition','conjunction','pronoun','numeral','interjection','article','determiner','other'}:flag(path+'/partOfSpeech','unknown_pos',m.get('partOfSpeech'))
    if m.get('partOfSpeech')=='verb' and re.match(r'при мн\. ч\.:|в роли определения:',m.get('translation','')):flag(path+'/partOfSpeech','suspect_pos',m.get('translation'))
    fields=[('translation',m.get('translation',''))]
    if sec=='phrases':fields.append(('phrase',m.get('phrase','')))
    fields += [(f'examples/{n}/{key}',e.get(key,'')) for n,e in enumerate(m.get('examples',[])) for key in ['en','ru']]
    for key,t in fields:
     fp=path+'/'+key
     if not t.strip():flag(fp,'empty_text',t)
     if re.search(r'\(cid:\d+\)|\ufffd|[\x00-\x08\x0b\x0c\x0e-\x1f]',t):flag(fp,'corrupt_character',t)
     # Lettered lists а), б) are legitimate and excluded from bracket balancing.
     balanced=re.sub(r'(^|;\s*)[а-яa-z]\)\s',r'\1',t)
     if balanced.count('(')!=balanced.count(')'):flag(fp,'unbalanced_parentheses',t)
     if key.endswith('/en') and (t.strip() in ['gappy','emph.','predic.','attr.','pl'] or re.search(r'\(\s*\)',t)):flag(fp,'suspect_example',t)
     if key.endswith('/ru') and re.match(r'^(?:\(или |\(or |smb\.;|to;)',t):flag(fp,'english_fragment_in_ru',t)
  pages=sorted(set(heads.get(base,[])))
  rows.append({'index':idx,'word':w,'frequency_rank':x.get('frequency_rank'),'batch':start//100+1,'source_heading_candidate_pages':pages,'source_status':'heading_candidates_only' if pages else 'heading_not_matched','lexical_review':'not_completed'})
 batches.append({'batch':start//100+1,'start_index':start,'end_index':min(start+100,len(data))-1,'entries':min(100,len(data)-start),'flags':len(flags)-count_before,'structural_screen':'completed','full_source_review':'not_completed'})
report={'dataset_sha256':hashlib.sha256(raw).hexdigest(),'entries':len(data),'batches':batches,'flags':flags,'coverage':rows,'note':'Candidate pages and flags are not lexical validation. Order, meanings, primary and protected entries were not changed.'}
(out/'screening.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('Entries:',len(data),'batches:',len(batches),'flags:',len(flags))
print('Heading matches:',sum(bool(r['source_heading_candidate_pages']) for r in rows))
for f in flags:print(f['word'],f['path'],f['kind'],repr(f['value']))
