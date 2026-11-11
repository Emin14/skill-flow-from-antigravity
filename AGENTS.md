<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Oxford 5000 / Muller Dataset Rules & Immutability Invariants

1. **Single Canonical Dataset:**
   Any dictionary change MUST be made only in the canonical dataset:
   - `src/data/oxford_5000.json`

   All application code and maintenance scripts MUST read this file. Do not create or maintain duplicate dictionary copies.

2. **Review Before Replacement:**
   Any dictionary entry may be improved, including previously corrected words and participle adjectives. Automated agents must compare the old and new text, preserve useful existing information, record the reason for the change, and never replace a good entry with raw OCR/PDF text without evidence.

3. **Validation Mandate:**
   `final_qa_validation.py` must always pass with 0 errors after any modifications.

4. **Strict Audit Report Mandate:**
   Reports for roles 06–10 are valid only after the executable report gate passes:
   `python3 scripts/audit_pipeline/validate_reports.py <report-root> --run-final-qa`.
   The gate must reject missing per-source search results, generic evidence, missing
   before/after data, invalid page/line references, repeated evidence or reasons,
   missing primary/order checks, missing final references, and vague
   `review_required` reasons without per-meaning issues and required actions. A passing
   `final_qa_validation.py` alone does not certify an audit report.

5. **Fail-Fast Batch Rule:**
   Audit orchestration must validate one 20-word batch completely before creating or
   accepting the next batch. Any report-gate error stops the run and leaves the
   canonical dataset unchanged until the batch is repaired and revalidated.

6. **Role Execution Contract:**
   The five dictionary roles are executed through
   `scripts/audit_pipeline/dispatch_roles.py`. A role worker receives only its
   role prompt, the current 20 entries, and explicitly declared previous JSON
   outputs. It must write exactly 20 records to its assigned stage file. Workers
   must not edit the canonical dataset or another role's output.

7. **Empty Example Rule:**
   Role 09 must run a source-backed example search for every meaning whose
   `examples` array is empty. A candidate may be proposed with a source file,
   page/line, exact quote, semantic match, and natural translation. If no
   suitable source example is found, role 09 must create a new original
   pedagogical example in the existing `examples[].en`/`examples[].ru`
   structure. The report marks it `origin: generated` with an individual reason
   and quality checks; this marker must not be required by application code and
   generated text must never be presented as a quotation. `no_candidate_reason`
   is allowed only in the rare case where several attempts cannot avoid
   ambiguity with another meaning; ordinary lack of a source quote is not
   sufficient.

8. **Automation Boundary:**
   Deterministic preparation and validation may be performed by scripts:
   selecting exactly 20 canonical entries, checking word order against the
   dataset, inventorying local sources, checking pages/lines, matching exact
   quotes, checking JSON structure, detecting duplicate evidence/reasons,
   running final QA, caching unchanged stages, and stopping on errors.
   Scripts MUST NOT choose the pedagogically primary meaning, reorder meanings,
   judge semantic equivalence, rewrite translations, or generate examples.
   Those decisions remain with the independent role agents, especially roles
   06, 08, and 09. `preflight_batch.py` records mechanical facts only; it is
   not an approval stage and cannot replace semantic review.


9. **Independent Example Acceptance (v2):**
   Roles 09/10 must receive full meanings and real example texts even for green
   entries. Every proposed example must include target form, source search,
   meaning-specific explanation, contrast with nearby senses, translation
   explanation, and exact before_examples. Role 10 must independently record
   seven concrete judgments and a candidate hash from example_contract.py.
   A structural pass or word-level "accepted without change" never authorizes
   adding an example. Only build_examples_manifest.py may create a manifest for
   apply_examples_manifest.py, which rechecks independent approvals before
   applying. A changed sentence/sense invalidates its approval. Rare uses must
   not be fabricated; documented failed attempts receive review_required.

10. **Modern Examples Only:**
    New examples must illustrate natural contemporary usage. Authentic archaic
    quotations and obsolete constructions are not acceptable additions even
    with register labels. Do not disguise them by removing labels or substituting
    modern objects. Current technical usage is allowed when substantiated.
    If a meaning has no contemporary use, preserve it pending explicit review
    of that meaning instead of fabricating a modern-sounding example.
