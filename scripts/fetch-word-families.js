/**
 * Скачивает данные word families из kaikki.org (Wiktionary dump) для слов Oxford 3000.
 * Читает поток .jsonl.gz построчно — не скачивает весь 22 ГБ файл на диск.
 *
 * Запуск: node scripts/fetch-word-families.js
 */

const https = require('https');
const zlib  = require('zlib');
const fs    = require('fs');
const path  = require('path');
const readline = require('readline');

const OXFORD_PATH = path.resolve(__dirname, '../oxford_3000.json');
const OUTPUT_PATH = path.resolve(__dirname, '../src/data/oxford_3000.json');
const CACHE_PATH  = path.resolve(__dirname, 'word-families-cache.json');

const JSONL_GZ_URL = 'https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl.gz';

async function main() {
  const oxford = JSON.parse(fs.readFileSync(OXFORD_PATH, 'utf-8'));

  if (fs.existsSync(CACHE_PATH)) {
    console.log('Кэш найден, применяем...');
    const cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
    applyFamilies(oxford, cache);
    return;
  }

  const oxfordWords = new Set(oxford.map(w => w.word.toLowerCase()));
  console.log(`Слов в Oxford 3000: ${oxfordWords.size}`);
  console.log('Скачиваем поток с kaikki.org (~0.5 GB gzip)...');

  const families = {};
  let linesRead = 0;
  let bytesRead = 0;
  let matchedWords = 0;

  await new Promise((resolve, reject) => {
    https.get(JSONL_GZ_URL, { headers: { 'User-Agent': 'Oxford3000WordFamilyFetcher/1.0' } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }

      const gunzip = zlib.createGunzip();
      const rl = readline.createInterface({ input: res.pipe(gunzip), crlfDelay: Infinity });

      res.on('data', chunk => { bytesRead += chunk.length; });

      rl.on('line', (line) => {
        linesRead++;
        if (linesRead % 200000 === 0) {
          const mb = (bytesRead / 1024 / 1024).toFixed(0);
          process.stdout.write(`\r  ${(linesRead/1000).toFixed(0)}K строк, ~${mb} MB скачано, совпадений: ${matchedWords}   `);
        }

        if (!line.startsWith('{')) return;
        let entry;
        try { entry = JSON.parse(line); } catch { return; }

        if (entry.lang_code !== 'en') return;

        const word = (entry.word || '').toLowerCase();
        if (!oxfordWords.has(word)) return;

        matchedWords++;
        if (!families[word]) families[word] = { derived: [], related: [] };

        if (Array.isArray(entry.derived)) {
          for (const d of entry.derived) {
            const w = (d.word || '').toLowerCase().trim();
            if (w && !w.includes(' ') && w !== word) families[word].derived.push(w);
          }
        }

        if (Array.isArray(entry.related)) {
          for (const r of entry.related) {
            const w = (r.word || '').toLowerCase().trim();
            if (w && !w.includes(' ') && w !== word) families[word].related.push(w);
          }
        }
      });

      rl.on('close', () => {
        console.log(`\n\nГотово! Прочитано ${linesRead.toLocaleString()} строк.`);
        console.log(`Найдено слов с данными: ${Object.keys(families).length} из ${oxfordWords.size}`);
        resolve();
      });

      rl.on('error', reject);
      gunzip.on('error', reject);
      res.on('error', reject);
    }).on('error', reject);
  });

  for (const word of Object.keys(families)) {
    families[word].derived = [...new Set(families[word].derived)];
    families[word].related = [...new Set(families[word].related)];
  }

  fs.writeFileSync(CACHE_PATH, JSON.stringify(families, null, 2), 'utf-8');
  console.log(`Кэш сохранён: ${CACHE_PATH}`);

  applyFamilies(oxford, families);
}

function applyFamilies(oxford, families) {
  const oxfordWordSet = new Set(oxford.map(w => w.word.toLowerCase()));
  const oxfordWordMap = new Map(oxford.map(w => [w.word.toLowerCase(), w]));

  let totalAdded = 0;
  let wordsUpdated = 0;
  let wordsMissingData = 0;
  let totalRW = 0;

  for (const entry of oxford) {
    const key = entry.word.toLowerCase();
    const data = families[key];

    if (!data) { wordsMissingData++; continue; }

    const candidateWords = [...new Set([...data.derived, ...data.related])];
    const validRelated = candidateWords.filter(w => oxfordWordSet.has(w) && w !== key);

    if (validRelated.length === 0) continue;

    const existingSet = new Set((entry.relatedWords || []).map(r => r.word.toLowerCase()));
    const toAdd = [];

    for (const w of validRelated) {
      if (existingSet.has(w)) continue;
      const otherEntry = oxfordWordMap.get(w);
      if (!otherEntry) continue;
      const translation = otherEntry.translations?.[0]?.meanings?.[0] || w;
      toAdd.push({ word: otherEntry.word, translation });
    }

    if (toAdd.length > 0) {
      entry.relatedWords = [...(entry.relatedWords || []), ...toAdd];
      totalAdded += toAdd.length;
      wordsUpdated++;
    }

    totalRW += entry.relatedWords?.length || 0;
  }

  console.log(`\n=== РЕЗУЛЬТАТ ===`);
  console.log(`Обновлено слов: ${wordsUpdated}`);
  console.log(`Добавлено relatedWords: ${totalAdded}`);
  console.log(`Слов без данных Wiktionary: ${wordsMissingData}`);
  console.log(`Всего relatedWords в словаре: ${totalRW}`);

  const json = JSON.stringify(oxford, null, 2);
  fs.writeFileSync(OXFORD_PATH, json, 'utf-8');
  fs.writeFileSync(OUTPUT_PATH, json, 'utf-8');
  console.log(`Сохранено!`);
}

main().catch(err => {
  console.error('Ошибка:', err.message);
  process.exit(1);
});
