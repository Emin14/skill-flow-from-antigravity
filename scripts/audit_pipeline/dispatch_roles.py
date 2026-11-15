#!/usr/bin/env python3
"""Dispatch five isolated dictionary-audit roles for one 20-word batch.

The worker is intentionally external: it may be a Codex task, an API-backed
agent, or a local adapter. It must accept ``--role ROLE --input FILE
--output FILE`` and write exactly one JSON array to the requested output.
This dispatcher never fabricates stage output and never edits the dataset.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shlex
import shutil
import subprocess
import sys
import tempfile
from example_contract import binding, digest, validate_proposals
from meaning_contract import meaning_binding
from entry_contract import entry_binding
from report_delta import expand_records
from source_search import prepare as prepare_source_search
from entry_identity import resolve_entries
from validate_reports import validate_batch, source_limits
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATASET = ROOT / "src/data/oxford_5000.json"
STAGES = {
    "06": "06-сравнение-источников.md",
    "07": "07-безопасное-улучшение-oxford.md",
    "08": "08-определение-primary.md",
    "09": "09-редактор-учебной-записи.md",
    "10": "10-финальная-защита-словаря.md",
}


def run_worker(command: list[str], role: str, prompt: Path, output: Path) -> None:
    result = subprocess.run(
        command + ["--role", role, "--input", str(prompt), "--output", str(output)],
        cwd=ROOT,
        text=True,
        capture_output=True,
    )
    if result.returncode:
        raise RuntimeError(f"worker {role} failed ({result.returncode}):\n{result.stdout}\n{result.stderr}")
    if not output.exists():
        raise RuntimeError(f"worker {role} completed without creating {output}")
    try:
        payload = json.loads(output.read_text())
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"worker {role} produced invalid JSON: {exc}") from exc
    if not isinstance(payload, list) or len(payload) != 20:
        raise RuntimeError(f"worker {role} must produce exactly 20 records")
    output.with_suffix('.wire.json').write_text(json.dumps(payload, ensure_ascii=False, indent=2)+'\n')
    expanded = expand_records(payload, json.loads(prompt.read_text()))
    output.write_text(json.dumps(expanded, ensure_ascii=False, indent=2)+'\n')



def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--batch-index", type=int, required=True, help="one-based batch number")
    parser.add_argument("--output-root", type=Path, required=True)
    parser.add_argument("--worker", help="worker executable, e.g. 'python3 scripts/audit_pipeline/worker_adapter.py'")
    parser.add_argument("--start-stage", choices=tuple(STAGES), help="Reuse and validate earlier stages; refuse changed canonical input")
    parser.add_argument("--stop-after", choices=tuple(STAGES), help="Stop after this validated stage, without claiming full batch acceptance")
    parser.add_argument("--repair-stage", choices=tuple(STAGES), help="Repair an existing rejected stage using its output and exact gate errors")
    parser.add_argument("--force", action="store_true", help="ignore stage fingerprints and call workers again")
    parser.add_argument("--selected-list", type=Path, help="Explicit canonical indices for a selected 20-word batch")
    parser.add_argument("--prepare-stage", choices=tuple(STAGES), help="Write one role request for an external isolated worker; do not execute any role")
    args = parser.parse_args()
    if not args.worker and not args.prepare_stage:
        parser.error("--worker or --prepare-stage is required")
    if args.batch_index < 1:
        parser.error("--batch-index must be positive")
    data = json.loads(DATASET.read_text())
    start = (args.batch_index - 1) * 20
    if args.selected_list:
        selected = json.loads(args.selected_list.read_text())
        members = selected[start:start + 20]
        entries, _ = resolve_entries(data, [m['word'] for m in members], members)
        if len({entry['word'] for entry in entries}) != 20:
            raise SystemExit("selected-list must contain 20 distinct canonical words")
    else:
        entries = data[start : start + 20]
        members = [{'word': e['word'], 'dataset_index': start+i} for i, e in enumerate(entries)]
    if len(entries) != 20:
        raise SystemExit("batch is incomplete; refusing to dispatch")
    batch = args.output_root / f"batch_{args.batch_index:03d}"
    if len({e['word'] for e in entries}) != 20:
        raise SystemExit('Homographs must be scheduled in separate batches')
    batch.mkdir(parents=True, exist_ok=True)
    selection_path = batch / 'selected_indices.json'
    if selection_path.exists() and json.loads(selection_path.read_text()) != members:
        raise SystemExit('Existing batch belongs to a different selection')
    selection_path.write_text(json.dumps(members, ensure_ascii=False, indent=2)+'\n')
    limits = source_limits(ROOT)
    search_packet = prepare_source_search(ROOT, [e['word'] for e in entries], batch / 'source_search.json') if limits else None
    # Mechanical preparation is done once.  Semantic source comparison and
    # meaning order remain model responsibilities in roles 06 and 08.
    preflight = ROOT / "scripts/audit_pipeline/preflight_batch.py"
    if not args.selected_list:
        subprocess.run(
        [sys.executable, str(preflight), "--batch-index", str(args.batch_index),
         "--output-root", str(args.output_root)],
        cwd=ROOT,
        check=True,
        text=True,
    )
    worker = shlex.split(args.worker) if args.worker else []
    prior: dict[str, object] = {}
    manifest_path = batch / ".dispatch_cache.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    for stage, role_file in STAGES.items():
        if (args.prepare_stage and stage < args.prepare_stage) or (args.start_stage and stage < args.start_stage):
            saved_input = json.loads((batch / f"input_{stage}.json").read_text())
            if saved_input.get('entries') != entries:
                raise SystemExit(f'stage {stage}: canonical input changed; cannot reuse')
            if saved_input.get('instructions') != (ROOT / 'agent-roles' / role_file).read_text():
                raise SystemExit(f'stage {stage}: role instructions changed; cannot reuse')
            if saved_input.get('source_search_sha256') != hashlib.sha256(json.dumps(search_packet, ensure_ascii=False, sort_keys=True).encode()).hexdigest():
                raise SystemExit(f'stage {stage}: source packet changed; cannot reuse')
            if stage in {'08','09'}:
                old_seven = saved_input.get('previous_outputs', {}).get('07', [])
                if [r.get('after') for r in old_seven] != [r.get('after') for r in prior.get('07', [])]:
                    raise SystemExit(f'stage {stage}: proposed entry text changed; cannot reuse')
            prior[stage] = json.loads((batch / f"stage_{stage}.json").read_text())
            if [record.get('word') for record in prior[stage]] != [entry['word'] for entry in entries]:
                raise SystemExit(f"stage {stage} word/order mismatch")
            errors = validate_batch(batch, [e['word'] for e in entries], limits, through_stage=stage, entries=entries)
            if errors:
                raise SystemExit('\n'.join(errors))
            continue
        role_path = ROOT / "agent-roles" / role_file
        prompt = batch / f"input_{stage}.json"
        entries_for_model = entries
        payload = {
            "role": stage,
            "role_file": str(role_path.relative_to(ROOT)),
            "instructions": role_path.read_text(),
            "dataset_path": str(DATASET.relative_to(ROOT)),
            "entries": entries_for_model,
            "source_search_sha256": hashlib.sha256(json.dumps(search_packet, ensure_ascii=False, sort_keys=True).encode()).hexdigest() if search_packet else None,
            "prepared_source_search": {
                "file": "source_search.json",
                "helper": "source_search.py",
                "instruction": (
                    "First run python3 source_search.py --packet source_search.json --limit 1. Avoid dumping the entire packet. "
                    "For additional prepared hits use --packet source_search.json --word WORD --limit 3. "
                    "All sources must still be checked; fetch full context whenever the first hit does not establish the sense. "
                    "Cache files contain full page/paragraph text. "
                    "Use python3 source_search.py --cache-file FILE --location N for context or --word WORD --limit N for lexical search. "
                    "Every hit still needs semantic review. Do not repeat PDF extraction or environment discovery."
                ),
            } if search_packet else None,
            "source_inventory": [{"file": name, "locations": maximum} for name, maximum in sorted(limits.items())],
            "source_contract": "Search every file in source_inventory, including those omitted from the role markdown. PDF coordinates: page (one-based). DOCX coordinates: line (one-based XML paragraph index), not paragraph. Return short exact excerpts, not whole pages.",
            "entries_are_compact_for_green": False,
            "previous_outputs": prior,
            "wire_contract_version": 2,
            "compact_stage07": "Omit before/after snapshots; scripts assemble them. For a meaning_proposal omit before_meaning and use edits [{op:'replace',path:'/translation',before:old,after:new}] instead of after_meaning, retaining meaning_index/reason/sources. For linked meaning+phrase changes use entry_proposals: exactly one group {reason,confidence,edits:[{op,path,before,after,reason,sources}]}, no meaning_proposals. Paths are zero-based RFC6901 /meanings/N/translation|partOfSpeech|register or /phrases/N/phrase|translation|partOfSpeech|register. New phrase: add /phrases/- with full phrase object, unique id and empty examples. No deletes, ID changes or example replacement. All related edits belong to one indivisible group.",
            "issue_target_contract": "Issues require problem, required_action and either 1-based meaning_index or target. target is {kind:'meaning'|'phrase',index:1-based}, {kind:'field',path:existing RFC6901 path}, or {kind:'missing_meaning',description:specific missing sense}. Never use null meaning_index alone.",
            "reference_contract": "All entries and previous outputs are complete. Copy before exactly from entries. Stage report meaning_index is one-based. Never invent references or hashes.",
            "model_scope": {
                "full_reasoning_indices": list(range(1, 21)),
                "pass_through_indices": [],
                "instruction": "Проверь каждую запись содержательно. Механическая классификация не разрешает пропускать проверку смысла.",
            },
            "output_contract": {
                "records": 20,
                "meaning_index_base": 1,
                "allowed_decisions": ["изменить", "оставить", "review_required", "принято без изменения"],
                "required_record_fields": ["word", "decision", "reason", "confidence"],
                "field_types": {"confidence": "JSON number in [0,1], e.g. 0.95; never a string or boolean", "reason": "individual nonempty string"},
                "citation_contract": "PDF location requires page; DOCX location requires line (XML paragraph index). quote must contain at least 8 characters and match that location exactly apart from whitespace normalization. Never rewrite or combine disjoint source fragments into one quotation.",
                "stage_specific_fields": {
                    "06": "source_evidence.search_results[{file,query,found,locations|result}]",
                    "07": "before, after, review_reason when review_required",
                    "08": "meanings[{meaning_index,partOfSpeech,primary,decision,reason}]",
                    "09": "checks[{meaning_index,partOfSpeech,translation,examples_checked,problem,generated_example|candidate_example|no_candidate_reason+rejected_attempts}]. Every check must include a meaning-specific problem field, including checks of empty example lists. Every generated_example must include an individual reason field, even when all explicit quality explanations are present.",
                    "10": "evidence_ref, before_after_ref, example_reviews[{meaning_index,candidate_sha256,verdict,confidence,judgments}], issues[{meaning_index,problem,required_action}] when review_required"
                }[stage],
                "word_order": [entry["word"] for entry in entries],
                "output_path": f"stage_{stage}.json",
                "do_not_edit_dataset": True,
            },
        }
        if stage == "06":
            for source_id, source in enumerate(payload["source_inventory"], 1):
                source["source_id"] = source_id
            payload["output_contract"]["stage_specific_fields"] = (
                "source_evidence.search_results[{source_id,query,found,locations|result}]. "
                "Use the source_id from source_inventory instead of retyping the filename. "
                "The dispatcher expands it to the exact filename before validating every citation."
            )
        if stage == "10":
            proposal_errors = validate_proposals(entries, prior['09'], prior['07'])
            if proposal_errors:
                raise SystemExit('Stage 09 invalid; critic not dispatched:\n' + '\n'.join(proposal_errors))
            payload['meaning_bindings'] = [
                {'word': entry['word'], 'meaning_index': proposal['meaning_index'],
                 'proposal_sha256': digest(meaning_binding(entry, proposal))}
                for entry, record in zip(entries, prior.get('07', []))
                for proposal in record.get('meaning_proposals', [])
            ]
            payload['entry_bindings'] = [
                {'word': entry['word'], 'proposal_sha256': digest(entry_binding(entry, proposal))}
                for entry, record in zip(entries, prior.get('07', []))
                for proposal in record.get('entry_proposals', [])
            ]
            payload['entry_review_contract'] = "For each entry_binding return exactly one entry_reviews item with proposal_sha256, verdict, confidence and judgments source_support/translation_accuracy/part_of_speech_accuracy/information_preserved/disposition, each {pass:boolean,reason:concrete}. Judge the linked change as a whole. Do not approve partial groups."
            payload["candidate_bindings"] = [
                {"word": entry["word"], "meaning_index": check["meaning_index"],
                 "candidate_sha256": digest(binding(entry, check["meaning_index"], candidate))}
                for entry, record in zip(entries, prior["09"])
                for check in record.get("checks", [])
                for candidate in [check.get("generated_example") or check.get("candidate_example")]
                if candidate
            ]
        serialized = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
        fingerprint = hashlib.sha256(serialized.encode("utf-8")).hexdigest()
        prompt.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
        if args.prepare_stage:
            print(f"ROLE REQUEST READY: {prompt}")
            return 0
        output = batch / f"stage_{stage}.json"
        cached = (
            args.repair_stage != stage
            and
            not args.force
            and manifest.get(stage, {}).get("fingerprint") == fingerprint
            and output.exists()
            and manifest.get(stage, {}).get("output_sha256") == hashlib.sha256(output.read_bytes()).hexdigest()
        )
        if not cached:
            if args.repair_stage == stage:
                rejected = json.loads(output.read_text())
                repair_errors = validate_batch(batch, [e['word'] for e in entries], limits, through_stage=stage, entries=entries)
                if stage == '09':
                    repair_errors += validate_proposals(entries, rejected, prior['07'])
                if stage == '10':
                    from example_contract import validate_examples
                    from meaning_contract import validate_meanings
                    repair_errors += validate_examples(entries, prior['09'], rejected)
                    repair_errors += validate_meanings(entries, prior['07'], prior['09'], rejected)
                if not repair_errors:
                    raise SystemExit('Repair refused: stage already passes; reuse it normally')
                attempt = 1
                while (batch / f'repair_{stage}_{attempt:03d}').exists():
                    attempt += 1
                archive = batch / f'repair_{stage}_{attempt:03d}'
                archive.mkdir()
                for existing in batch.glob(f'stage_{stage}.*'):
                    if existing.is_file():
                        shutil.copy2(existing, archive / existing.name)
                payload['repair'] = {'rejected_output': rejected, 'errors': repair_errors,
                    'base_hashes': {record['word']: digest(record) for record in rejected},
                    'address_warning': 'Outer repair paths target REPORT RECORDS, not canonical entries. /meanings/... and /phrases/... do NOT exist at the root of stage07 reports. To migrate a stage07 record, replace /meaning_proposals with [] and add /entry_proposals containing one group. INSIDE that group, edits target canonical /meanings/... and /phrases/..., each with authored reason and sources. Preserve the previous after text exactly, including phrase spelling corrections, unless you explicitly justify a semantic change. Do not simply return canonical edits as outer report edits.',
                    'instruction': 'Return exactly 20 compact records {word,base_sha256,edits:[{op:replace|add,path:RFC6901,before:exact old value for replace,after:new value}]}. For unchanged words edits=[]. This repair output contract replaces normal record fields; do NOT repeat full records or snapshots. Assign semantic decisions yourself; never invent evidence. Repair only reported errors. Scripts verify base hashes, apply edits to copies and run the full unchanged gate.'}
                prompt.write_text(json.dumps(payload, ensure_ascii=False, indent=2)+'\n')
            run_worker(worker, stage, prompt, output)
            manifest[stage] = {"fingerprint": fingerprint, "output": output.name, "output_sha256": hashlib.sha256(output.read_bytes()).hexdigest()}
            manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
        else:
            # Cached output is still parsed and checked before it is passed on.
            json.loads(output.read_text())
            print(f"CACHE HIT batch_{args.batch_index:03d}/stage_{stage}")
        prior[stage] = json.loads(output.read_text())
        errors = validate_batch(batch, [e['word'] for e in entries], limits, through_stage=stage, entries=entries)
        if errors:
            raise SystemExit('Stage rejected before next worker:\n' + '\n'.join(errors))
        if args.stop_after == stage:
            print(f'STAGE {stage} VALIDATED; full batch acceptance still required')
            return 0
    gate = ROOT / "scripts/audit_pipeline/validate_reports.py"
    qa = subprocess.run([sys.executable, str(ROOT / "final_qa_validation.py")], cwd=ROOT, capture_output=True, text=True)
    (batch / "final_qa_validation.txt").write_text(qa.stdout + qa.stderr)
    if qa.returncode:
        raise SystemExit(qa.returncode)
    with tempfile.TemporaryDirectory(prefix="audit-gate-") as gate_root:
        (Path(gate_root) / batch.name).symlink_to(batch.resolve(), target_is_directory=True)
        gate_args = [sys.executable, str(gate), gate_root, "--start-index", str(start), "--run-final-qa"]
        if args.selected_list:
            selected_current = Path(gate_root) / 'selected.json'
            selected_current.write_text(json.dumps(members, ensure_ascii=False))
            gate_args += ['--selected-list', str(selected_current)]
        result = subprocess.run(
            gate_args,
            cwd=ROOT, text=True,
        )
    if result.returncode:
        raise SystemExit(result.returncode)
    print(f"DISPATCH PASSED: batch {args.batch_index:03d}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
