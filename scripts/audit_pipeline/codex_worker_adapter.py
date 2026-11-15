#!/usr/bin/env python3
"""Run one isolated role through the local Codex CLI and return JSON only."""
from __future__ import annotations
import argparse, json, re, shutil, subprocess, tempfile, time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
CODEX='/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex'
SCHEMA=Path(__file__).with_name('role_output.schema.json')
def extract_json(text):
    text=text.strip()
    if text.startswith('```'): text=re.sub(r'^```(?:json)?\s*|\s*```$','',text,flags=re.I|re.S).strip()
    return json.loads(text)
def main():
    p=argparse.ArgumentParser(description=__doc__); p.add_argument('--role',required=True); p.add_argument('--input',type=Path,required=True); p.add_argument('--output',type=Path,required=True); p.add_argument('--model'); p.add_argument('--codex-sandbox',choices=('read-only','workspace-write'),default='read-only'); a=p.parse_args()
    req=json.loads(a.input.read_text())
    prompt=('You are an isolated dictionary-audit worker. Read the supplied JSON request. Follow its role instructions exactly. Return ONLY a JSON object {"records":[...]} containing exactly 20 objects in the supplied word order; do not use Markdown or commentary. Do not edit files. For role 06 every source must have a factual search result with file, page/line and exact quote, or an explicit query and not-found result. For later roles preserve all evidence and report uncertainty. Semantically review all supplied entries, meanings and examples. All current entries are supplied in full.\n\n'+json.dumps(req,ensure_ascii=False,separators=(',',':')))
    isolated=Path(tempfile.mkdtemp(prefix='dictionary-role-'))
    try:
        for source in list(ROOT.glob('*.pdf'))+list(ROOT.glob('*.docx')):
            (isolated/source.name).symlink_to(source.resolve())
        packet_path=a.input.parent/'source_search.json'
        if req.get('prepared_source_search'):
            packet=json.loads(packet_path.read_text())
            for index, source in enumerate(packet['sources']):
                cache=Path(source['cache'])
                name=f'source_cache_{index}.json'
                (isolated/name).symlink_to(cache.resolve())
                source['cache']=name
            (isolated/'source_search.json').write_text(json.dumps(packet,ensure_ascii=False))
            shutil.copy2(ROOT/'scripts/audit_pipeline/source_search.py',isolated/'source_search.py')
        response=isolated/'worker_response.json'
        cmd=[CODEX,'exec','--json','--ephemeral','--sandbox',a.codex_sandbox,'--cd',str(isolated),'--skip-git-repo-check','-o',str(response)]
        if a.model: cmd += ['--model',a.model]
        cmd.append('-')
        started=time.monotonic()
        events_path=a.output.with_suffix('.events.jsonl')
        stderr_path=a.output.with_suffix('.stderr.txt')
        with events_path.open('w') as events, stderr_path.open('w') as errors:
            result=subprocess.run(cmd,input=prompt,cwd=isolated,text=True,stdout=events,stderr=errors)
        result.stdout=events_path.read_text()
        result.stderr=stderr_path.read_text()
        usage=[]
        for line in result.stdout.splitlines():
            try:
                event=json.loads(line)
                if event.get('usage'): usage.append(event['usage'])
            except json.JSONDecodeError: pass
        a.output.with_suffix('.metrics.json').write_text(json.dumps({
            'role': a.role, 'elapsed_seconds': round(time.monotonic()-started, 3),
            'request_bytes': len(prompt.encode()), 'returncode': result.returncode,
            'usage': usage, 'usage_available': bool(usage)
        }, indent=2)+'\n')
        if result.returncode: raise RuntimeError(f'Codex worker failed: {result.stdout}\n{result.stderr}')
        payload=extract_json(response.read_text()); payload=payload.get('records') if isinstance(payload,dict) else payload
        expected=req['output_contract']['word_order']
        if not isinstance(payload,list) or len(payload)!=20 or [x.get('word') for x in payload]!=expected: raise RuntimeError('worker output must contain exactly 20 records in requested order')
        a.output.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
    finally: shutil.rmtree(isolated,ignore_errors=True)
    return 0
if __name__=='__main__': raise SystemExit(main())
