import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'oxford_5000_2026-08-27.json'
MIRROR=ROOT/'src/data/oxford_5000.json'
INPUT=ROOT/'tmp/cleanup_remaining_confirmed_inline_pairs.json'

def main():
    items=json.loads(INPUT.read_text(encoding='utf8'))
    lookup={(e['word'],m['id']):m for e in json.loads(DATA.read_text(encoding='utf8')) for m in e['meanings']}
    for item in items:
        m=lookup[(item['word'],item['meaning_id'])]
        m['translation']=item['en']+' '+item['ru']
        for i in range(len(m['examples'])-1,-1,-1):
            if m['examples'][i]=={'en':item['en'],'ru':item['ru']}:
                m['examples'].pop(i); break
    data=[]
    # Re-read now that the lookup objects have been edited.
    for_entry = None
    # Objects in lookup retain the original list; recover it from any member.
    # Simpler and explicit: the dictionary source is reconstructed below.
    raw=json.loads(DATA.read_text(encoding='utf8'))
    for e in raw:
        for m in e['meanings']:
            item=next((x for x in items if (x['word'],x['meaning_id'])==(e['word'],m['id'])),None)
            if item:
                m['translation']=item['en']+' '+item['ru']
                for i in range(len(m['examples'])-1,-1,-1):
                    if m['examples'][i]=={'en':item['en'],'ru':item['ru']}:
                        m['examples'].pop(i); break
    text=json.dumps(raw,ensure_ascii=False,indent=2)+'\n'
    DATA.write_text(text,encoding='utf8'); MIRROR.write_text(text,encoding='utf8')
    print(len(items))
if __name__=='__main__': main()
