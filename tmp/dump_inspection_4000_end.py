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

out = io.open('tmp/inspect_4000_end_clean.txt', 'w', encoding='utf-8')
out.write(f"Glued POS headers ({len(pos_headers)}):\n")
for w, mid, val in pos_headers:
    out.write(f"  {w} [{mid}]: {val}\n")

out.write(f"\nPOS others in {len(pos_others)} words:\n")
for w, lst in list(pos_others.items()):
    out.write(f"  {w}: {len(lst)} meanings\n")
    for mid, val in lst:
        out.write(f"    - [{mid}] {val}\n")

out.write(f"\nGlued idioms ({len(glued_idioms)}):\n")
for w, mid, fld, val in glued_idioms:
    out.write(f"  {w} [{mid}] ({fld}): {val}\n")
out.close()
print("Saved to tmp/inspect_4000_end_clean.txt")
