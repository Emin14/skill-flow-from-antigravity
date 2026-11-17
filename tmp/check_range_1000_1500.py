import io, json

data = json.load(io.open('src/data/oxford_5000.json', 'r', encoding='utf-8'))
print(f"Total entries: {len(data)}")
print(f"Word 1000: {data[1000]['word']}")
print(f"Word 1499: {data[1499]['word']}")
print(f"Word 1500: {data[1500]['word']}")
