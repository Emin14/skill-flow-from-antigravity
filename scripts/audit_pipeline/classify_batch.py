#!/usr/bin/env python3
"""Classify audit records by the amount of semantic model work they need."""
from __future__ import annotations
import argparse, json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]

def classify(entry, evidence=None, stage09=None, stage10=None):
    reasons=[]
    meanings=entry.get('meanings',[])
    empty=[m for m in meanings if not m.get('examples')]
    if empty: reasons.append(f'{len(empty)} empty meaning example(s)')
    if evidence:
        results=evidence.get('source_evidence',{}).get('search_results',[])
        if len(results)<4: reasons.append('incomplete source coverage')
        if any(not r.get('found') for r in results): reasons.append('source not-found result')
    if stage09:
        checks=stage09.get('checks',[])
        if any(c.get('generated_example') for c in checks): reasons.append('generated example')
        if any(c.get('no_candidate_reason') for c in checks): reasons.append('no-candidate decision')
    if stage10 and stage10.get('decision')=='review_required': reasons.append('role 10 review')
    if any(not m.get('partOfSpeech') or not m.get('translation') for m in meanings): reasons.append('incomplete meaning fields')
    if any(len(m.get('examples',[]))>0 and any(not e.get('en') or not e.get('ru') for e in m['examples']) for m in meanings): reasons.append('malformed example')
    if stage10 and stage10.get('decision')=='review_required': level='red'
    elif any(x in reasons for x in ('malformed example','incomplete meaning fields')): level='red'
    elif reasons: level='yellow'
    else: level='green'
    return {'word':entry['word'],'class':level,'model_required':True,'reasons':reasons}

def main():
    p=argparse.ArgumentParser(); p.add_argument('batch_dir',type=Path); p.add_argument('--dataset',type=Path,default=ROOT/'src/data/oxford_5000.json'); p.add_argument('--start-index',type=int,required=True); p.add_argument('--output',type=Path)
    a=p.parse_args(); data=json.loads(a.dataset.read_text()); entries=data[a.start_index:a.start_index+20]
    def load(name):
        q=a.batch_dir/f'{name}.json'; return json.loads(q.read_text()) if q.exists() else []
    s6=load('stage_06'); s9=load('stage_09'); s10=load('stage_10'); out=[]
    for i,e in enumerate(entries): out.append(classify(e,s6[i] if i<len(s6) else None,s9[i] if i<len(s9) else None,s10[i] if i<len(s10) else None))
    target=a.output or a.batch_dir/'classification.json'; target.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n'); print(json.dumps({'green':sum(x['class']=='green' for x in out),'yellow':sum(x['class']=='yellow' for x in out),'red':sum(x['class']=='red' for x in out)},ensure_ascii=False))
if __name__=='__main__': main()
