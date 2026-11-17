# Hermes + Oxford 5000 transfer checklist

## Canonical state at handoff

- Canonical dataset: `src/data/oxford_5000.json`
- Entries: `4981`
- SHA-256: `3fea87743818579c5db7fd299d3f49fb6cce693b6cafe49ff0a9b5c8271a5df7`
- Structural QA:

```text
python3 final_qa_validation.py
# 4981 entries
# Total errors found: 0
```

The dataset is already audited through the `frequency_rank 601–800` cycle. Do not restart those cycles. Read the manifests under `dictionary_audit_cycles/` before proposing any change.

## Immutable operating rules

1. Edit only `src/data/oxford_5000.json`.
2. Use `tmp/muller_full_text.txt` as the primary source.
3. Before every canonical write, create a cycle backup and manifest under `dictionary_audit_cycles/<cycle>/`.
4. Every change must record: word, exact path, before, after, reason, source location, and contamination origin/destination when material is moved.
5. Never apply a stale candidate: assert the live `before` value first.
6. Preserve useful meanings and learner lookup paths. Do not delete a meaning merely because a phrase also exists in `phrases[]`.
7. Do not add schema fields. Use existing suffixed headwords for explicit homonyms (`match1`, `match2`, `league1`, etc.).
8. Run `python3 final_qa_validation.py` after every write and report the resulting SHA-256.
9. A `keep_current` result is valid. Do not re-audit a completed cycle unless the canonical SHA or source changed.

## Current unresolved queue

These are not automatically confirmed errors; they require source-backed structural work or a representation-policy decision:

- `drive`, `stand`, `sign`, `bed`: optional source phrase coverage and construction ownership;
- `written`: existing noun + `form_of` convention is retained;
- `rock`, `speak`, `write`, `cold`, `except`, `eye`, `store`: no remaining safe scalar repair after source read-back;
- duplicate storage between `meanings[].examples` and `phrases[]`: preserve both until a project-wide policy says otherwise.

## Safe restart procedure on another computer

```bash
cd /path/to/skill-flow-from-antigravity
git status --short
sha256sum src/data/oxford_5000.json   # macOS: shasum -a 256 ...
python3 final_qa_validation.py
```

The SHA must equal the handoff SHA before continuing. If it differs, stop and inspect the latest manifest and backup instead of starting a new audit.

Start Hermes from the repository root so it loads this repository's `AGENTS.md` and project context:

```bash
hermes
```

Use a new session with a focused title, for example:

```text
Continue the Oxford 5000 audit from docs/HERMES_OXFORD_TRANSFER.md. First verify the canonical SHA and QA. Do not recheck ranks 1–800. Work only on the unresolved queue and apply only source-confirmed changes.
```

## Git workflow

Commit the canonical dataset, manifests, backups, and this handoff file together at a verified checkpoint. Do not commit secrets from Hermes home (`.env`, `auth.json`, provider tokens) or local session databases.

Recommended checkpoint:

```bash
git add src/data/oxford_5000.json dictionary_audit_cycles docs/HERMES_OXFORD_TRANSFER.md
python3 final_qa_validation.py
git commit -m "Oxford 5000 verified audit checkpoint"
git tag oxford-5000-verified-601-800
```

If a second computer must be able to roll back, keep both the git tag and the cycle backup. Git restores tracked files; the cycle backup preserves the exact pre-apply dataset for that cycle.
