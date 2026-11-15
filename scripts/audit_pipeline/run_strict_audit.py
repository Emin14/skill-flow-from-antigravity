#!/usr/bin/env python3
"""Fail-fast orchestrator for already-produced 06–10 audit batches.

This command deliberately does not invent stage output. Role agents or an
approved extraction process must write the JSON first; this script only accepts
it after the report gate and dataset QA pass.
"""
from __future__ import annotations
import argparse, shutil, subprocess, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
VALIDATE=ROOT/'scripts/audit_pipeline/validate_reports.py'
def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('report_root',type=Path); p.add_argument('--start-index',type=int,default=0); p.add_argument('--run-final-qa',action='store_true')
    a=p.parse_args(); batches=sorted(x for x in a.report_root.glob('batch_*') if x.is_dir())
    if not batches: print('STRICT AUDIT STOPPED: no batch directories found',file=sys.stderr); return 2
    temp=a.report_root/'.strict_current_batch'
    for offset,batch in enumerate(batches):
        if temp.exists(): shutil.rmtree(temp)
        temp.mkdir()
        (temp/batch.name).symlink_to(batch.resolve(),target_is_directory=True)
        cmd=[sys.executable,str(VALIDATE),str(temp),'--start-index',str(a.start_index+offset*20)]
        if a.run_final_qa: cmd.append('--run-final-qa')
        result=subprocess.run(cmd,cwd=ROOT,text=True)
        shutil.rmtree(temp)
        if result.returncode:
            print(f'STRICT AUDIT STOPPED at {batch.name}',file=sys.stderr); return result.returncode
    print(f'STRICT AUDIT PASSED: {len(batches)} batches'); return 0
if __name__=='__main__': raise SystemExit(main())
