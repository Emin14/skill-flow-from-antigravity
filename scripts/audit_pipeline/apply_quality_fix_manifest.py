#!/usr/bin/env python3
"""Apply reviewed example replacements with exact before checks."""
from __future__ import annotations
import argparse, json, shutil
from pathlib import Path

def main() -> int:
    p=argparse.ArgumentParser()
    p.add_argument('dataset',type=Path); p.add_argument('manifest',type=Path); p.add_argument('backup',type=Path)
    p.add_argument('--dry-run',action='store_true'); a=p.parse_args()
    raise SystemExit('Disabled: this legacy tool has no independent per-example approval. Use a reviewed candidate and the strict example contract.')
    data=json.loads(a.dataset.read_text()); changes=json.loads(a.manifest.read_text()); by={e['word']:e for e in data}; seen=set()
    for c in changes:
        if c.get('decision')!='изменить': continue
        key=(c['word'],c['meaning_index'])
        if key in seen: raise ValueError(f'duplicate target: {key}')
        seen.add(key)
        e=by.get(c['word']);
        if e is None: raise ValueError(f'word not found: {c["word"]}')
        m=e['meanings'][c['meaning_index']]
        target=next((x for x in m.get('examples',[]) if x.get('en')==c['before_en'] and x.get('ru')==c['before_ru']),None)
        if target is None: raise ValueError(f'before mismatch: {key}')
        if not c.get('after_en') or not c.get('after_ru'): raise ValueError(f'empty after: {key}')
    if a.dry_run: print(f'DRY RUN: {len(seen)} quality replacements validated'); return 0
    shutil.copy2(a.dataset,a.backup)
    for c in changes:
        if c.get('decision')!='изменить': continue
        m=by[c['word']]['meanings'][c['meaning_index']]
        target=next(x for x in m['examples'] if x.get('en')==c['before_en'] and x.get('ru')==c['before_ru'])
        target['en']=c['after_en']; target['ru']=c['after_ru']; target['origin']='generated'
    a.dataset.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    print(f'APPLIED: {len(seen)} quality replacements')
    return 0
if __name__=='__main__': raise SystemExit(main())
