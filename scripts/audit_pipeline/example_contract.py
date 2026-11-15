"""Machine-verifiable contract around independent semantic example review.

Checks linkage and completeness, not English correctness. Roles 09/10 remain
responsible for semantic judgments; no automatic positive verdict is produced.
"""
from __future__ import annotations
import hashlib
import json
import re

DIMENSIONS = ('target_usage', 'sense_match', 'part_of_speech', 'natural_english',
              'translation_fidelity', 'learner_suitability', 'distinct_from_other_meanings', 'contemporary_usage')


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                    separators=(',', ':')).encode()).hexdigest()


def binding(entry, index, candidate):
    return {'word': entry['word'], 'meaning_index': index,
            'meaning': entry['meanings'][index - 1], 'candidate': candidate}


def candidate_checks(entry, index, candidate):
    errors = []
    if not isinstance(candidate, dict):
        return ['candidate must be an object']
    for key in ('en', 'ru', 'target_form', 'sense_explanation', 'translation_explanation', 'contrast'):
        if not isinstance(candidate.get(key), str) or not candidate[key].strip():
            errors.append(f'candidate missing {key}')
    if candidate.get('before_examples') != entry['meanings'][index - 1].get('examples', []):
        errors.append('candidate before_examples does not match canonical meaning')
    if candidate.get('usage_status') not in ('current', 'current_specialist'):
        errors.append('only current or current_specialist examples are eligible')
    if not isinstance(candidate.get('contemporary_explanation'), str) or not candidate['contemporary_explanation'].strip():
        errors.append('candidate needs a contemporary usage explanation')
    if candidate.get('usage_status') == 'current_specialist':
        sources = candidate.get('contemporary_sources')
        if not isinstance(sources, list) or not sources or any(not isinstance(source, dict) or not (source.get('url') or source.get('file')) or not source.get('quote') or not source.get('context') for source in sources):
            errors.append('current specialist use requires concrete contemporary sources')
    unit_type = candidate.get('unit_type', 'word')
    if unit_type not in ('word', 'prefix', 'phrase'):
        errors.append('invalid lexical unit type')
    if unit_type == 'prefix':
        after = candidate.get('sense_after', {})
        if after.get('partOfSpeech') != 'prefix' or candidate.get('target_unit') != entry['word'].casefold() + '-':
            errors.append('prefix example requires explicit reviewed prefix meaning and unit')
        if not candidate.get('morphology_explanation') or not candidate.get('target_form', '').casefold().startswith(entry['word'].casefold()):
            errors.append('prefix morphology must be explained and present in target compound')
    form = candidate.get('target_form', '')
    if form and not re.search(r'(?<!\w)' + re.escape(form) + r'(?!\w)', candidate.get('en', ''), re.I):
        errors.append('target_form is absent from English sentence')
    if candidate.get('target_lemma', '').casefold() != entry['word'].casefold():
        errors.append('candidate target_lemma does not match word')
    # Only the semantic reviewer can decide if target_form is a valid inflection
    # (e.g. went -> go); spelling similarity is NOT a semantic check.
    searches = candidate.get('source_searches')
    if not isinstance(searches, list) or not searches:
        errors.append('candidate missing source searches')
    else:
        for search in searches:
            if not isinstance(search, dict) or not all(isinstance(search.get(k), str) and search[k].strip()
                                                      for k in ('file', 'query', 'result')):
                errors.append('source search needs file/query/result')
    return errors



def candidate_selection_errors(meaning, check, candidates):
    if len(candidates) > 1:
        return ['select exactly one candidate']
    if candidates or meaning.get('examples'):
        return []
    attempts = check.get('rejected_attempts')
    if (not check.get('no_candidate_reason') or not isinstance(attempts, list)
            or len(attempts) < 2
            or any(not isinstance(a, dict) or not all(a.get(k) for k in ('en', 'ru', 'problem')) for a in attempts)):
        return ['empty meaning needs a candidate or two explained rejected attempts']
    return []


def validate_proposals(entries, stage09, stage07=None):
    """Fail before spending a critic call on malformed author output."""
    if [r.get('word') for r in stage09] != [e['word'] for e in entries]:
        return ['stage09 word order mismatch']
    if stage07 is not None and [r.get('word') for r in stage07] != [e['word'] for e in entries]:
        return ['stage07 word order mismatch']
    errors = []
    for position, (entry, record) in enumerate(zip(entries, stage09)):
        checks = record.get('checks', [])
        if not isinstance(checks, list) or sorted([c.get('meaning_index') for c in checks], key=str) != sorted(range(1, len(entry['meanings']) + 1), key=str):
            errors.append(f"{entry['word']}: stage09 must check every meaning exactly once")
            continue
        for check in checks:
            index = check['meaning_index']
            meaning = entry['meanings'][index - 1]
            if check.get('examples_checked') != len(meaning.get('examples', [])):
                errors.append(f"{entry['word']}/{index}: wrong canonical examples_checked")
            candidates = [check[k] for k in ('generated_example', 'candidate_example') if check.get(k)]
            selection_errors = candidate_selection_errors(meaning, check, candidates)
            errors.extend(f"{entry['word']}/{index}: {e}" for e in selection_errors)
            if candidates and not selection_errors:
                errors.extend(f"{entry['word']}/{index}: {e}" for e in candidate_checks(entry, index, candidates[0]))
                if stage07 is not None:
                    author = stage07[position]
                    sense = candidates[0].get('sense_after')
                    if author.get('entry_proposals'):
                        proposed = author['after']['meanings'][index - 1]
                        required = proposed != meaning
                    else:
                        proposed = next((p['after_meaning'] for p in author.get('meaning_proposals', [])
                                         if p['meaning_index'] == index), None)
                        required = proposed is not None
                    if (required or sense) and sense != proposed:
                        errors.append(f"{entry['word']}/{index}: example sense_after must match the stage07 proposal")
    return errors


def validate_examples(entries, stage09, stage10):
    errors = []
    if [r.get('word') for r in stage09] != [e['word'] for e in entries] or [r.get('word') for r in stage10] != [e['word'] for e in entries]:
        return ['example contract word order does not match canonical selection']
    review_hashes = set()
    for entry, author, critic in zip(entries, stage09, stage10):
        word = entry['word']
        checks = author.get('checks', [])
        indices = [c.get('meaning_index') for c in checks]
        if sorted(indices, key=str) != sorted(range(1, len(entry.get('meanings', [])) + 1), key=str):
            errors.append(f'{word}: stage09 must check every canonical meaning exactly once')
            continue
        reviews = critic.get('example_reviews', [])
        if not isinstance(reviews, list):
            errors.append(f'{word}: example_reviews must be an array')
            continue
        used = set()
        for check in checks:
            index = check['meaning_index']
            prefix = f'{word}/meaning_{index}'
            meaning = entry['meanings'][index - 1]
            # Count is the number of EXISTING examples, never includes a proposal.
            if check.get('examples_checked') != len(meaning.get('examples', [])):
                errors.append(f'{prefix}: examples_checked must count canonical examples only')
            candidates = [check[k] for k in ('generated_example', 'candidate_example') if check.get(k)]
            errors.extend(f'{prefix}: {e}' for e in candidate_selection_errors(meaning, check, candidates))
            if len(candidates) > 1:
                continue
            if not candidates:
                if not meaning.get('examples'):
                    if critic.get('decision') != 'review_required':
                        errors.append(f'{prefix}: unresolved empty meaning must be review_required')
                continue
            candidate = candidates[0]
            errors.extend(f'{prefix}: {e}' for e in candidate_checks(entry, index, candidate))
            sha = digest(binding(entry, index, candidate))
            matches = [r for r in reviews if r.get('meaning_index') == index]
            if len(matches) != 1:
                errors.append(f'{prefix}: exactly one independent review required')
                continue
            used.add(index)
            review = matches[0]
            if review.get('candidate_sha256') != sha:
                errors.append(f'{prefix}: review is stale or belongs to another candidate/sense')
            if review.get('verdict') not in ('approved', 'rejected', 'review_required'):
                errors.append(f'{prefix}: invalid review verdict')
            judgments = review.get('judgments', {})
            if not isinstance(judgments, dict):
                judgments = {}
            for dimension in DIMENSIONS:
                judgment = judgments.get(dimension, {})
                if not isinstance(judgment, dict) or type(judgment.get('pass')) is not bool or not isinstance(judgment.get('reason'), str) or not judgment['reason'].strip():
                    errors.append(f'{prefix}: missing concrete judgment for {dimension}')
                elif review.get('verdict') == 'approved' and judgment['pass'] is not True:
                    errors.append(f'{prefix}: approval contradicts failed {dimension}')
            fingerprint = digest(judgments)
            if fingerprint in review_hashes:
                errors.append(f'{prefix}: repeated semantic review judgments')
            review_hashes.add(fingerprint)
            conf = review.get('confidence')
            if isinstance(conf, bool) or not isinstance(conf, (float, int)) or not 0 <= conf <= 1:
                errors.append(f'{prefix}: missing review confidence')
            if review.get('verdict') == 'approved':
                if critic.get('decision') not in ('изменить', 'review_required'):
                    errors.append(f'{prefix}: approved addition requires word decision изменить')
            elif critic.get('decision') != 'review_required':
                errors.append(f'{prefix}: rejected/unresolved candidate must be review_required')
        if any(r.get('meaning_index') not in used for r in reviews):
            errors.append(f'{word}: review without candidate')
    return errors


def approved_changes(entries, stage09, stage10):
    errors = validate_examples(entries, stage09, stage10)
    if errors:
        raise ValueError('\n'.join(errors))
    changes = []
    for entry, author, critic in zip(entries, stage09, stage10):
        for check in author.get('checks', []):
            candidate = check.get('generated_example') or check.get('candidate_example')
            if not candidate:
                continue
            index = check['meaning_index']
            review = next(r for r in critic['example_reviews'] if r['meaning_index'] == index)
            if review['verdict'] != 'approved':
                continue
            changes.append({'word': entry['word'], 'meaning_index': index - 1,
                            'before_examples': entry['meanings'][index - 1].get('examples', []),
                            'after_example': {k: candidate[k] for k in ('en', 'ru')},
                            'decision': 'изменить', 'candidate_sha256': review['candidate_sha256']})
    return changes
