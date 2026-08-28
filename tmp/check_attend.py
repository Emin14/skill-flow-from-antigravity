import io, json

data = json.load(io.open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))

for e in data:
    if e['word'] == 'attend':
        for m in e['meanings']:
            if m['id'] == 5:
                print(f"attend meaning [5] translation: {m['translation']}")
                print(f"attend meaning [5] examples ({len(m['examples'])}):")
                for i, ex in enumerate(m['examples']):
                    print(f"  [{i}] EN: {ex.get('en','')}")
                    print(f"  [{i}] RU: {ex.get('ru','')}")
            if m['id'] == 6:
                print(f"\nattend meaning [6] translation: {m['translation']}")
                print(f"attend meaning [6] examples ({len(m['examples'])}):")
                for i, ex in enumerate(m['examples']):
                    print(f"  [{i}] EN: {ex.get('en','')}")
                    print(f"  [{i}] RU: {ex.get('ru','')}")
        break
