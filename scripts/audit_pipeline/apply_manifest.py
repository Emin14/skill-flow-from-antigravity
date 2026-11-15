#!/usr/bin/env python3
import json, shutil, sys
from pathlib import Path

def apply(dataset, manifest, backup):
    d=Path(dataset); data=json.loads(d.read_text()); changes=json.loads(Path(manifest).read_text())
    shutil.copy2(d, backup)
    by={x['word']:x for x in data}
    for c in changes:
        if c.get('decision')!='изменить': continue
        w=c['word']; path=c['path']; cur=by[w]
        if 'examples' in path or path[-1] in {'en', 'ru'}:
            raise ValueError('Example edits require independent per-candidate review; legacy text manifest is not sufficient')
        for key in path[:-1]: cur=cur[key]
        key=path[-1]
        if key not in {'translation','en','ru','phrase'}: raise ValueError(f'forbidden path: {path}')
        if cur[key]!=c['before']: raise ValueError(f'before mismatch: {w} {path}')
        if not isinstance(c.get('after'),str) or not c['after'].strip(): raise ValueError(f'bad replacement: {w}')
        cur[key]=c['after']
    d.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')

if __name__=='__main__': apply(sys.argv[1],sys.argv[2],sys.argv[3])
