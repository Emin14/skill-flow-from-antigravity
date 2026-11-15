#!/usr/bin/env python3
"""Prepare deterministic report metadata for a frequency-ranked word sample.

The canonical dataset remains the only dictionary source.  This command writes
indices and words used to address the sample; it does not copy or modify
dictionary entries and does not create any audit stage output.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATASET = ROOT / "src/data/oxford_5000.json"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--count", type=int, default=100)
    parser.add_argument("--batch-size", type=int, default=20)
    parser.add_argument("--output-root", type=Path, required=True)
    parser.add_argument("--dataset", type=Path, default=DATASET)
    args = parser.parse_args()
    if args.count <= 0 or args.batch_size <= 0 or args.count % args.batch_size:
        parser.error("count must be a positive multiple of batch-size")
    data = json.loads(args.dataset.read_text())
    ranked = sorted(
        enumerate(data),
        key=lambda pair: (pair[1].get("frequency_rank", 10**9), pair[0]),
    )[: args.count]
    if len(ranked) != args.count:
        raise SystemExit("dataset has fewer entries than requested")
    records = [
        {
            "selected_index": i + 1,
            "dataset_index": dataset_index,
            "word": entry["word"],
            "frequency_rank": entry.get("frequency_rank"),
            "batch": i // args.batch_size + 1,
            "position_in_batch": i % args.batch_size + 1,
        }
        for i, (dataset_index, entry) in enumerate(ranked)
    ]
    args.output_root.mkdir(parents=True, exist_ok=True)
    (args.output_root / "selected_words.json").write_text(
        json.dumps(records, ensure_ascii=False, indent=2) + "\n"
    )
    for batch in range(1, args.count // args.batch_size + 1):
        members = [r for r in records if r["batch"] == batch]
        batch_dir = args.output_root / f"batch_{batch:03d}"
        batch_dir.mkdir(parents=True, exist_ok=True)
        (batch_dir / "selected_indices.json").write_text(
            json.dumps(members, ensure_ascii=False, indent=2) + "\n"
        )
    print(json.dumps({"words": len(records), "batches": args.count // args.batch_size}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
