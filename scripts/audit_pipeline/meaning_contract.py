"""Bind meaning clarification to source-backed proposals and independent review."""
from __future__ import annotations
import copy
import re
import unicodedata
from pathlib import Path
from functools import lru_cache
from example_contract import digest

ROOT = Path(__file__).resolve().parents[2]

@lru_cache(maxsize=32)
def source_lines(path, mtime_ns, size):
    return Path(path).read_bytes().decode('utf8').split('\n')

def local_citation_errors(source):
    if not source.get('file'):
        return []
    path = Path(source['file'])
    if not path.is_absolute():
        path = ROOT / path
    if not path.is_file():
        return ['citation file does not exist']
    if path.suffix.lower() not in ('.txt', '.md'):
        return []  # PDF/DOCX locations are separately checked in role06.
    start = source.get('line', source.get('line_start'))
    end = source.get('line_end', start)
    stat = path.stat()
    lines = source_lines(str(path), stat.st_mtime_ns, stat.st_size)
    if type(start) is not int or type(end) is not int or not 1 <= start <= end <= len(lines):
        return ['invalid text citation line range']
    clean = lambda value: re.sub(r'\s+', ' ', unicodedata.normalize('NFC', value)).strip()
    if clean(source.get('quote', '')) not in clean('\n'.join(lines[start - 1:end])):
        return ['quote not present at cited text lines']
    return []

FIELDS = {'translation', 'partOfSpeech', 'register'}
CRITERIA = ('source_support', 'translation_accuracy', 'part_of_speech_accuracy',
            'information_preserved', 'disposition')


def meaning_binding(entry, proposal):
    return {'word': entry['word'], 'meaning_index': proposal['meaning_index'],
            'before_meaning': entry['meanings'][proposal['meaning_index'] - 1],
            'proposal': proposal}


def validate_meanings(entries, stage07, stage09, stage10):
    errors = []
    words = [e['word'] for e in entries]
    judgments_seen = set()
    if any([r.get('word') for r in stage] != words for stage in (stage07, stage09, stage10)):
        return ['meaning review word order mismatch']
    for entry, author, editor, critic in zip(entries, stage07, stage09, stage10):
        if author.get('entry_proposals'):
            from entry_contract import validate_entry_review
            errors.extend(entry['word']+': '+e for e in validate_entry_review(entry,author,editor,critic))
            for review in critic.get('entry_reviews', []):
                fingerprint=digest(review.get('judgments', {}))
                if fingerprint in judgments_seen:errors.append(entry['word']+': repeated atomic review judgments')
                judgments_seen.add(fingerprint)
            if critic.get('meaning_reviews'):
                errors.append(entry['word']+': orphan legacy meaning reviews for atomic group')
            continue
        if critic.get('entry_reviews'):
            errors.append(entry['word']+': orphan atomic entry reviews')
        proposals = author.get('meaning_proposals', [])
        reviews = critic.get('meaning_reviews', [])
        expected_after = copy.deepcopy(entry)
        seen = set()
        for proposal in proposals:
            index = proposal.get('meaning_index')
            prefix = f"{entry['word']}/meaning_{index}"
            if type(index) is not int or not 1 <= index <= len(entry['meanings']) or index in seen:
                errors.append(prefix + ': invalid/duplicate meaning proposal')
                continue
            seen.add(index)
            before = entry['meanings'][index - 1]
            after = proposal.get('after_meaning')
            if proposal.get('before_meaning') != before or not isinstance(after, dict):
                errors.append(prefix + ': before/after meaning mismatch')
                continue
            if set(after) != set(before) or any(after[k] != before[k] for k in set(before) - FIELDS):
                errors.append(prefix + ': may clarify POS/translation/register only; keep examples, IDs, primary and structure')
            if not all(isinstance(after.get(k), str) and after[k].strip() for k in ('translation', 'partOfSpeech')):
                errors.append(prefix + ': empty POS/translation')
            if not isinstance(after.get('register', []), list):
                errors.append(prefix + ': invalid register')
            if not proposal.get('reason') or not proposal.get('sources'):
                errors.append(prefix + ': missing concrete reason/sources')
            for source in proposal.get('sources', []):
                if not isinstance(source, dict) or not (source.get('url') or source.get('file')) or not source.get('quote'):
                    errors.append(prefix + ': source must have URL/file and exact short quote')
                else:
                    errors.extend(prefix + ': ' + e for e in local_citation_errors(source))
            expected_after['meanings'][index - 1] = after
            matches = [r for r in reviews if r.get('meaning_index') == index]
            if len(matches) != 1:
                errors.append(prefix + ': independent meaning review required')
                continue
            review = matches[0]
            if review.get('proposal_sha256') != digest(meaning_binding(entry, proposal)):
                errors.append(prefix + ': stale meaning review')
            if review.get('verdict') not in ('approved', 'rejected', 'review_required'):
                errors.append(prefix + ': invalid meaning verdict')
            fingerprint = digest(review.get('judgments', {}))
            if fingerprint in judgments_seen:
                errors.append(prefix + ': repeated meaning review judgments')
            judgments_seen.add(fingerprint)
            confidence = review.get('confidence')
            if type(confidence) not in (int, float) or not 0 <= confidence <= 1:
                errors.append(prefix + ': invalid meaning confidence')
            for criterion in CRITERIA:
                judgment = review.get('judgments', {}).get(criterion, {})
                if type(judgment.get('pass')) is not bool or not judgment.get('reason'):
                    errors.append(prefix + ': missing judgment ' + criterion)
                elif review['verdict'] == 'approved' and not judgment['pass']:
                    errors.append(prefix + ': contradictory meaning approval ' + criterion)
            check = next((c for c in editor.get('checks', []) if c.get('meaning_index') == index), {})
            candidate = check.get('generated_example') or check.get('candidate_example')
            if candidate and candidate.get('sense_after') != after:
                errors.append(prefix + ': example must explicitly bind the proposed clarified meaning')
        if (proposals or 'before' in author or 'after' in author) and (author.get('before') != entry or author.get('after') != expected_after):
            errors.append(entry['word'] + ': stage07 entry snapshots do not match meaning proposals')
        if len(reviews) != len(seen) or any(r.get('meaning_index') not in seen for r in reviews):
            errors.append(entry['word'] + ': orphan/duplicate meaning review')
        for check in editor.get('checks', []):
            candidate = check.get('generated_example') or check.get('candidate_example')
            if candidate and candidate.get('sense_after') and check.get('meaning_index') not in seen:
                errors.append(entry['word'] + ': unproposed example sense_after')
    return errors


def combined_changes(entries, stage07, stage09, stage10, deferred=None):
    from example_contract import approved_changes
    errors = validate_meanings(entries, stage07, stage09, stage10)
    if errors:
        raise ValueError('\n'.join(errors))
    if deferred is None: deferred=[]
    approved = approved_changes(entries, stage09, stage10)
    replacements={(c['word'],c['meaning_index']) for c in approved if c['before_examples']}
    for c in approved:
        if c['before_examples']:
            deferred.append({'word':c['word'],'meaning_index':c['meaning_index']+1,'candidate_sha256':c['candidate_sha256'],
                             'reason':'Approved candidate targets existing examples; replacement requires a separate preservation contract'})
    examples = {(c['word'], c['meaning_index']): c for c in approved if not c['before_examples']}
    changes = []
    for entry, author, critic in zip(entries, stage07, stage10):
        if author.get('entry_proposals'):
            review=critic['entry_reviews'][0]
            word_examples={k:v for k,v in examples.items() if k[0]==entry['word']}
            after=copy.deepcopy(author['after'])
            dependent={i for i,(before,proposed) in enumerate(zip(entry['meanings'],after['meanings'])) if before!=proposed}
            if review['verdict']!='approved':
                for key in word_examples:
                    if key[1] in dependent:
                        examples.pop(key)
                        deferred.append({'word':entry['word'],'meaning_index':key[1]+1,'reason':'Example depends on an atomic entry change that is not approved'})
                continue
            editor = next(r for r in stage09 if r['word']==entry['word'])
            blocked = any((entry['word'],i) in replacements for i in dependent)
            for check in editor.get('checks', []):
                i=check['meaning_index']-1
                candidate=check.get('generated_example') or check.get('candidate_example')
                if candidate and after['meanings'][i]!=entry['meanings'][i]:
                    ex_review=next(r for r in critic.get('example_reviews',[]) if r['meaning_index']==i+1)
                    if ex_review['verdict']!='approved':blocked=True
            if blocked:
                deferred.append({'word':entry['word'],'reason':'Atomic group deferred because a dependent example is rejected, unresolved or needs replacement of existing examples'})
                for key in word_examples:
                    if key[1] in dependent:examples.pop(key)
                continue
            for key in word_examples: examples.pop(key)
            # Existing examples may not be overwritten, even if a critic approved a new sentence.
            for key, ex in word_examples.items():
                if entry['meanings'][key[1]].get('examples'):
                    raise ValueError('Atomic group cannot overwrite pre-existing examples')
                after['meanings'][key[1]]['examples']=[ex['after_example']]
            changes.append({'word':entry['word'],'before_entry':copy.deepcopy(entry),'after_entry':after,
                            'entry_review_sha256':review['proposal_sha256'],
                            'candidate_hashes':[ex['candidate_sha256'] for ex in word_examples.values()],
                            'decision':'изменить'})
            continue
        for proposal in author.get('meaning_proposals', []):
            index = proposal['meaning_index']
            key = (entry['word'], index - 1)
            review = next(r for r in critic['meaning_reviews'] if r['meaning_index'] == index)
            if review['verdict'] != 'approved':
                examples.pop(key, None)  # A rejected definition cannot receive its proposed example.
                continue
            if key in replacements:
                deferred.append({'word':entry['word'],'meaning_index':index,'reason':'Meaning clarification deferred together with its unsupported example replacement'})
                continue
            before = entry['meanings'][index - 1]
            after = copy.deepcopy(proposal['after_meaning'])
            ex = examples.pop(key, None)
            if ex:
                if before.get('examples'):
                    raise ValueError('Clarification must preserve all pre-existing examples')
                after['examples'] = [ex['after_example']]
            if after != before:
                changes.append({'word': entry['word'], 'meaning_index': index - 1,
                                'before_meaning': before, 'after_meaning': after,
                                'decision': 'изменить', 'meaning_review_sha256': review['proposal_sha256'],
                                'candidate_sha256': ex['candidate_sha256'] if ex else None})
    return changes + list(examples.values())
