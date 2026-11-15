#!/usr/bin/env python3
"""Build only example additions explicitly approved by role 10."""
import argparse
import json
from pathlib import Path
from meaning_contract import combined_changes
from entry_identity import resolve_entries, batch_selection
from validate_reports import ROOT, source_limits, validate_batch


def reviewed_changes(dataset, batch, deferred=None):
    data = json.loads(Path(dataset).read_text())
    stage09 = json.loads((batch / 'stage_09.json').read_text())
    stage07 = json.loads((batch / 'stage_07.json').read_text())
    stage10 = json.loads((batch / 'stage_10.json').read_text())
    if len(stage09) != 20:
        raise ValueError('review batch must contain exactly 20 words')
    entries, indices = resolve_entries(data, [record['word'] for record in stage09], batch_selection(batch))
    errors = validate_batch(batch, [e['word'] for e in entries], source_limits(ROOT), entries=entries)
    if errors:
        raise ValueError('\n'.join(errors))
    changes = combined_changes(entries, stage07, stage09, stage10, deferred=deferred)
    if batch_selection(batch) is not None:
        by_word = dict(zip([e['word'] for e in entries], indices))
        for change in changes:
            change['dataset_index'] = by_word[change['word']]
    return changes


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('batch', type=Path)
    p.add_argument('output', type=Path)
    p.add_argument('--dataset', type=Path, default=ROOT/'src/data/oxford_5000.json')
    args = p.parse_args()
    deferred=[]
    changes = reviewed_changes(args.dataset, args.batch, deferred=deferred)
    args.output.with_suffix(".deferred.json").write_text(json.dumps(deferred,ensure_ascii=False,indent=2)+"\n")
    args.output.write_text(json.dumps(changes, ensure_ascii=False, indent=2)+'\n')
    print(f'Approved example changes: {len(changes)}')


if __name__ == '__main__':
    main()
