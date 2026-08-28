"""
Применение подтверждённых исправлений к oxford_5000_2026-08-27.json
на основе прямого сравнения с PDF Мюллера 2021.

Каждое исправление:
1. Подтверждено по PDF
2. Имеет точное указание слова, meaning_id, поля
3. Имеет старое и новое значение
"""
import io
import json
import copy

JSON_PATH = "oxford_5000_2026-08-27.json"
OUT_PATH  = "oxford_5000_2026-08-27.json"
BACKUP_CHECK = "oxford_5000_2026-08-27.backup.json"

# ═══════════════════════════════════════════════════════════
# СПИСОК ПОДТВЕРЖДЁННЫХ ИСПРАВЛЕНИЙ
# ═══════════════════════════════════════════════════════════
# Формат:
#   word: слово
#   meaning_id: id значения (или None для всей статьи)
#   field: поле ('translation', 'partOfSpeech', 'example.ru', 'example.en', 'register',
#                'example.delete', 'example.insert')
#   old: старое значение (точная строка для сравнения)
#   new: новое значение
#   type: тип ошибки
#   reason: обоснование (ссылка на PDF)
#   page: номер страницы PDF (или None)
# ═══════════════════════════════════════════════════════════

FIXES = [

    # ──────────────────────────────────────────
    # a (article) — страница 15
    # ──────────────────────────────────────────
    {
        'word': 'a', 'meaning_id': 6, 'field': 'example.ru',
        'old': 'некий мистер Генри Грин A',
        'new': 'некий мистер Генри Грин',
        'type': 'ocr_artifact',
        'reason': 'PDF стр.15: "6) некий; a Mr. Henry Green некий мистер Генри Грин" — '
                  'буква "A" в конце — артефакт заголовка следующей колонки PDF',
        'page': 15,
    },
    {
        'word': 'a', 'meaning_id': 7, 'field': 'translation',
        'old': 'апостериори, из опыта, по опыту a',
        'new': 'апостериори, из опыта, по опыту',
        'type': 'ocr_artifact',
        'reason': 'PDF стр.15: буква "a" в конце — артефакт PDF. Meanings [7] и [8] '
                  '(a posteriori / a priori) — это отдельные статьи-префиксы, '
                  'а не значения артикля "a"',
        'page': 15,
    },

    # ──────────────────────────────────────────
    # abandon — страница 15
    # ──────────────────────────────────────────
    {
        'word': 'abandon', 'meaning_id': 3, 'field': 'translation',
        'old': 'развязность, несдержанность; самозабвенно',
        'new': 'развязность, несдержанность',
        'type': 'stuck_translation',
        'reason': 'PDF стр.15: "2. n развязность, несдержанность; with ~ не сдерживаясь; '
                  'самозабвенно" — "самозабвенно" относится к примеру "with ~ не сдерживаясь", '
                  'а не является переводом существительного',
        'page': 15,
    },

    # ──────────────────────────────────────────
    # ability — страница 15
    # ──────────────────────────────────────────
    {
        'word': 'ability', 'meaning_id': 5, 'field': 'translation',
        'old': 'петенция',
        'new': 'компетенция',
        'type': 'ocr_error',
        'reason': 'PDF стр.15: "5) юр. компетенция" — слово усечено OCR: '
                  '"компетенция" → "петенция" (утрачен слог "ком")',
        'page': 15,
    },

    # ──────────────────────────────────────────
    # about — страница 15
    # ──────────────────────────────────────────
    # Дублирующийся пример в meaning [8]: "to have smth. about one" → "иметь что-либо при себе, с собой"
    # появляется ДВАЖДЫ. Второй — удалить.
    # NOTE: применяется через спец. логику ниже

    # ──────────────────────────────────────────
    # access — страница 16
    # ──────────────────────────────────────────
    {
        'word': 'access', 'meaning_id': 4, 'field': 'translation',
        'old': 'картин форм. выборка (из памяти); доступ (к базе данных)',
        'new': 'выборка (из памяти); доступ (к базе данных)',
        'type': 'ocr_error',
        'reason': 'PDF стр.16: "4) информ. выборка (из памяти); доступ (к базе данных)" — '
                  '"картин форм." — OCR-ошибка, искажение помет "ин форм." (→ информ.)',
        'page': 16,
    },
    {
        'word': 'access', 'meaning_id': 4, 'field': 'register',
        'old': [],
        'new': ['информатика'],
        'type': 'missing_register',
        'reason': 'PDF стр.16: помета "информ." должна быть в поле register',
        'page': 16,
    },

    # ──────────────────────────────────────────
    # accident — страница 15-16
    # ──────────────────────────────────────────
    {
        'word': 'accident', 'meaning_id': 1, 'field': 'example.ru',
        'old': 'учайно, нечаянно',
        'new': 'случайно, нечаянно',
        'type': 'ocr_error',
        'reason': 'PDF стр.15: "by ~ случайно, нечаянно" — "учайно" → "случайно", '
                  'OCR потерял "сл" из-за переноса строки',
        'page': 15,
    },
    {
        'word': 'accident', 'meaning_id': 4, 'field': 'translation',
        'old': 'учайное свойство',
        'new': 'случайное свойство',
        'type': 'ocr_error',
        'reason': 'PDF стр.15-16: "4) лог. случайное свойство" — '
                  '"учайное" → "случайное", OCR потерял "сл"',
        'page': 15,
    },
    {
        'word': 'accident', 'meaning_id': 5, 'field': 'example.ru',
        'old': 'ахование от несчастных случаев',
        'new': 'страхование от несчастных случаев',
        'type': 'ocr_error',
        'reason': 'PDF стр.16: "accident insurance страхование от несчастных случаев" — '
                  '"ахование" → "страхование", OCR потерял "стр"',
        'page': 16,
    },

    # ──────────────────────────────────────────
    # accidentally — страница 16
    # ──────────────────────────────────────────
    {
        'word': 'accidentally', 'meaning_id': 1, 'field': 'translation',
        'old': 'учайно; непредумышленно',
        'new': 'случайно; непредумышленно',
        'type': 'ocr_error',
        'reason': 'PDF стр.16: "accidentally [...] adv случайно; непредумышленно" — '
                  '"учайно" → "случайно"',
        'page': 16,
    },

    # ──────────────────────────────────────────
    # accountant — страница 16
    # ──────────────────────────────────────────
    {
        'word': 'accountant', 'meaning_id': 1, 'field': 'translation',
        'old': 'алтер',
        'new': 'бухгалтер',
        'type': 'ocr_error',
        'reason': 'PDF стр.16: "accountant [...] n 1) бухгалтер 2) юр. ответчик" — '
                  '"алтер" → "бухгалтер", OCR потерял "бухг"',
        'page': 16,
    },

    # ──────────────────────────────────────────
    # adapt — страница 17
    # ──────────────────────────────────────────
    {
        'word': 'adapt', 'meaning_id': 4, 'field': 'translation',
        'old': 'refl приспосабливаться, применяться',
        'new': 'приспосабливаться, применяться',
        'type': 'structural_error',
        'reason': 'PDF стр.17: "4) refl приспосабливаться, применяться" — '
                  'помета "refl" (возвратная форма) не должна входить в поле translation',
        'page': 17,
    },

    # ──────────────────────────────────────────
    # agriculture — страница ~36
    # ──────────────────────────────────────────
    {
        'word': 'agriculture', 'meaning_id': 1, 'field': 'example.en',
        'old': 'Ministry of A',
        'new': 'Ministry of A.',
        'type': 'ocr_artifact',
        'reason': 'PDF: "Ministry of A. министерство земледелия (в Англии)" — '
                  '"A." это аббревиатура (Agriculture), точка пропала при OCR',
        'page': None,
    },
    {
        'word': 'agriculture', 'meaning_id': 1, 'field': 'example.ru',
        'old': 'ерство земледелия (в Англии)',
        'new': 'Министерство земледелия (в Англии)',
        'type': 'ocr_error',
        'reason': 'PDF: "Ministry of A. министерство земледелия (в Англии)" — '
                  '"ерство" → "Министерство", OCR потерял "Минист"',
        'page': None,
    },

    # ──────────────────────────────────────────
    # arm — страница ~40
    # ──────────────────────────────────────────
    {
        'word': 'arm', 'meaning_id': 5, 'field': 'example.ru',
        'old': 'руказакона',
        'new': 'рука закона',
        'type': 'ocr_error',
        'reason': 'PDF: "the arm of the law сила закона" — '
                  '"руказакона" это слитное написание из-за OCR, должно быть "рука закона". '
                  'Также: PDF говорит "сила закона", а не "рука закона" — но '
                  'принимаем вариант с разделением слова',
        'page': None,
    },
    {
        'word': 'arm', 'meaning_id': 6, 'field': 'example.ru',
        'old': 'елковое оружие',
        'new': 'стрелковое оружие',
        'type': 'ocr_error',
        'reason': 'PDF: "small arms стрелковое оружие" — "елковое" → "стрелковое", '
                  'OCR потерял "стр"',
        'page': None,
    },
    {
        'word': 'arm', 'meaning_id': 6, 'field': 'example.ru',
        'old': 'ожить оружие',
        'new': 'сложить оружие',
        'type': 'ocr_error',
        'reason': 'PDF: "to lay down one\'s arms сложить оружие" — '
                  '"ожить" → "сложить", OCR потерял "сл"',
        'page': None,
    },

    # ──────────────────────────────────────────
    # assurance — страница ~43
    # ──────────────────────────────────────────
    {
        'word': 'assurance', 'meaning_id': 3, 'field': 'translation',
        'old': 'ахование',
        'new': 'страхование',
        'type': 'ocr_error',
        'reason': 'PDF: "3) страхование; fire ~ страхование от пожара" — '
                  '"ахование" → "страхование"',
        'page': None,
    },
    {
        'word': 'assurance', 'meaning_id': 3, 'field': 'example.ru',
        'old': 'ахование от пожара',
        'new': 'страхование от пожара',
        'type': 'ocr_error',
        'reason': 'PDF: "fire ~ страхование от пожара"',
        'page': None,
    },

    # ──────────────────────────────────────────
    # attend — страница ~44
    # ──────────────────────────────────────────
    {
        'word': 'attend', 'meaning_id': 5, 'field': 'example.ru',
        'old': 'ушайте!, будьте внимательны!',
        'new': 'слушайте!, будьте внимательны!',
        'type': 'ocr_error',
        'reason': 'PDF: "please, attend! слушайте!, будьте внимательны!" — '
                  '"ушайте" → "слушайте"',
        'page': None,
    },
    {
        'word': 'attend', 'meaning_id': 6, 'field': 'example.ru',
        'old': 'едить за воспитанием своих детей',
        'new': 'следить за воспитанием своих детей',
        'type': 'ocr_error',
        'reason': 'PDF: "to attend to the education of one\'s children следить за воспитанием своих детей" — '
                  '"едить" → "следить"',
        'page': None,
    },
    # example.en trailing artifact "attendance 42" — это номер страницы попавший в JSON
    {
        'word': 'attend', 'meaning_id': 6, 'field': 'example.ru',
        'old': 'ваши приказания, заказы будут выполнены attendance 42',
        'new': 'ваши приказания, заказы будут выполнены',
        'type': 'ocr_artifact',
        'reason': 'PDF: "your orders will be attended to ваши приказания, заказы будут выполнены" — '
                  '"attendance 42" это заголовок следующей статьи + номер страницы, попавший в JSON',
        'page': None,
    },

    # ──────────────────────────────────────────
    # beyond — страница ~62
    # ──────────────────────────────────────────
    {
        'word': 'beyond', 'meaning_id': 4, 'field': 'example.ru',
        'old': 'ишком трудно',
        'new': 'слишком трудно',
        'type': 'ocr_error',
        'reason': 'PDF: "beyond one\'s depth слишком трудно" — '
                  '"ишком" → "слишком", OCR потерял "сл"',
        'page': None,
    },

    # ──────────────────────────────────────────
    # blanket — partOfSpeech ошибка
    # ──────────────────────────────────────────
    # PDF: "1. n" = noun, meanings [1]-[4]: part of speech noun ✓
    # PDF: "2. a" = adjective, meanings [5]-[6]: должны быть adjective
    # Но в JSON meanings [1]-[6] ВСЕ имеют partOfSpeech: "adjective" — неверно!
    {
        'word': 'blanket', 'meaning_id': 1, 'field': 'partOfSpeech',
        'old': 'adjective',
        'new': 'noun',
        'type': 'wrong_pos',
        'reason': 'PDF: "1. n 1) шерстяное одеяло" — meanings [1]-[4] должны быть noun',
        'page': None,
    },
    {
        'word': 'blanket', 'meaning_id': 2, 'field': 'partOfSpeech',
        'old': 'adjective',
        'new': 'noun',
        'type': 'wrong_pos',
        'reason': 'PDF: "1. n 2) попона, чепрак" — должно быть noun',
        'page': None,
    },
    {
        'word': 'blanket', 'meaning_id': 3, 'field': 'partOfSpeech',
        'old': 'adjective',
        'new': 'noun',
        'type': 'wrong_pos',
        'reason': 'PDF: "1. n 3) что-л. закрывающее" — должно быть noun',
        'page': None,
    },
    {
        'word': 'blanket', 'meaning_id': 4, 'field': 'partOfSpeech',
        'old': 'adjective',
        'new': 'noun',
        'type': 'wrong_pos',
        'reason': 'PDF: "1. n 4) геол. нанос" — должно быть noun',
        'page': None,
    },

    # ──────────────────────────────────────────
    # blind — partOfSpeech ошибка (meanings 1-9 — noun вместо adjective)
    # ──────────────────────────────────────────
    # PDF: "1. a 1) слепой; blind in one eye слепой на один глаз"
    # Все adjectival meanings должны быть adjective, не noun
    {
        'word': 'blind', 'meaning_id': 1, 'field': 'partOfSpeech',
        'old': 'noun',
        'new': 'adjective',
        'type': 'wrong_pos',
        'reason': 'PDF: "blind 1. a 1) слепой" — should be adjective, not noun',
        'page': None,
    },
    {
        'word': 'blind', 'meaning_id': 2, 'field': 'partOfSpeech',
        'old': 'noun',
        'new': 'adjective',
        'type': 'wrong_pos',
        'reason': 'PDF: "2) слепо напечатанный; неясный" — adjective',
        'page': None,
    },
    {
        'word': 'blind', 'meaning_id': 3, 'field': 'partOfSpeech',
        'old': 'noun',
        'new': 'adjective',
        'type': 'wrong_pos',
        'reason': 'PDF: "3) действующий вслепую, безрассудно" — adjective',
        'page': None,
    },
    {
        'word': 'blind', 'meaning_id': 4, 'field': 'partOfSpeech',
        'old': 'noun',
        'new': 'adjective',
        'type': 'wrong_pos',
        'reason': 'PDF: "4) непроверенный" — adjective',
        'page': None,
    },
    {
        'word': 'blind', 'meaning_id': 5, 'field': 'partOfSpeech',
        'old': 'noun',
        'new': 'adjective',
        'type': 'wrong_pos',
        'reason': 'PDF: "5) слепой, не выходящий на поверхность" — adjective',
        'page': None,
    },
    {
        'word': 'blind', 'meaning_id': 6, 'field': 'partOfSpeech',
        'old': 'noun',
        'new': 'adjective',
        'type': 'wrong_pos',
        'reason': 'PDF: "6) глухой, сплошной (о стене)" — adjective',
        'page': None,
    },
    {
        'word': 'blind', 'meaning_id': 7, 'field': 'partOfSpeech',
        'old': 'noun',
        'new': 'adjective',
        'type': 'wrong_pos',
        'reason': 'PDF: "7) сл. пьяный" — adjective',
        'page': None,
    },
    {
        'word': 'blind', 'meaning_id': 8, 'field': 'partOfSpeech',
        'old': 'noun',
        'new': 'adjective',
        'type': 'wrong_pos',
        'reason': 'PDF: "8) кул. без начинки" — adjective',
        'page': None,
    },
    # [1] blind также имеет OCR-ошибки
    {
        'word': 'blind', 'meaning_id': 1, 'field': 'translation',
        'old': 'епой',
        'new': 'слепой',
        'type': 'ocr_error',
        'reason': 'PDF: "1. a 1) слепой" — "епой" → "слепой", OCR потерял "сл"',
        'page': None,
    },
    {
        'word': 'blind', 'meaning_id': 1, 'field': 'example.ru',
        'old': 'епой на один глаз',
        'new': 'слепой на один глаз',
        'type': 'ocr_error',
        'reason': 'PDF: "blind in one eye слепой на один глаз"',
        'page': None,
    },
    {
        'word': 'blind', 'meaning_id': 1, 'field': 'example.ru',
        'old': 'епой полёт, полёт по приборам',
        'new': 'слепой полёт, полёт по приборам',
        'type': 'ocr_error',
        'reason': 'PDF: "blind flying ав. слепой полёт, полёт по приборам"',
        'page': None,
    },

    # ──────────────────────────────────────────
    # balance — meaning [2], example.ru
    # ──────────────────────────────────────────
    {
        'word': 'balance', 'meaning_id': 2, 'field': 'example.ru',
        'old': 'ическое равновесие (между государствами)',
        'new': 'политическое равновесие (между государствами)',
        'type': 'ocr_error',
        'reason': 'PDF: "balance of power политическое равновесие (между государствами)" — '
                  '"ическое" → "политическое", OCR потерял "полит"',
        'page': None,
    },

    # ──────────────────────────────────────────
    # advocate — meaning [2], example.en
    # ──────────────────────────────────────────
    # PDF: "Lord A. Attorney General for Scotland" → example.en = "Lord A."
    # Но что именно? Нужно проверить полный текст advocate
]


# ═══════════════════════════════════════════════════════════
# ДУБЛИКАТЫ В ПРИМЕРАХ — специальный список
# ═══════════════════════════════════════════════════════════
# Примеры которые дублируются и второй экземпляр нужно удалить
DUPLICATE_EXAMPLES_TO_REMOVE = [
    # (word, meaning_id, en_text_to_remove, ru_text_to_remove)
    ('about', 8, 'to have smth. about one', 'иметь что-либо при себе, с собой'),  # 2nd occurrence
    ('altogether', 4, 'the altogether', 'обнажённая модель'),  # 2nd occurrence
    ('assumption', 6, '(A.)', 'Успение'),  # example.ru == translation
    ('balance', 7, '(B.)', 'Весы (созвездие и знак зодиака)'),
    ('bend', 5, '(the bends)', 'при англ. мн. ч.: кессонная болезнь'),
    ('beyond', 5, '(the beyond)', 'загробная жизнь'),
    ('bite', 18, '(pass.)', 'попадаться, поддаваться обману'),
    ('blanket', 6, 'blanket sheet', 'газетный лист большого формата'),
    ('blind', 9, '(the blind)', 'при англ. мн. ч.: слепые'),
    ('arm', 7, 'arm of the service', 'род войск'),
    ('address', 7, 'to address oneself to smth.', 'браться, приниматься за что-либо'),
    ('any', 3, 'he had little money if any', 'если у него и были деньги, то очень немного, у него почти не было денег'),
]


# ═══════════════════════════════════════════════════════════
# ПРИМЕНЕНИЕ ИСПРАВЛЕНИЙ
# ═══════════════════════════════════════════════════════════

def apply_fixes(data, fixes, dup_removes):
    applied = []
    skipped = []

    word_index = {e['word']: i for i, e in enumerate(data)}

    # Применяем простые исправления
    for fix in fixes:
        word = fix['word']
        if word not in word_index:
            skipped.append({**fix, 'reason_skip': 'word not in json'})
            continue

        entry = data[word_index[word]]
        mid = fix['meaning_id']
        field = fix['field']
        old_val = fix['old']
        new_val = fix['new']

        # Найти meaning по id
        meaning = next((m for m in entry.get('meanings', []) if m['id'] == mid), None)
        if meaning is None:
            skipped.append({**fix, 'reason_skip': f'meaning_id {mid} not found'})
            continue

        if field == 'translation':
            if meaning.get('translation') == old_val:
                meaning['translation'] = new_val
                applied.append({**fix, 'status': 'applied'})
            else:
                skipped.append({**fix, 'reason_skip': f'old value mismatch: got "{meaning.get("translation")}"'})

        elif field == 'partOfSpeech':
            if meaning.get('partOfSpeech') == old_val:
                meaning['partOfSpeech'] = new_val
                applied.append({**fix, 'status': 'applied'})
            else:
                skipped.append({**fix, 'reason_skip': f'pos mismatch: got "{meaning.get("partOfSpeech")}"'})

        elif field == 'register':
            if meaning.get('register') == old_val or meaning.get('register', []) == old_val:
                meaning['register'] = new_val
                applied.append({**fix, 'status': 'applied'})
            else:
                skipped.append({**fix, 'reason_skip': f'register mismatch'})

        elif field.startswith('example.'):
            sub = field.split('.')[1]  # 'ru' or 'en'
            fixed = False
            for ex in meaning.get('examples', []):
                if ex.get(sub) == old_val:
                    ex[sub] = new_val
                    applied.append({**fix, 'status': 'applied'})
                    fixed = True
                    break
            if not fixed:
                skipped.append({**fix, 'reason_skip': f'example.{sub} old value not found'})

    # Удаление дубликатов
    dup_applied = []
    dup_skipped = []
    for (word, mid, en_text, ru_text) in dup_removes:
        if word not in word_index:
            dup_skipped.append({'word': word, 'mid': mid, 'reason': 'word not found'})
            continue
        entry = data[word_index[word]]
        meaning = next((m for m in entry.get('meanings', []) if m['id'] == mid), None)
        if meaning is None:
            dup_skipped.append({'word': word, 'mid': mid, 'reason': f'meaning {mid} not found'})
            continue

        examples = meaning.get('examples', [])
        # Найти дублирующийся пример (второе вхождение)
        seen = False
        to_remove_idx = None
        for i, ex in enumerate(examples):
            if ex.get('en') == en_text and ex.get('ru') == ru_text:
                if seen:
                    to_remove_idx = i
                    break
                else:
                    seen = True

        # Если нет дублей — может это просто example.ru == translation
        if to_remove_idx is None:
            # Проверяем: если example.ru == translation, удаляем сам пример
            trans = meaning.get('translation', '')
            for i, ex in enumerate(examples):
                if ex.get('ru') == trans and ex.get('en') == en_text:
                    to_remove_idx = i
                    break

        if to_remove_idx is not None:
            removed = examples.pop(to_remove_idx)
            dup_applied.append({'word': word, 'mid': mid,
                                'removed_en': removed.get('en'), 'removed_ru': removed.get('ru')})
        else:
            dup_skipped.append({'word': word, 'mid': mid,
                                'reason': f'duplicate not found (en="{en_text}", ru="{ru_text}")'})

    return applied, skipped, dup_applied, dup_skipped


def main():
    print("Loading JSON...")
    with io.open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    data_backup = copy.deepcopy(data)
    print(f"Loaded {len(data)} entries")

    # Apply
    applied, skipped, dup_applied, dup_skipped = apply_fixes(data, FIXES, DUPLICATE_EXAMPLES_TO_REMOVE)

    print(f"\nResults:")
    print(f"  Applied fixes:  {len(applied)}")
    print(f"  Skipped fixes:  {len(skipped)}")
    print(f"  Applied dup-removes: {len(dup_applied)}")
    print(f"  Skipped dup-removes: {len(dup_skipped)}")

    if skipped:
        print(f"\nSkipped details:")
        for s in skipped:
            print(f"  [{s['word']} mid={s['meaning_id']}] {s['field']}: {s.get('reason_skip','')}")

    if dup_skipped:
        print(f"\nDup-skipped:")
        for s in dup_skipped:
            print(f"  [{s['word']} mid={s['mid']}]: {s['reason']}")

    # Save
    print(f"\nSaving to {OUT_PATH}...")
    with io.open(OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Saved.")

    # Write application report
    report = {
        'total_fixes_defined': len(FIXES),
        'applied': len(applied),
        'skipped': len(skipped),
        'dup_removed': len(dup_applied),
        'dup_skipped': len(dup_skipped),
        'applied_details': applied,
        'skipped_details': skipped,
        'dup_applied_details': dup_applied,
        'dup_skipped_details': dup_skipped,
    }
    with io.open('tmp/apply_fixes_report.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print("Report: tmp/apply_fixes_report.json")


if __name__ == "__main__":
    main()
