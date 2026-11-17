import io, json

data = json.load(io.open('src/data/oxford_5000.json', 'r', encoding='utf-8'))
print(f"Total entries: {len(data)}")
print(f"Word 3500: {data[3500]['word']}")
print(f"Word 3999: {data[3999]['word']}")
print(f"Word 4000: {data[4000]['word']}")
