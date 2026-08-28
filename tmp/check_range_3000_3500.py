import io, json

data = json.load(io.open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
print(f"Total entries: {len(data)}")
print(f"Word 3000: {data[3000]['word']}")
print(f"Word 3499: {data[3499]['word']}")
print(f"Word 3500: {data[3500]['word']}")
