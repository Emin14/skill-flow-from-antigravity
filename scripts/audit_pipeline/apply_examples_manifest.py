#!/usr/bin/env python3
"""Apply independently reviewed examples and meaning clarifications atomically."""
from __future__ import annotations
import argparse
import copy
import os
import tempfile
import json
import subprocess
import sys
from pathlib import Path
from build_examples_manifest import reviewed_changes
from entry_identity import resolve_entries


def atomic_write(path, content):
    mode=path.stat().st_mode & 0o777
    temporary=None
    try:
        with tempfile.NamedTemporaryFile(dir=path.parent,delete=False) as handle:
            temporary=Path(handle.name)
            handle.write(content);handle.flush();os.fsync(handle.fileno())
        os.chmod(temporary,mode)
        os.replace(temporary,path)
    finally:
        if temporary is not None and temporary.exists():temporary.unlink()


def apply_reviewed(data, changes):
    """Apply already-verified manifest to a private in-memory copy, all or nothing."""
    data=copy.deepcopy(data)
    seen = set()
    whole_entries = set()
    reverse = []
    for c in changes:
        selection = [c] if 'dataset_index' in c else None
        targets, indices = resolve_entries(data, [c['word']], selection)
        if 'before_entry' in c:
            index=indices[0]
            if index in whole_entries or any(key[0]==index for key in seen):
                raise ValueError('Atomic entry overlaps another change')
            if targets[0]!=c['before_entry'] or c['after_entry'].get('word')!=c['word']:
                raise ValueError('Atomic entry before/identity mismatch')
            whole_entries.add(index)
            reverse.append({'word':c['word'],'dataset_index':index,'before_entry':c['after_entry'],'after_entry':targets[0]})
            data[index]=c['after_entry']
            continue
        if indices[0] in whole_entries:
            raise ValueError('Meaning edit overlaps atomic entry')
        key = (indices[0], c['meaning_index'])
        if key in seen:
            raise ValueError('Duplicate change target')
        seen.add(key)
        meaning = targets[0]['meanings'][key[1]]
        if 'before_meaning' in c:
            if meaning != c['before_meaning']:
                raise ValueError(f'Meaning before mismatch: {key}')
            after = c['after_meaning']
            reverse.append({'word': c['word'], 'dataset_index': indices[0], 'meaning_index': key[1],
                            'before_meaning': after, 'after_meaning': meaning})
        else:
            if meaning.get('examples') != [] or c['before_examples'] != []:
                raise ValueError(f'Addition would overwrite examples: {key}')
            example = c['after_example']
            if not example.get('en') or not example.get('ru'):
                raise ValueError('Empty example')
            after = dict(meaning, examples=[example])
            reverse.append({'word': c['word'], 'dataset_index': indices[0], 'meaning_index': key[1],
                            'before_meaning': after, 'after_meaning': meaning})
        targets[0]['meanings'][key[1]] = after
    return data, reverse


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('dataset', type=Path)
    p.add_argument('manifest', type=Path)
    p.add_argument('backup', type=Path)
    p.add_argument('--dry-run', action='store_true')
    p.add_argument('--review-batch', type=Path, required=True)
    a = p.parse_args()
    root = Path(__file__).resolve().parents[2]
    if a.dataset.resolve() != (root/'src/data/oxford_5000.json').resolve():
        raise ValueError('Only the canonical dataset may be changed')
    before_bytes = a.dataset.read_bytes()
    data = json.loads(before_bytes)
    changes = json.loads(a.manifest.read_text())
    if changes != reviewed_changes(a.dataset, a.review_batch):
        raise ValueError('Manifest does not match independently approved changes')
    data, reverse = apply_reviewed(data, changes)
    if a.dry_run:
        print(f'DRY RUN: {len(changes)} independently reviewed meaning/example changes')
        return 0
    if a.backup.exists():
        raise ValueError('Reverse patch exists; choose a new path')
    if a.dataset.read_bytes() != before_bytes:
        raise ValueError('Dataset changed during review')
    # The reverse patch contains only affected meanings/entries, not a full dataset copy.
    a.backup.write_text(json.dumps({'reverse_changes': reverse}, ensure_ascii=False, indent=2)+'\n')
    try:
        atomic_write(a.dataset,(json.dumps(data, ensure_ascii=False, indent=2)+'\n').encode())
        qa = subprocess.run([sys.executable, str(root/'final_qa_validation.py')], cwd=root, capture_output=True, text=True)
        if qa.returncode or 'Total errors found: 0' not in qa.stdout:
            raise ValueError('Final QA failed: '+qa.stdout+qa.stderr)
    except BaseException:
        atomic_write(a.dataset,before_bytes)
        raise
    print(f'APPLIED: {len(changes)} reviewed meaning/example changes; final QA passed')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
