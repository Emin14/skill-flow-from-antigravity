"""Resolve canonical identity without silently choosing the last homograph."""
import json


def resolve_entries(data, words, selected=None):
    if selected is not None:
        if isinstance(selected, dict):
            selected = selected['records']
        if len(selected) != len(words):
            raise ValueError('Selection length does not match report')
        indices = [record['dataset_index'] for record in selected]
        if any(type(i) is not int or not 0 <= i < len(data) for i in indices):
            raise ValueError('Invalid canonical dataset_index')
        if len(set(indices)) != len(indices):
            raise ValueError('Repeated canonical dataset_index')
        entries = [data[i] for i in indices]
        if [e['word'] for e in entries] != words or [r['word'] for r in selected] != words:
            raise ValueError('Selected word/index mismatch')
        return entries, indices
    indices = []
    for word in words:
        matches = [i for i, entry in enumerate(data) if entry['word'] == word]
        if len(matches) != 1:
            raise ValueError(f'{word}: ambiguous or missing canonical entry; explicit selected_indices.json required')
        indices.append(matches[0])
    return [data[i] for i in indices], indices


def batch_selection(batch):
    path = batch / 'selected_indices.json'
    return json.loads(path.read_text()) if path.exists() else None
