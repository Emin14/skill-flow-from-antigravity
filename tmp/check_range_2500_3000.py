import io, json

data = json.load(io.open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
print(f"Total entries: {len(data)}")
print(f"Word 2500: {data[2500]['word']}")
print(f"Word 2999: {data[2999]['word']}")
print(f"Word 3000: {data[3000]['word']}")
