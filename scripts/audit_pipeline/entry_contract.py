"""One independently reviewed atomic entry group for linked meaning/phrase edits."""
import copy
import re
from example_contract import digest
from report_delta import patch, at

CRITERIA=('source_support','translation_accuracy','part_of_speech_accuracy','information_preserved','disposition')


def group_after(entry, group):
    edits=group.get('edits')
    if not isinstance(edits,list) or not edits:
        raise ValueError('Atomic group needs explicit edits')
    for edit in edits:
        path=edit.get('path','')
        permitted = re.fullmatch(r'/(?:meanings/(?:0|[1-9][0-9]*)/(?:translation|partOfSpeech|register)|phrases/(?:0|[1-9][0-9]*)/(?:phrase|translation|partOfSpeech|register))',path)
        append = path=='/phrases/-' and edit.get('op')=='add'
        if not permitted and not append:
            raise ValueError('Unsupported entry path (IDs/examples/order are protected): '+path)
        if permitted and edit.get('op')!='replace':
            raise ValueError('Existing fields require explicit replacement')
        phrase_syntax = re.fullmatch(r'/phrases/(0|[1-9][0-9]*)/partOfSpeech', path) is not None
        if not edit.get('reason') or not isinstance(edit.get('sources'),list) or (not edit['sources'] and not phrase_syntax):
            raise ValueError('Each edit needs reason and sources; only existing phrase POS may use its unchanged text as evidence')
        if phrase_syntax and not edit['sources']:
            phrase_index=int(path.split('/')[2])
            phrase=entry.get('phrases',[])[phrase_index]
            if not isinstance(phrase.get('phrase'),str) or not phrase['phrase'].strip():
                raise ValueError('Phrase syntax review requires actual phrase text')
            if any(e.get('path')==f'/phrases/{phrase_index}/phrase' for e in edits):
                raise ValueError('Changed phrase text requires external evidence for POS as well')
        from meaning_contract import local_citation_errors
        for source in edit['sources']:
            if not isinstance(source,dict) or not (source.get('file') or source.get('url')) or not source.get('quote'):
                raise ValueError('Edit source requires file/URL and exact quote')
            errors=local_citation_errors(source)
            if source.get('file'):
                from pathlib import Path
                from meaning_contract import ROOT
                from source_quotes import quote_error
                file=Path(source['file'])
                if not file.is_absolute():file=ROOT/file
                if file.suffix.lower() in ('.pdf','.docx'):
                    coordinate='page' if file.suffix.lower()=='.pdf' else 'line'
                    location=source.get('location',{})
                    number=source.get(coordinate,location.get(coordinate) if isinstance(location,dict) else None)
                    if type(number) is not int or number<1:errors.append('Source requires explicit page/line')
                    else:
                        problem=quote_error(file,number,source['quote'])
                        if problem:errors.append(problem)
            if errors: raise ValueError('; '.join(errors))
        after=edit.get('after')
        if append:
            if not isinstance(after,dict) or not all(isinstance(after.get(k),str) and after[k].strip() for k in ('phrase','translation','partOfSpeech')) or after.get('examples')!=[] or not isinstance(after.get('register'),list) or type(after.get('id')) is not int:
                raise ValueError('New phrase requires id/phrase/POS/translation/register and empty examples')
        elif path.endswith('/register'):
            if not isinstance(after,list) or any(not isinstance(x,str) for x in after): raise ValueError('register must be a string list')
        elif not isinstance(after,str) or not after.strip():
            raise ValueError('Text replacements cannot be empty')
    base=copy.deepcopy(entry)
    if 'phrases' not in base and any(e.get('path')=='/phrases/-' and e.get('op')=='add' for e in edits):
        base['phrases']=[]
    result=patch(base,edits)
    ids=[p['id'] for p in result.get('phrases',[])]
    if len(ids)!=len(set(ids)): raise ValueError('Duplicate phrase IDs')
    if not group.get('reason') or type(group.get('confidence')) not in (int,float) or not 0<=group['confidence']<=1:
        raise ValueError('Atomic group needs reason and numeric confidence')
    return result


def proposed_after(entry, author):
    groups=author.get('entry_proposals',[])
    if groups:
        if len(groups)!=1 or author.get('meaning_proposals'):
            raise ValueError('Use exactly one linked entry group OR legacy meaning proposals')
        return group_after(entry,groups[0])
    result=copy.deepcopy(entry)
    seen=set()
    for proposal in author.get('meaning_proposals',[]):
        index=proposal['meaning_index']
        if type(index) is not int or not 1<=index<=len(entry['meanings']) or index in seen:
            raise ValueError('Invalid or repeated meaning index')
        seen.add(index)
        before=entry['meanings'][index-1]
        if proposal.get('before_meaning',before)!=before: raise ValueError('Stale meaning before')
        proposal['before_meaning']=copy.deepcopy(before)
        if 'edits' in proposal:
            after=patch(before,proposal['edits'])
            if 'after_meaning' in proposal and proposal['after_meaning']!=after: raise ValueError('Inconsistent meaning delta')
            proposal['after_meaning']=after
            proposal.pop('edits')
        after=proposal['after_meaning']
        if not isinstance(after,dict) or set(after)!=set(before) or any(after[k]!=before[k] for k in set(before)-{'translation','partOfSpeech','register'}):
            raise ValueError('Meaning proposal may change translation/POS/register only')
        result['meanings'][index-1]=copy.deepcopy(after)
    return result


def entry_binding(entry, group):
    return {'before_entry':entry,'proposal':group}


def validate_entry_review(entry, author, editor, critic):
    errors=[]
    try:after=proposed_after(entry,copy.deepcopy(author))
    except (ValueError,KeyError,TypeError,IndexError) as exc:return [str(exc)]
    if author.get('before')!=entry or author.get('after')!=after:
        errors.append('Atomic entry snapshots mismatch')
    groups=author.get('entry_proposals',[]);reviews=critic.get('entry_reviews',[])
    if len(reviews)!=1 or not groups:return errors+['Exactly one independent entry review required']
    review=reviews[0]
    if review.get('proposal_sha256')!=digest(entry_binding(entry,groups[0])): errors.append('Stale atomic entry review')
    if review.get('verdict') not in ('approved','rejected','review_required'):errors.append('Invalid atomic verdict')
    if type(review.get('confidence')) not in (int,float) or not 0<=review['confidence']<=1:errors.append('Invalid atomic confidence')
    for key in CRITERIA:
        j=review.get('judgments',{}).get(key,{})
        if type(j.get('pass')) is not bool or not isinstance(j.get('reason'),str) or not j['reason'].strip():errors.append('Missing atomic judgment '+key)
        elif review.get('verdict')=='approved' and not j['pass']:errors.append('Contradictory atomic approval '+key)
    if review.get('verdict')=='approved' and critic.get('decision') not in ('изменить','review_required'):errors.append('Atomic approval requires change decision')
    for check in editor.get('checks',[]):
        candidate=check.get('generated_example') or check.get('candidate_example')
        i=check.get('meaning_index',0)-1
        if candidate and 0<=i<len(entry['meanings']):
            if after['meanings'][i]!=entry['meanings'][i] and candidate.get('sense_after')!=after['meanings'][i]:errors.append('Example must bind atomic proposed sense')
            elif candidate.get('sense_after') and candidate['sense_after']!=after['meanings'][i]:errors.append('Incorrect atomic example sense')
    return errors


def issue_target_errors(issue, entry=None):
    if not isinstance(issue,dict) or not all(isinstance(issue.get(k),str) and issue[k].strip() for k in ('problem','required_action')):
        return ['Issue needs concrete problem/required_action']
    target=issue.get('target')
    if target is None:
        i=issue.get('meaning_index')
        if type(i) is not int or i<1 or (entry and i>len(entry['meanings'])):return ['Issue needs valid meaning_index or explicit typed target']
        return []
    if issue.get('meaning_index') is not None:return ['Use one unambiguous issue address']
    if not isinstance(target,dict):return ['Issue target must be an object']
    kind=target.get('kind')
    if kind in ('meaning','phrase'):
        i=target.get('index');collection='meanings' if kind=='meaning' else 'phrases'
        if type(i) is not int or i<1 or (entry is not None and i>len(entry.get(collection,[]))):return ['Invalid typed issue index']
    elif kind=='field':
        try:
            if entry is not None:at(entry,target['path'])
            elif not target.get('path','').startswith('/'):raise ValueError()
        except (KeyError,ValueError,IndexError,TypeError):return ['Issue field does not exist']
    elif kind=='missing_meaning':
        if not isinstance(target.get('description'),str) or not target['description'].strip():return ['Missing meaning must be described explicitly']
    else:return ['Unsupported issue target kind']
    return []
