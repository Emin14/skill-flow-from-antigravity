import io, json

report = json.load(io.open('tmp/audit_4000_end_full_report.json', 'r', encoding='utf-8'))

pos_headers = []
pos_others = {}
glued_idioms = []

for r in report:
    w = r['word']
    for iss in r['issues']:
        t = iss['type']
        if t == 'glued_pos_header':
            pos_headers.append((w, iss['mid'], iss['val']))
        elif t == 'pos_other':
            if w not in pos_others:
                pos_others[w] = []
            pos_others[w].append((iss['mid'], iss['val']))
        elif t == 'glued_idiom':
            glued_idioms.append((w, iss['mid'], iss['field'], iss['val']))

print(f"Glued POS headers ({len(pos_headers)}):")
for w, mid, val in pos_headers:
    print(f"  {w} [{mid}]: {val[:60]}")

print(f"\nPOS others in {len(pos_others)} words:")
for w, lst in list(pos_others.items()):
    print(f"  {w}: {len(lst)} meanings")

print(f"\nGlued idioms ({len(glued_idioms)}):")
for w, mid, fld, val in glued_idioms[:20]:
    print(f"  {w} [{mid}] ({fld}): {val[:60]}")
