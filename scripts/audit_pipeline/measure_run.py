#!/usr/bin/env python3
"""Measure recorded worker usage; never infer tokens from bytes or approve content."""
import argparse
import hashlib
import json
from pathlib import Path


def size(value):
    return len(json.dumps(value, ensure_ascii=False, separators=(',', ':')).encode())


def measure(root):
    attempts, seen = [], set()
    for path in sorted(root.rglob('stage_*.metrics.json')):
        events = path.with_name(path.name.replace('.metrics.json', '.events.jsonl'))
        # Repair archives sometimes copy the same run. Count its events only once.
        identity = hashlib.sha256(events.read_bytes()).hexdigest() if events.exists() else str(path)
        if identity in seen:
            continue
        seen.add(identity)
        metric = json.loads(path.read_text())
        usage = metric.get('usage', [])
        attempt = {'file': str(path.relative_to(root)), 'role': metric['role'],
                   'elapsed_seconds': metric['elapsed_seconds'],
                   'usage_available': bool(usage),
                   'input_tokens': sum(u.get('input_tokens', 0) for u in usage),
                   'cached_input_tokens': sum(u.get('cached_input_tokens', 0) for u in usage),
                   'output_tokens': sum(u.get('output_tokens', 0) for u in usage)}
        attempt['uncached_input_tokens'] = attempt['input_tokens'] - attempt['cached_input_tokens']
        attempts.append(attempt)
    requests = []
    for path in sorted(root.glob('batch_*/input_*.json')):
        request = json.loads(path.read_text())
        entries = {e['word']: e for e in request['entries']}
        duplicates = 0
        for records in request.get('previous_outputs', {}).values():
            for record in records:
                for key in ('before', 'after'):
                    if record.get(key) == entries.get(record.get('word')) and key in record:
                        duplicates += size(record[key])
        requests.append({'file': str(path.relative_to(root)),
                         'component_bytes': {k: size(v) for k, v in request.items()},
                         'exact_canonical_snapshot_duplicate_bytes': duplicates})
    keys = ('input_tokens', 'cached_input_tokens', 'uncached_input_tokens', 'output_tokens', 'elapsed_seconds')
    return {'scope': 'Recorded CLI worker calls only; excludes managing chat. Bytes are not tokens.',
            'all_attempts_have_usage': all(a['usage_available'] for a in attempts),
            'attempts': attempts, 'totals': {k: sum(a[k] for a in attempts) for k in keys},
            'requests': requests}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('report_root', type=Path)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    result = measure(args.report_root)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(result['totals']))
