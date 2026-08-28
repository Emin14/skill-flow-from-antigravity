import io, json

data = json.load(io.open('oxford_5000_2026-08-27.json', 'r', encoding='utf-8'))
print(f"Total entries: {len(data)}")
print(f"Word 1500: {data[1500]['word']}")
print(f"Word 1999: {data[1999]['word']}")
print(f"Word 2000: {data[2000]['word']}")
