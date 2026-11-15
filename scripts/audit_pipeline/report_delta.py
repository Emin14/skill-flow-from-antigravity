"""Lossless mechanical assembly of model-authored deltas. No semantic defaults."""
import copy
import re
from example_contract import digest


def tokens(path):
    if not isinstance(path, str) or not path.startswith('/') or re.search(r'~(?![01])', path):
        raise ValueError('Expected RFC6901 JSON pointer')
    return [part.replace('~1', '/').replace('~0', '~') for part in path[1:].split('/')]


def at(document, path):
    value = document
    for key in tokens(path):
        if isinstance(value, list):
            if not re.fullmatch(r'0|[1-9][0-9]*', key):
                raise ValueError('Array index must be a nonnegative integer')
            value = value[int(key)]
        else:
            value = value[key]
    return value


def patch(document, edits):
    """Only explicit replace/add, with preconditions. Work on a private copy."""
    if not isinstance(edits, list):
        raise ValueError('edits must be an array')
    result = copy.deepcopy(document)
    seen = []
    for edit in edits:
        path = edit['path']; parts = tokens(path)
        parent = result
        for key in parts[:-1]:
            parent = parent[int(key)] if isinstance(parent, list) and re.fullmatch(r'0|[1-9][0-9]*', key) else parent[key]
        key = parts[-1]
        # Each append addresses a different newly allocated array slot.
        # Compare concrete targets so repeated '/-' is allowed, while a later
        # replacement of that appended slot remains a conflicting operation.
        target = parts[:-1] + [str(len(parent))] if isinstance(parent, list) and key == '-' and edit.get('op') == 'add' else parts
        if any(target == other or target[:len(other)] == other or other[:len(target)] == target for other in seen):
            raise ValueError('Duplicate or overlapping edit paths')
        seen.append(target)
        if edit.get('op') == 'replace':
            if at(result,path) != edit['before']:
                raise ValueError('Stale before at '+path)
            if isinstance(parent, list): key=int(key)
            parent[key] = copy.deepcopy(edit['after'])
        elif edit.get('op') == 'add':
            if isinstance(parent,list):
                if key != '-': raise ValueError('Only array append is supported')
                parent.append(copy.deepcopy(edit['after']))
            else:
                if key in parent: raise ValueError('Add target already exists')
                parent[key]=copy.deepcopy(edit['after'])
        else:
            raise ValueError('Only add/replace are allowed; deletion requires separate review')
    return result


def expand_records(records, request):
    if not isinstance(records,list) or len(records)!=len(request['entries']):
        raise ValueError('One record per selected entry is required')
    expanded=[]
    rejected = request.get('repair',{}).get('rejected_output')
    source_names = {
        source['source_id']: source['file']
        for source in request.get('source_inventory', [])
        if 'source_id' in source
    }
    for entry, raw in zip(request['entries'],records):
        if not isinstance(raw,dict) or raw.get('word')!=entry['word']:
            raise ValueError('Word/order mismatch in compact output')
        record=copy.deepcopy(raw)
        if rejected is not None:
            base=next(r for r in rejected if r['word']==entry['word'])
            if record.get('base_sha256')!=digest(base) or set(record)!={'word','base_sha256','edits'}:
                raise ValueError('Repair requires word, exact base_sha256 and edits only')
            if any(tokens(e['path'])[0]=='word' for e in record['edits']):
                raise ValueError('Repair cannot change word identity')
            if request['role']=='07' and any(tokens(e['path'])[0] in ('before','after') for e in record['edits']):
                raise ValueError('Repair proposals, not assembled snapshots')
            record=patch(base,record['edits'])
            if request['role']=='07':
                record.pop('before',None);record.pop('after',None)
        if request['role'] == '06':
            for result in record.get('source_evidence', {}).get('search_results', []):
                if 'source_id' not in result:
                    continue
                source_id = result.pop('source_id')
                if type(source_id) is not int or source_id not in source_names:
                    raise ValueError(f"Unknown source ID for {record['word']}: {source_id!r}")
                filename = source_names[source_id]
                if 'file' in result and result['file'] != filename:
                    raise ValueError(f"Conflicting source ID and filename for {record['word']}")
                result['file'] = filename
        if request['role']=='07':
            from entry_contract import proposed_after
            before=copy.deepcopy(entry)
            after=proposed_after(entry,record)
            if 'before' in record and record['before']!=before:
                raise ValueError('Incorrect supplied before snapshot')
            if 'after' in record and record['after']!=after:
                raise ValueError('After contains unrepresented changes')
            record['before']=before;record['after']=after
        expanded.append(record)
    return expanded
