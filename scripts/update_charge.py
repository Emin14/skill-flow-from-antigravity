import json
import sys

# Read source oxford_5000.json
with open('oxford_5000.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

charge_meanings = [
    {
        "id": 1,
        "partOfSpeech": "noun",
        "translation": "цена, плата",
        "examples": [
            {
                "en": "what is the charge?",
                "ru": "сколько это стоит?"
            },
            {
                "en": "his charges are reasonable",
                "ru": "у него цены вполне умеренные"
            }
        ]
    },
    {
        "id": 2,
        "partOfSpeech": "noun",
        "translation": "(преим. во мн.ч.) расходы",
        "examples": [
            {
                "en": "charges forward",
                "ru": "доставка за счёт покупателя"
            },
            {
                "en": "at his own charge",
                "ru": "на его собственный счёт"
            },
            {
                "en": "all charges included",
                "ru": "включая все затраты"
            }
        ]
    },
    {
        "id": 3,
        "partOfSpeech": "noun",
        "translation": "налог; сбор",
        "examples": [
            {
                "en": "scale of charges",
                "ru": "тариф"
            }
        ]
    },
    {
        "id": 4,
        "partOfSpeech": "noun",
        "translation": "долговое обязательство",
        "examples": []
    },
    {
        "id": 5,
        "partOfSpeech": "noun",
        "translation": "обвинение",
        "examples": [
            {
                "en": "to dismiss a charge",
                "ru": "отклонить обвинение"
            }
        ]
    },
    {
        "id": 6,
        "partOfSpeech": "noun",
        "translation": "атака",
        "examples": []
    },
    {
        "id": 7,
        "partOfSpeech": "noun",
        "translation": "попечение; надзор",
        "examples": [
            {
                "en": "the child is in my charge",
                "ru": "этот ребёнок на моём попечении"
            },
            {
                "en": "I am in charge of it",
                "ru": "я за это отвечаю"
            }
        ]
    },
    {
        "id": 8,
        "partOfSpeech": "noun",
        "translation": "обязанности",
        "examples": [
            {
                "en": "I am in charge here",
                "ru": "я здесь заведую"
            },
            {
                "en": "to take charge of",
                "ru": "взять на себя контроль над"
            }
        ]
    },
    {
        "id": 9,
        "partOfSpeech": "noun",
        "translation": "подопечный",
        "examples": []
    },
    {
        "id": 10,
        "partOfSpeech": "noun",
        "translation": "пороховой заряд; патрон",
        "examples": [
            {
                "en": "charge of gunpowder",
                "ru": "пороховой заряд"
            }
        ]
    },
    {
        "id": 11,
        "partOfSpeech": "noun",
        "translation": "(электрический) заряд",
        "examples": [
            {
                "en": "the battery is on charge",
                "ru": "батарея заряжается"
            }
        ]
    },
    {
        "id": 12,
        "partOfSpeech": "verb",
        "translation": "запрашивать цену",
        "examples": [
            {
                "en": "he charged £25 for the book",
                "ru": "он запросил 25 фунтов за эту книгу"
            }
        ]
    },
    {
        "id": 13,
        "partOfSpeech": "verb",
        "translation": "записывать в долг",
        "examples": []
    },
    {
        "id": 14,
        "partOfSpeech": "verb",
        "translation": "обвинять",
        "examples": [
            {
                "en": "he is charged with murder",
                "ru": "его обвиняют в убийстве"
            }
        ]
    },
    {
        "id": 15,
        "partOfSpeech": "verb",
        "translation": "атаковать",
        "examples": []
    },
    {
        "id": 16,
        "partOfSpeech": "verb",
        "translation": "нагружать",
        "examples": [
            {
                "en": "to charge one’s memory with facts",
                "ru": "перегружать свою память фактами"
            }
        ]
    },
    {
        "id": 17,
        "partOfSpeech": "verb",
        "translation": "насыщать",
        "examples": []
    },
    {
        "id": 18,
        "partOfSpeech": "verb",
        "translation": "заряжать (оружие, аккумулятор)",
        "examples": []
    },
    {
        "id": 19,
        "partOfSpeech": "verb",
        "translation": "поручать",
        "examples": []
    }
]

# Update the charge entry
found = False
for item in data:
    if item.get('word') == 'charge':
        item['meanings'] = charge_meanings
        found = True
        break

if not found:
    print('Error: charge not found in dataset!')
    sys.exit(1)

# Write to oxford_5000_updated.json
with open('oxford_5000_updated.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Successfully created oxford_5000_updated.json with updated charge meanings!')
