/**
 * update-word-data.js
 *
 * Обновляет oxford_3000.json данными из Wiktionary (kaikki.org):
 *   - relatedWords → wordFamily (из derived terms, только Oxford слова, макс 5)
 *   - synonyms (из synonyms, фильтр: без редких/устаревших, макс 6)
 *   - antonyms (из antonyms, фильтр: без редких/устаревших, макс 4)
 *
 * Правила:
 *   - Старые relatedWords удаляются (считаются недостоверными)
 *   - wordFamily = только слова из Oxford 3000, только из derived (не related)
 *   - synonyms/antonyms = без слов с пробелами, без obsolete/archaic/rare/dialectal
 *   - POS совпадает: берём только записи kaikki с той же частью речи, что у Oxford слова
 *   - Если данных нет — пустой массив []
 *   - Все остальные поля JSON не трогаем
 *
 * Запуск:
 *   node scripts/update-word-data.js
 *
 * Зависимости: только встроенные модули Node.js
 * Требования: scripts/kaikki.org-dictionary-English.jsonl.gz (скачать с kaikki.org)
 */

const fs = require('fs');
const zlib = require('zlib');
const readline = require('readline');

const OXFORD_PATH   = 'oxford_3000.json';
const KAIKKI_PATH   = 'scripts/kaikki.org-dictionary-English.jsonl.gz';
const OUTPUT_PATHS  = ['oxford_3000.json', 'src/data/oxford_3000.json'];

// Теги которые означают "редкое/устаревшее/не для обучения"
const BAD_TAGS = new Set([
  'obsolete','archaic','rare','dialectal','vulgar','offensive',
  'dated','historical','nonstandard','poetic','literary','informal',
  'slang','colloquial','derogatory','euphemistic','humorous','figurative'
]);

// Карта: Oxford partOfSpeech → kaikki pos
const POS_NORM = {
  'noun':       'noun',
  'verb':       'verb',
  'adjective':  'adj',
  'adverb':     'adv',
  'adjective/adverb': 'adj',
  'preposition':'prep',
  'conjunction':'conj',
  'pronoun':    'pron',
  'exclamation':'intj',
  'determiner': 'det',
  'number':     'num',
};

function normPos(pos) {
  return POS_NORM[pos?.toLowerCase()] || pos?.toLowerCase() || '';
}

function isBadWord(wordStr, tags) {
  if (!wordStr) return true;
  if (wordStr.includes(' ')) return true;   // фразы
  if (wordStr.length > 20) return true;     // слишком длинные
  if (tags && tags.some(t => BAD_TAGS.has(t))) return true;
  return false;
}

async function main() {
  if (!fs.existsSync(KAIKKI_PATH)) {
    console.error(`Файл не найден: ${KAIKKI_PATH}`);
    console.error('Скачай: https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl.gz');
    process.exit(1);
  }

  const oxford = JSON.parse(fs.readFileSync(OXFORD_PATH, 'utf-8'));
  console.log(`Oxford 3000: ${oxford.length} слов`);

  // Множество всех Oxford слов (lowercase) — для фильтра wordFamily
  const oxfordSet = new Set(oxford.map(w => w.word.toLowerCase()));

  // Map: lowercase word → entry (для перевода wordFamily слов)
  const oxfordMap = new Map(oxford.map(w => [w.word.toLowerCase(), w]));

  // Map: lowercase word → нормализованный POS (берём первый перевод)
  const oxfordPOS = new Map(
    oxford.map(w => [w.word.toLowerCase(), normPos(w.translations?.[0]?.partOfSpeech)])
  );

  // Собираем данные из kaikki: word → {derived[], synonyms[], antonyms[]}
  // Ключ хранения: "word::pos" чтобы разделить verb/noun для одного слова
  const wikt = {}; // word (lowercase) → {derived, synonyms, antonyms}

  console.log('Читаем kaikki.org JSONL (это займёт 2-4 минуты)...');
  let lines = 0, matched = 0;

  const rl = readline.createInterface({
    input: fs.createReadStream(KAIKKI_PATH).pipe(zlib.createGunzip()),
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    lines++;
    if (lines % 500000 === 0) {
      process.stdout.write(`\r  ${(lines/1e6).toFixed(1)}M строк, совпадений: ${matched}   `);
    }
    if (!line.startsWith('{')) continue;

    let e; try { e = JSON.parse(line); } catch { continue; }
    if (e.lang_code !== 'en') continue;

    const word = (e.word || '').toLowerCase().trim();
    if (!oxfordSet.has(word)) continue;

    matched++;
    const kaikkiPos = (e.pos || '').toLowerCase();
    const oxPos     = oxfordPOS.get(word) || '';

    // Проверяем совпадение POS.
    // Если у Oxford слова есть POS — берём только kaikki записи с тем же POS.
    // Если нет POS в Oxford — берём всё.
    const posOk = !oxPos || !kaikkiPos || (oxPos === kaikkiPos);
    if (!posOk) continue;

    if (!wikt[word]) wikt[word] = { derived: [], synonyms: [], antonyms: [] };

    // derived — только Oxford слова, без фраз, без плохих тегов
    for (const d of (e.derived || [])) {
      const dw = (d.word || '').toLowerCase().trim();
      if (isBadWord(dw, d.tags)) continue;
      if (!oxfordSet.has(dw) || dw === word) continue;
      wikt[word].derived.push(dw);
    }

    // synonyms — без фраз, без плохих тегов
    for (const s of (e.synonyms || [])) {
      const sw = (s.word || '').toLowerCase().trim();
      if (isBadWord(sw, s.tags)) continue;
      if (sw === word) continue;
      wikt[word].synonyms.push(sw);
    }

    // antonyms — без фраз, без плохих тегов
    for (const a of (e.antonyms || [])) {
      const aw = (a.word || '').toLowerCase().trim();
      if (isBadWord(aw, a.tags)) continue;
      if (aw === word) continue;
      wikt[word].antonyms.push(aw);
    }
  }

  console.log(`\nПрочитано: ${lines.toLocaleString()} строк, Oxford совпадений: ${matched}`);

  // Обновляем oxford записи
  let updated = 0, withFamily = 0, withSyn = 0, withAnt = 0;

  for (const entry of oxford) {
    const key = entry.word.toLowerCase();
    const data = wikt[key];

    // Удаляем старое поле relatedWords
    delete entry.relatedWords;

    if (!data) {
      entry.wordFamily = [];
      entry.synonyms   = [];
      entry.antonyms   = [];
      continue;
    }

    updated++;

    // wordFamily: дедупликация → макс 5
    const familyWords = [...new Set(data.derived)].slice(0, 5);
    entry.wordFamily = familyWords.map(w => {
      const ox = oxfordMap.get(w);
      const translation = ox?.translations?.[0]?.meanings?.[0] || '';
      return { word: ox ? ox.word : w, translation };
    });

    // synonyms: дедупликация → макс 6
    const synWords = [...new Set(data.synonyms)].slice(0, 6);
    entry.synonyms = synWords.map(w => {
      const ox = oxfordMap.get(w);
      const translation = ox?.translations?.[0]?.meanings?.[0] || '';
      return translation ? { word: w, translation } : { word: w };
    });

    // antonyms: дедупликация → макс 4
    const antWords = [...new Set(data.antonyms)].slice(0, 4);
    entry.antonyms = antWords.map(w => {
      const ox = oxfordMap.get(w);
      const translation = ox?.translations?.[0]?.meanings?.[0] || '';
      return translation ? { word: w, translation } : { word: w };
    });

    if (familyWords.length > 0) withFamily++;
    if (synWords.length > 0) withSyn++;
    if (antWords.length > 0) withAnt++;
  }

  console.log(`\n=== РЕЗУЛЬТАТ ===`);
  console.log(`Обновлено записей: ${updated} из ${oxford.length}`);
  console.log(`Со словообразовательной семьёй (wordFamily): ${withFamily}`);
  console.log(`С синонимами: ${withSyn}`);
  console.log(`С антонимами: ${withAnt}`);

  const json = JSON.stringify(oxford, null, 2);
  for (const p of OUTPUT_PATHS) {
    fs.writeFileSync(p, json, 'utf-8');
    console.log(`Сохранено: ${p}`);
  }
}

main().catch(e => { console.error('Ошибка:', e.message); process.exit(1); });
